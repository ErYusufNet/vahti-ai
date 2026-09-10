/**
 * GÖREV A/E — muistivarasto yhteydenottopyynnöille, kun tietokantaa ei ole.
 * Elää dev-palvelimen ajan. Siemennetty parilla esimerkillä, jotta
 * dashboardin näkymä ei ole tyhjä demossa.
 */
export type CallbackRow = {
  id: string;
  klinikId: string;
  nimi: string;
  email: string | null;
  puhelin: string | null;
  aihe: string | null;
  viesti: string;
  tapa: string; // teksti | aani
  lahde: string; // widget | call-link
  tila: string; // uusi | kasitelty
  assignedToId: string | null;
  assignedToNimi: string | null;
  createdAt: string;
};

const MEM: CallbackRow[] = [
  {
    id: "cb_seed1",
    klinikId: "demo",
    nimi: "Riikka Salo",
    email: "riikka.salo@example.fi",
    puhelin: "+358 40 123 4567",
    aihe: "Implanttikonsultaatio",
    viesti: "Haluaisin varata ajan implanttiarvioon ensi viikolle. Sopisiko iltapäivä?",
    tapa: "aani",
    lahde: "widget",
    tila: "uusi",
    assignedToId: "u2",
    assignedToNimi: "Mikko Räsänen",
    createdAt: "2026-09-10T06:12:00Z",
  },
  {
    id: "cb_seed2",
    klinikId: "demo",
    nimi: "Jari Nieminen",
    email: null,
    puhelin: "+358 50 987 6543",
    aihe: "Hammassärky",
    viesti: "Kova särky oikeassa alaposkihampaassa. Tarvitsen ajan mahdollisimman pian.",
    tapa: "aani",
    lahde: "call-link",
    tila: "kasitelty",
    assignedToId: "u3",
    assignedToNimi: "Elina Salo",
    createdAt: "2026-09-09T17:40:00Z",
  },
];

export function memList(): CallbackRow[] {
  return [...MEM].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function memAdd(row: CallbackRow): void {
  MEM.unshift(row);
}
export function memCount(): number {
  return MEM.length;
}
