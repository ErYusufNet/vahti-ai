/**
 * Vahti AI — hinnoittelun yksi totuuslähde.
 * Sekä laskeutumissivun hinnoitteluosio että /pricing lukevat tästä, jotta ne
 * pysyvät yhtenäisinä. Tekstit ovat messages/*.json:ssa ("Pricing"-nimiavaruus);
 * täällä on vain rakenne + minkä paketin mikäkin ominaisuus kattaa.
 *
 * Fin markkinan hintataso (alv 0 %). STOAIX:n hintoja EI kopioitu.
 */
export type PlanId = "essential" | "professional" | "business" | "enterprise";

export const PLAN_ORDER: PlanId[] = [
  "essential",
  "professional",
  "business",
  "enterprise",
];

export const POPULAR_PLAN: PlanId = "professional";

/** Kuukausihinta (näytetään; alv 0 %). Enterprise = "räätälöity". */
export const PLAN_PRICE_EUR: Record<PlanId, number | null> = {
  essential: 149,
  professional: 349,
  business: 749,
  enterprise: null,
};

type ValueRow = {
  kind: "value";
  label: string; // message-avain (Pricing.*)
  featured?: boolean; // näytetäänkö tiivistetyssä (landing) taulukossa
  values: Record<PlanId, string>; // message-avaimet
};
type BoolRow = {
  kind: "bool";
  label: string;
  featured?: boolean;
  from: PlanId; // sisältyy tästä paketista ylöspäin
};
export type PricingRow = ValueRow | BoolRow;

/**
 * Ominaisuus–paketti-logiikka (docs Ek #3, kohta 2.2):
 *  WhatsApp/chat        → Essential+
 *  Ääni-AI (gelen)      → Professional+
 *  Ääni-AI (giden)      → Business+
 *  CRM & liidiputki     → Business+
 *  Täysi monikielisyys  → Business+ (FI+EN peruspaketeissa)
 *  Zapier / Webhook API → Business+
 */
export const PRICING_ROWS: PricingRow[] = [
  {
    kind: "value",
    label: "rowConversations",
    featured: true,
    values: { essential: "valConvE", professional: "valConvP", business: "valConvB", enterprise: "valConvX" },
  },
  { kind: "bool", label: "rowWhatsapp", featured: true, from: "essential" },
  { kind: "bool", label: "rowWebchat", from: "essential" },
  { kind: "bool", label: "rowVoiceIn", featured: true, from: "professional" },
  { kind: "bool", label: "rowVoiceOut", featured: true, from: "business" },
  { kind: "bool", label: "rowRag", from: "professional" },
  { kind: "bool", label: "rowWorkflows", featured: true, from: "professional" },
  { kind: "bool", label: "rowCrm", featured: true, from: "business" },
  {
    kind: "value",
    label: "rowLanguages",
    featured: true,
    values: { essential: "valLangE", professional: "valLangP", business: "valLangB", enterprise: "valLangX" },
  },
  { kind: "bool", label: "rowCalendar", from: "professional" },
  { kind: "bool", label: "rowZapier", featured: true, from: "business" },
  {
    kind: "value",
    label: "rowSeats",
    values: { essential: "valSeatsE", professional: "valSeatsP", business: "valSeatsB", enterprise: "valSeatsX" },
  },
  {
    kind: "value",
    label: "rowSupport",
    values: { essential: "valSupE", professional: "valSupP", business: "valSupB", enterprise: "valSupX" },
  },
];

export function planIncludes(from: PlanId, plan: PlanId): boolean {
  return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(from);
}
