import Anthropic from "@anthropic-ai/sdk";
import { anthropicKey, env } from "@/lib/env";
import { buildSystemPrompt } from "./knowledge";
import { AGENT_TOOLS, runTool } from "./tools";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type AgentResult = {
  reply: string;
  language: "fi" | "en";
  toolCalls: { name: string; input: unknown; result: unknown }[];
  /** "live" = oikea Claude-kutsu, "mock" = ei API-avainta / kutsu epäonnistui. */
  mode: "live" | "mock";
  model: string | null;
  note?: string;
};

const MODEL = env.anthropicModel(); // oletus claude-sonnet-5 (spec Görev 2)

/** Kevyt fi/en-kielitunnistus (mock-tilaa ja raportointia varten). */
export function detectLanguage(text: string): "fi" | "en" {
  const t = text.toLowerCase();
  const fi = (
    t.match(
      /\b(hei|moi|kiitos|paljonko|haluaisin|onko|aika|ajan|hammas|voitteko|milloin|maksaa|varata|tarkastus)\b/g,
    ) || []
  ).length;
  const fiChars = (t.match(/[äö]/g) || []).length;
  const en = (
    t.match(
      /\b(hi|hello|thanks|thank you|how much|would like|is there|appointment|tooth|teeth|can you|when|cost|price|book)\b/g,
    ) || []
  ).length;
  return en > fi + fiChars ? "en" : "fi";
}

/**
 * Aja agentti. Yksi (max 3) tool-kierros. Ilman toimivaa ANTHROPIC_API_KEY:tä
 * palautetaan sääntöpohjainen mock-vastaus, jotta järjestelmä toimii ilman avainta.
 */
export async function runAgent(messages: ChatMsg[]): Promise<AgentResult> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const language = detectLanguage(lastUser?.content ?? "");

  if (!anthropicKey()) {
    return {
      ...mockAgentReply(lastUser?.content ?? "", language),
      note: "ANTHROPIC_API_KEY puuttuu tai on placeholder — mock-vastaus.",
    };
  }

  try {
    return await runLiveAgent(messages, language, lastUser?.content ?? "");
  } catch (err) {
    console.error("[agent] live-kutsu epäonnistui, siirrytään mock-tilaan:", err);
    return {
      ...mockAgentReply(lastUser?.content ?? "", language),
      note: `Claude-kutsu epäonnistui (${String(err).slice(0, 140)}) — mock-vastaus.`,
    };
  }
}

async function runLiveAgent(
  messages: ChatMsg[],
  language: "fi" | "en",
  lastUserText: string,
): Promise<AgentResult> {
  const client = new Anthropic({ apiKey: anthropicKey() });
  // Görev 7: system prompt sisältää vain kysymykseen osuvat tietopalat (RAG).
  const system = await buildSystemPrompt(lastUserText);
  const toolCalls: AgentResult["toolCalls"] = [];

  const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system,
    tools: AGENT_TOOLS,
    messages: apiMessages,
  });

  let guard = 0;
  while (response.stop_reason === "tool_use" && guard < 3) {
    guard++;
    apiMessages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await runTool(block.name, block.input);
        toolCalls.push({ name: block.name, input: block.input, result });
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }

    apiMessages.push({ role: "user", content: toolResults });
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system,
      tools: AGENT_TOOLS,
      messages: apiMessages,
    });
  }

  const reply = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return { reply, language, toolCalls, mode: "live", model: response.model };
}

/** Ilman API-avainta: yksinkertainen sääntöpohjainen vastaus. */
function mockAgentReply(userText: string, language: "fi" | "en"): AgentResult {
  const t = userText.toLowerCase();
  const priceHit = /(hinta|maksaa|paljonko|price|cost|how much)/.test(t);
  const bookHit = /(varata|aika|ajan|book|appointment|slot)/.test(t);

  let reply: string;
  if (language === "en") {
    reply = priceHit
      ? "A dental implant costs 1,800–2,400 € including consultation, surgery and crown. Interest-free instalments are available. Would you like a free assessment visit?"
      : bookHit
        ? "We have openings this Thursday at 14:00 and 15:30. Which works better for you?"
        : "Thanks for your message! I can help with prices, opening hours and booking. What would you like to know?";
  } else {
    reply = priceHit
      ? "Yhden implantin hinta on 1 800–2 400 €, ja siihen sisältyy konsultaatio, leikkaus ja kruunu. Koroton osamaksu on mahdollinen. Varataanko maksuton arviokäynti?"
      : bookHit
        ? "Torstaina on vapaana klo 14.00 ja 15.30. Kumpi sopii paremmin?"
        : "Kiitos viestistäsi! Voin auttaa hinnoissa, aukioloajoissa ja ajanvarauksessa. Mitä haluaisit tietää?";
  }

  return { reply, language, toolCalls: [], mode: "mock", model: null };
}
