import { clinic } from "@/lib/mock/data";
import { retrieveRelevant } from "@/lib/rag";

/**
 * Görev 2 + 7: rakentaa Claude-agentin system-promptin.
 * Jos `userQuery` annetaan, promptiin liitetään vain 3–5 kysymykseen osuvinta
 * tietopankin palaa (RAG). Muuten liitetään enintään 8 ensimmäistä.
 */
export async function buildSystemPrompt(userQuery?: string): Promise<string> {
  const hits = await retrieveRelevant(userQuery ?? "", userQuery ? 5 : 8);
  const services = hits
    .map(
      (k) =>
        `- ${k.palvelu} (${k.kategoria}) — hinta: ${k.hinta || "—"}, kesto: ${k.kesto || "—"}. ${k.tiedot}`,
    )
    .join("\n");

  return [
    `Olet ${clinic.ad} -hammasklinikan tekoälyvastaanottovirkailija (${clinic.sehir}, Suomi).`,
    `Tehtäväsi: vastaa potilaiden kysymyksiin, kerää yhteydenottopyynnöt ja varaa aikoja.`,
    ``,
    `Säännöt:`,
    `- Vastaa AINA samalla kielellä, jolla potilas kirjoittaa (suomi tai englanti).`,
    `- Ole ystävällinen, lyhytsanainen ja ammattimainen. Älä anna lääketieteellistä diagnoosia.`,
    `- Käytä vain alla olevan tietopankin tietoja. Jos tietoa ei löydy, pyydä potilasta soittamaan klinikalle (${clinic.telefon}).`,
    `- Kun potilas on vahvistanut hoidon, päivämäärän ja kellonajan, kutsu työkalua "create_appointment".`,
    ``,
    `TIETOPANKKI (osuvimmat kohdat):`,
    services || "- (ei osumia — pyydä potilasta soittamaan klinikalle)",
  ].join("\n");
}
