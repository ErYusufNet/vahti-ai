/**
 * Görev 8 — työnkulkujen määrittelyt.
 * `cron` = node-cronin aikataulu (ajetaan instrumentation.ts:n kautta).
 */
export type WorkflowDef = {
  id: string;
  nimi: string;
  kuvaus: string;
  liipaisin: string;
  cron: string;
  /** Oletuksena aktiivinen? (Näytöllä voi silti ajaa "Aja"-napista.) */
  aktiivinen: boolean;
};

export const WORKFLOW_DEFS: WorkflowDef[] = [
  {
    id: "kuuma-seuranta",
    nimi: "Kuuma seuranta",
    kuvaus:
      "Lähettää seurantaviestin liidille, joka on vaiheessa 'kuuma' tai 'arviointi' eikä häneen ole oltu yhteydessä 4 tuntiin.",
    liipaisin: "Ei kontaktia 4 h + vaihe kuuma/arviointi",
    cron: "*/15 * * * *", // 15 min välein
    aktiivinen: true,
  },
  {
    id: "ajanvaraus-muistutus",
    nimi: "Ajanvarausmuistutus",
    kuvaus: "Muistuttaa varatusta ajasta, kun käyntiin on alle 24 tuntia.",
    liipaisin: "Aika alkaa < 24 h",
    cron: "0 * * * *", // tunnin välein
    aktiivinen: true,
  },
  {
    id: "reaktivointi",
    nimi: "Reaktivointi",
    kuvaus:
      "Ottaa yhteyttä liideihin, joihin ei ole oltu yhteydessä yli 60 päivään eivätkä he ole varanneet aikaa.",
    liipaisin: "60 pv ilman kontaktia",
    cron: "0 9 * * *", // päivittäin klo 9
    aktiivinen: false, // luonnos
  },
];

export function getWorkflowDef(id: string): WorkflowDef | undefined {
  return WORKFLOW_DEFS.find((w) => w.id === id);
}

/** Viestipohjat (fi/en). */
export function messageFor(
  workflowId: string,
  lang: "fi" | "en",
  vars: { nimi?: string; aika?: string; palvelu?: string },
): string {
  const nimi = vars.nimi ?? (lang === "fi" ? "hei" : "hi");
  if (workflowId === "kuuma-seuranta") {
    return lang === "fi"
      ? `Hei ${nimi}! Halusimme vielä varmistaa, jäikö jotain kysyttävää hoidosta. Vastaamme mielellämme ja voimme myös varata sinulle sopivan ajan.`
      : `Hi ${nimi}! We wanted to check if you still have any questions about the treatment. We're happy to help and can also book you a suitable appointment.`;
  }
  if (workflowId === "ajanvaraus-muistutus") {
    return lang === "fi"
      ? `Muistutus: sinulla on aika ${vars.palvelu ?? "hoitoon"} ${vars.aika ?? ""}. Jos aika ei sovi, ilmoitathan viimeistään 24 h ennen.`
      : `Reminder: you have an appointment for ${vars.palvelu ?? "treatment"} ${vars.aika ?? ""}. If it doesn't suit you, please let us know at least 24 h in advance.`;
  }
  // reaktivointi
  return lang === "fi"
    ? `Hei ${nimi}! Emme ole kuulleet sinusta hetkeen. Jos hammashoito on vielä ajankohtainen, autamme mielellämme löytämään sopivan ajan.`
    : `Hi ${nimi}! We haven't heard from you in a while. If you're still considering dental care, we'd be happy to help you find a suitable time.`;
}
