/**
 * Vahti AI — keskitetty mock-data.
 *
 * Kaikki dashboardin näkymät lukevat tästä tiedostosta, kunnes oikea
 * tietokantakerros (Prisma) ja integraatiot (WhatsApp, puhelu, RAG) kytketään.
 * Sisältö on suomenkielistä, koska se edustaa tietokannan rivejä — ei
 * käyttöliittymän tekstejä (ne ovat messages/fi.json:ssa).
 */

export type Channel = "whatsapp" | "voice" | "webchat" | "instagram";
export type Lang = "fi" | "en" | "sv";

/** Liidiputken vaiheet (avain = vakaa tunniste, otsikko = messages/fi.json). */
export const PIPELINE_STAGES = [
  "uusi",
  "arviointi",
  "kuuma",
  "hoivaus",
  "ajanvaraus",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

// --- Klinikka (aktiivinen tenant) ------------------------------------------
export const clinic = {
  id: "clinic_demo",
  slug: "aurora",
  ad: "Hammasklinikka Aurora",
  email: "info@aurorahammas.fi",
  telefon: "+358 9 123 4567",
  varayhteysNumero: "+358 9 123 4599",
  sehir: "Helsinki",
  ulke: "Suomi",
  sektor: "Hammaslääkäri",
  aiDili: "fi (automaattinen tunnistus)",
  saatDilimi: "Europe/Helsinki",
  plan: "Professional",
};

// --- Käyttäjät ------------------------------------------------------------
export const users = [
  { id: "u1", ad: "Sanna Aalto", email: "sanna@aurorahammas.fi", rol: "omistaja" },
  { id: "u2", ad: "Mikko Räsänen", email: "mikko@aurorahammas.fi", rol: "vastaanotto" },
  { id: "u3", ad: "Elina Salo", email: "elina@aurorahammas.fi", rol: "hoitaja" },
];

// --- Liidit -------------------------------------------------------------
export type Lead = {
  id: string;
  isim: string;
  dil: Lang;
  kaynakKanal: Channel;
  leadSkoru: number;
  pipelineAsamasi: PipelineStage;
  palvelu: string; // kiinnostuksen kohde
  luotu: string; // ISO
  viimeinenKontakti: string; // ISO
};

export const leads: Lead[] = [
  { id: "l1", isim: "Matti Virtanen", dil: "fi", kaynakKanal: "whatsapp", leadSkoru: 82, pipelineAsamasi: "kuuma", palvelu: "Implantti", luotu: "2026-09-08T09:12:00Z", viimeinenKontakti: "2026-09-10T07:40:00Z" },
  { id: "l2", isim: "Liisa Korhonen", dil: "fi", kaynakKanal: "webchat", leadSkoru: 45, pipelineAsamasi: "arviointi", palvelu: "Hammasvalkaisu", luotu: "2026-09-09T14:05:00Z", viimeinenKontakti: "2026-09-10T06:15:00Z" },
  { id: "l3", isim: "Juha Mäkinen", dil: "fi", kaynakKanal: "voice", leadSkoru: 67, pipelineAsamasi: "hoivaus", palvelu: "Kruunu", luotu: "2026-09-05T11:30:00Z", viimeinenKontakti: "2026-09-09T15:20:00Z" },
  { id: "l4", isim: "Anna Nieminen", dil: "fi", kaynakKanal: "whatsapp", leadSkoru: 91, pipelineAsamasi: "ajanvaraus", palvelu: "Oikomishoito", luotu: "2026-09-03T08:00:00Z", viimeinenKontakti: "2026-09-10T05:50:00Z" },
  { id: "l5", isim: "Pekka Hämäläinen", dil: "fi", kaynakKanal: "webchat", leadSkoru: 28, pipelineAsamasi: "uusi", palvelu: "Tarkastus", luotu: "2026-09-10T05:02:00Z", viimeinenKontakti: "2026-09-10T05:02:00Z" },
  { id: "l6", isim: "Sofia Laine", dil: "en", kaynakKanal: "instagram", leadSkoru: 58, pipelineAsamasi: "arviointi", palvelu: "Juurihoito", luotu: "2026-09-08T16:44:00Z", viimeinenKontakti: "2026-09-09T18:10:00Z" },
  { id: "l7", isim: "Ville Heikkinen", dil: "fi", kaynakKanal: "voice", leadSkoru: 74, pipelineAsamasi: "kuuma", palvelu: "Implantti (2 hammasta)", luotu: "2026-09-07T10:15:00Z", viimeinenKontakti: "2026-09-10T04:30:00Z" },
  { id: "l8", isim: "Emma Järvinen", dil: "fi", kaynakKanal: "webchat", leadSkoru: 19, pipelineAsamasi: "uusi", palvelu: "Hammaskiven poisto", luotu: "2026-09-10T03:20:00Z", viimeinenKontakti: "2026-09-10T03:20:00Z" },
  { id: "l9", isim: "Olli Mattila", dil: "fi", kaynakKanal: "whatsapp", leadSkoru: 63, pipelineAsamasi: "hoivaus", palvelu: "Viisaudenhampaan poisto", luotu: "2026-09-04T12:00:00Z", viimeinenKontakti: "2026-09-08T09:00:00Z" },
  { id: "l10", isim: "Katri Salminen", dil: "sv", kaynakKanal: "webchat", leadSkoru: 51, pipelineAsamasi: "arviointi", palvelu: "Hammasvalkaisu", luotu: "2026-09-09T09:30:00Z", viimeinenKontakti: "2026-09-09T09:55:00Z" },
  { id: "l11", isim: "Antti Laaksonen", dil: "fi", kaynakKanal: "voice", leadSkoru: 88, pipelineAsamasi: "ajanvaraus", palvelu: "Implantti", luotu: "2026-09-02T13:10:00Z", viimeinenKontakti: "2026-09-10T06:00:00Z" },
  { id: "l12", isim: "Noora Koskinen", dil: "fi", kaynakKanal: "instagram", leadSkoru: 34, pipelineAsamasi: "uusi", palvelu: "Hammaskorut", luotu: "2026-09-10T02:11:00Z", viimeinenKontakti: "2026-09-10T02:11:00Z" },
  { id: "l13", isim: "Timo Rantala", dil: "fi", kaynakKanal: "whatsapp", leadSkoru: 70, pipelineAsamasi: "kuuma", palvelu: "Kruunu + juurihoito", luotu: "2026-09-06T15:25:00Z", viimeinenKontakti: "2026-09-09T20:05:00Z" },
  { id: "l14", isim: "Hanna Väisänen", dil: "en", kaynakKanal: "webchat", leadSkoru: 42, pipelineAsamasi: "hoivaus", palvelu: "Checkup", luotu: "2026-09-05T07:45:00Z", viimeinenKontakti: "2026-09-07T11:30:00Z" },
];

// --- Keskustelut (Saapuneet) -------------------------------------------
export type Message = {
  rooli: "potilas" | "tekoäly" | "hoitaja";
  teksti: string;
  aika: string; // HH:mm
};

export type Conversation = {
  id: string;
  leadId: string;
  isim: string;
  kanava: Channel;
  dil: Lang;
  esikatselu: string;
  aikaleima: string; // ISO
  lukematon: boolean;
  viestit: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    leadId: "l1",
    isim: "Matti Virtanen",
    kanava: "whatsapp",
    dil: "fi",
    esikatselu: "Kiitos, sopii hyvin torstaina klo 14.",
    aikaleima: "2026-09-10T07:40:00Z",
    lukematon: true,
    viestit: [
      { rooli: "potilas", teksti: "Hei, paljonko yksi implantti maksaa teillä?", aika: "07:31" },
      { rooli: "tekoäly", teksti: "Hei Matti! Yhden implantin kokonaishinta on meillä 1 800–2 400 € riippuen luun tilanteesta. Hintaan sisältyy konsultaatio, leikkaus ja kruunu. Haluatko varata maksuttoman arviokäynnin?", aika: "07:31" },
      { rooli: "potilas", teksti: "Joo kiitos. Onko torstaina aikoja?", aika: "07:38" },
      { rooli: "tekoäly", teksti: "Torstaina 12.9. on vapaana klo 14.00 ja klo 15.30. Kumpi sopii paremmin?", aika: "07:38" },
      { rooli: "potilas", teksti: "Kiitos, sopii hyvin torstaina klo 14.", aika: "07:40" },
    ],
  },
  {
    id: "c2",
    leadId: "l2",
    isim: "Liisa Korhonen",
    kanava: "webchat",
    dil: "fi",
    esikatselu: "Onko valkaisu turvallista jos on paikkoja?",
    aikaleima: "2026-09-10T06:15:00Z",
    lukematon: true,
    viestit: [
      { rooli: "potilas", teksti: "Moi, mietin hammasvalkaisua. Paljonko se maksaa?", aika: "06:10" },
      { rooli: "tekoäly", teksti: "Hei! Klinikkavalkaisu maksaa 250 € ja kotivalkaisu lusikoilla 190 €. Molempiin kuuluu hammaslääkärin tarkastus ennen hoitoa.", aika: "06:10" },
      { rooli: "potilas", teksti: "Onko valkaisu turvallista jos on paikkoja?", aika: "06:15" },
    ],
  },
  {
    id: "c3",
    leadId: "l7",
    isim: "Ville Heikkinen",
    kanava: "voice",
    dil: "fi",
    esikatselu: "Puhelu litteroitu — soittaa uudelleen huomenna.",
    aikaleima: "2026-09-10T04:30:00Z",
    lukematon: false,
    viestit: [
      { rooli: "tekoäly", teksti: "Hammasklinikka Aurora, tekoälyvastaanotto. Kuinka voin auttaa?", aika: "04:26" },
      { rooli: "potilas", teksti: "Mulla on kaksi hammasta poikki takaa, tarvin kuulemma implantit. Onks teillä osamaksua?", aika: "04:27" },
      { rooli: "tekoäly", teksti: "Kyllä, tarjoamme 6–24 kk korottoman osamaksun. Kahden implantin hinta on noin 3 400–4 200 €. Varataanko arviokäynti?", aika: "04:28" },
      { rooli: "potilas", teksti: "Katson kalenteria ja soitan huomenna uudestaan.", aika: "04:30" },
    ],
  },
  {
    id: "c4",
    leadId: "l6",
    isim: "Sofia Laine",
    kanava: "instagram",
    dil: "en",
    esikatselu: "Great, I'll take the Tuesday 10:00 slot.",
    aikaleima: "2026-09-09T18:10:00Z",
    lukematon: false,
    viestit: [
      { rooli: "potilas", teksti: "Hi! Do you do root canal treatment? How much is it?", aika: "18:02" },
      { rooli: "tekoäly", teksti: "Hi Sofia! Yes, root canal treatment costs 350–520 € depending on the tooth. A crown afterwards is 650 €. Would you like to book a consultation?", aika: "18:02" },
      { rooli: "potilas", teksti: "Yes please, something next week?", aika: "18:08" },
      { rooli: "tekoäly", teksti: "Next week we have Tuesday 16.9. at 10:00 or Thursday 18.9. at 13:00.", aika: "18:09" },
      { rooli: "potilas", teksti: "Great, I'll take the Tuesday 10:00 slot.", aika: "18:10" },
    ],
  },
  {
    id: "c5",
    leadId: "l5",
    isim: "Pekka Hämäläinen",
    kanava: "webchat",
    dil: "fi",
    esikatselu: "Haluaisin varata perustarkastuksen.",
    aikaleima: "2026-09-10T05:02:00Z",
    lukematon: true,
    viestit: [
      { rooli: "potilas", teksti: "Haluaisin varata perustarkastuksen.", aika: "05:02" },
    ],
  },
  {
    id: "c6",
    leadId: "l4",
    isim: "Anna Nieminen",
    kanava: "whatsapp",
    dil: "fi",
    esikatselu: "Vahvistettu: oikomishoidon aloitus 22.9. klo 9.",
    aikaleima: "2026-09-10T05:50:00Z",
    lukematon: false,
    viestit: [
      { rooli: "potilas", teksti: "Onko näkymätön oikomishoito (Invisalign) mahdollinen aikuiselle?", aika: "05:40" },
      { rooli: "tekoäly", teksti: "Kyllä, suurin osa aikuisten tapauksista onnistuu läpinäkyvillä kiskoilla. Hoidon hinta on 3 500–5 500 € ja kesto 8–18 kk. Aloitamme 3D-skannauksella.", aika: "05:41" },
      { rooli: "potilas", teksti: "Varataan aloitus. Maanantai kävisi.", aika: "05:48" },
      { rooli: "tekoäly", teksti: "Vahvistettu: oikomishoidon aloitus 22.9. klo 9.", aika: "05:50" },
    ],
  },
];

// --- Puhelut ---------------------------------------------------------------
export type Call = {
  id: string;
  soittaja: string;
  suunta: "saapuva" | "lähtevä";
  kesto: string; // mm:ss
  kasittelija: string;
  tila: "vastattu" | "vastaamaton" | "kesken";
  aika: string; // ISO
  yhteenveto: string;
  kerätytTiedot: { avain: string; arvo: string }[];
  ehdotus: string;
  leadSkoru: number;
};

export const calls: Call[] = [
  {
    id: "call1",
    soittaja: "Ville Heikkinen",
    suunta: "saapuva",
    kesto: "03:42",
    kasittelija: "Tekoäly",
    tila: "vastattu",
    aika: "2026-09-10T04:26:00Z",
    yhteenveto:
      "Soittaja tarvitsee kaksi implanttia takahampaisiin. Kysyi osamaksusta. Tekoäly tarjosi korotonta 6–24 kk osamaksua ja hinta-arvion 3 400–4 200 €. Soittaja harkitsee ja palaa asiaan huomenna.",
    kerätytTiedot: [
      { avain: "Hoidon tarve", arvo: "2 implanttia (takahampaat)" },
      { avain: "Budjetti", arvo: "Kiinnostunut osamaksusta" },
      { avain: "Aikataulu", arvo: "Palaa asiaan 1–2 pv" },
      { avain: "Sijainti", arvo: "Helsinki" },
    ],
    ehdotus: "Lähetä WhatsApp-viesti osamaksuesimerkillä + 2 vapaata aikaa arviokäynnille.",
    leadSkoru: 74,
  },
  {
    id: "call2",
    soittaja: "Antti Laaksonen",
    suunta: "saapuva",
    kesto: "05:10",
    kasittelija: "Tekoäly → Mikko Räsänen",
    tila: "vastattu",
    aika: "2026-09-10T06:00:00Z",
    yhteenveto:
      "Kiireellinen implanttitarve etuhampaaseen (lohkeama). Tekoäly keräsi esitiedot ja siirsi puhelun vastaanottoon. Aika varattu perjantaille 12.9. klo 9.00.",
    kerätytTiedot: [
      { avain: "Hoidon tarve", arvo: "1 implantti (etuhammas, lohkeama)" },
      { avain: "Kiireellisyys", arvo: "Korkea" },
      { avain: "Aikataulu", arvo: "Aika varattu pe 12.9. klo 9.00" },
    ],
    ehdotus: "Muistutusviesti 24 h ennen. Valmistele panoraamakuva-aika samalle käynnille.",
    leadSkoru: 88,
  },
  {
    id: "call3",
    soittaja: "+358 40 555 1234",
    suunta: "saapuva",
    kesto: "00:00",
    kasittelija: "—",
    tila: "vastaamaton",
    aika: "2026-09-10T01:12:00Z",
    yhteenveto: "Vastaamaton puhelu yöaikaan. Tekoäly lähetti automaattisen tekstiviestin takaisinsoittopyynnöllä.",
    kerätytTiedot: [],
    ehdotus: "Soita takaisin aamulla klo 9 jälkeen.",
    leadSkoru: 20,
  },
  {
    id: "call4",
    soittaja: "Juha Mäkinen",
    suunta: "lähtevä",
    kesto: "02:05",
    kasittelija: "Tekoäly (Kuuma seuranta -työnkulku)",
    tila: "vastattu",
    aika: "2026-09-09T15:20:00Z",
    yhteenveto:
      "Automaattinen seurantasoitto kruunutarjouksesta. Soittaja haluaa miettiä viikonlopun yli. Tekoäly sopi uuden yhteydenoton maanantaiksi.",
    kerätytTiedot: [
      { avain: "Hoidon tarve", arvo: "Kruunu (yksi hammas)" },
      { avain: "Este", arvo: "Miettii hintaa, vertailee klinikoita" },
      { avain: "Seuraava kontakti", arvo: "Maanantai" },
    ],
    ehdotus: "Lähetä vertailuetu: ilmainen konsultaatio + 10 % alennus tällä viikolla varatessa.",
    leadSkoru: 67,
  },
];

// --- Tietopankki (RAG-lähde) --------------------------------------------
export type KnowledgeEntry = {
  id: string;
  palvelu: string;
  kategoria: string;
  hinta: string;
  kesto: string;
  tiedot: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  { id: "k1", palvelu: "Perustarkastus", kategoria: "Ennaltaehkäisy", hinta: "60 €", kesto: "30 min", tiedot: "Sisältää hampaiden ja ikenien tutkimuksen, purennan arvion ja hoitosuunnitelman. Röntgenkuvat tarvittaessa +25 €." },
  { id: "k2", palvelu: "Hammaskiven poisto", kategoria: "Ennaltaehkäisy", hinta: "90 €", kesto: "45 min", tiedot: "Ultraäänipuhdistus ja kiillotus. Suositellaan 1–2 kertaa vuodessa." },
  { id: "k3", palvelu: "Klinikkavalkaisu", kategoria: "Kosmetiikka", hinta: "250 €", kesto: "60 min", tiedot: "Yhden käynnin valkaisu. Vaatii tarkastuksen ja hammaskiven poiston ennen hoitoa. Ei suositella raskaana oleville." },
  { id: "k4", palvelu: "Implantti", kategoria: "Kirurgia", hinta: "1 800–2 400 €", kesto: "2–4 käyntiä", tiedot: "Titaani-implantti + kruunu. Hintaan sisältyy konsultaatio, leikkaus ja lopullinen kruunu. Koroton 6–24 kk osamaksu." },
  { id: "k5", palvelu: "Juurihoito", kategoria: "Hoito", hinta: "350–520 €", kesto: "1–2 käyntiä", tiedot: "Hinta riippuu hampaan juurikanavien määrästä. Kruunu juurihoidon jälkeen 650 €." },
  { id: "k6", palvelu: "Näkymätön oikomishoito", kategoria: "Oikomishoito", hinta: "3 500–5 500 €", kesto: "8–18 kk", tiedot: "Läpinäkyvät kiskot aikuisille ja nuorille. Aloitus 3D-skannauksella. Kuukausierä alk. 190 €." },
  { id: "k7", palvelu: "Aukioloajat", kategoria: "Yleistieto", hinta: "—", kesto: "—", tiedot: "Ma–pe 8–18, la 9–14. Päivystys sunnuntaisin klo 10–13 puhelimitse." },
  { id: "k8", palvelu: "Peruutusehdot", kategoria: "Yleistieto", hinta: "—", kesto: "—", tiedot: "Peruutus viimeistään 24 h ennen aikaa maksutta. Myöhäisestä peruutuksesta veloitetaan 50 % hinnasta." },
];

// --- Työnkulut (automaatiot) ------------------------------------------
export type Workflow = {
  id: string;
  nimi: string;
  kuvaus: string;
  liipaisin: string;
  tila: "aktiivinen" | "luonnos";
  ajokerrat: number;
  viimeinenAjo: string | null;
};

// id:t vastaavat lib/workflows/definitions.ts:ää niille 3:lle, jotka on
// toteutettu oikeasti (Görev 8). Loput 3 ovat vielä suunnitelmia.
export const workflows: Workflow[] = [
  { id: "ensikontaktisoitto", nimi: "Ensikontaktisoitto", kuvaus: "Soittaa uudelle liidille automaattisesti 60 sekunnin sisällä yhteydenotosta.", liipaisin: "Uusi liidi luotu", tila: "luonnos", ajokerrat: 0, viimeinenAjo: null },
  { id: "kuuma-seuranta", nimi: "Kuuma seuranta", kuvaus: "Lähettää seurantaviestin liidille (vaihe kuuma/arviointi), johon ei ole oltu yhteydessä 4 tuntiin.", liipaisin: "Ei kontaktia 4 h", tila: "aktiivinen", ajokerrat: 342, viimeinenAjo: "2026-09-10T03:15:00Z" },
  { id: "ajanvaraus-muistutus", nimi: "Ajanvarausmuistutus", kuvaus: "Muistuttaa varatusta ajasta, kun käyntiin on alle 24 tuntia.", liipaisin: "Aika alkaa < 24 h", tila: "aktiivinen", ajokerrat: 891, viimeinenAjo: "2026-09-10T06:30:00Z" },
  { id: "peruuntuneen-seuranta", nimi: "Peruuntuneen seuranta", kuvaus: "Ottaa yhteyttä, jos potilas ei saapunut varatulle ajalle (no-show).", liipaisin: "Aika ohitettu ilman saapumista", tila: "luonnos", ajokerrat: 0, viimeinenAjo: null },
  { id: "tyytyvaisyyskysely", nimi: "Tyytyväisyyskysely", kuvaus: "Lähettää lyhyen palautekyselyn hoidon jälkeen.", liipaisin: "Käynti merkitty valmiiksi", tila: "luonnos", ajokerrat: 0, viimeinenAjo: null },
  { id: "reaktivointi", nimi: "Reaktivointi", kuvaus: "Ottaa yhteyttä liideihin, joihin ei ole oltu yhteydessä yli 60 päivään.", liipaisin: "60 pv ilman kontaktia", tila: "luonnos", ajokerrat: 12, viimeinenAjo: "2026-08-20T10:00:00Z" },
];

/** Näiden työnkulkujen "Aja"-nappi suorittaa oikean logiikan (lib/workflows/runner.ts). */
export const IMPLEMENTED_WORKFLOWS = new Set([
  "kuuma-seuranta",
  "ajanvaraus-muistutus",
  "reaktivointi",
]);

// --- Yleiskatsauksen tunnusluvut -------------------------------------
export const overview = {
  tanaan: {
    keskustelut: 47,
    aktiivisetLiidit: 23,
    puhelut: 12,
  },
  tekoalynRatkaisuprosentti: 73,
  konversioprosentti: 31,
  kielijakauma: [
    { kieli: "fi", osuus: 78 },
    { kieli: "en", osuus: 15 },
    { kieli: "sv", osuus: 7 },
  ],
  // Viikon keskustelut kanavittain
  viikko: [
    { paiva: "Ma", whatsapp: 18, puhelu: 6, chat: 9 },
    { paiva: "Ti", whatsapp: 22, puhelu: 8, chat: 12 },
    { paiva: "Ke", whatsapp: 19, puhelu: 5, chat: 15 },
    { paiva: "To", whatsapp: 25, puhelu: 9, chat: 11 },
    { paiva: "Pe", whatsapp: 30, puhelu: 12, chat: 14 },
    { paiva: "La", whatsapp: 12, puhelu: 3, chat: 6 },
    { paiva: "Su", whatsapp: 7, puhelu: 1, chat: 3 },
  ],
};

// --- Viimeisimmät tapahtumat (aktiviteettivirta) -----------------------
export type Activity = {
  id: string;
  aika: string; // ISO
  kuka: string;
  mita: string;
};

export const activity: Activity[] = [
  { id: "a1", aika: "2026-09-10T07:40:00Z", kuka: "Tekoäly", mita: "Varasi ajan: Matti Virtanen, implanttiarvio to 12.9. klo 14.00" },
  { id: "a2", aika: "2026-09-10T06:30:00Z", kuka: "Työnkulku: Ajanvarausmuistutus", mita: "Lähetti 6 muistutusviestiä huomisen ajoille" },
  { id: "a3", aika: "2026-09-10T06:00:00Z", kuka: "Tekoäly → Mikko Räsänen", mita: "Siirsi kiireellisen puhelun vastaanottoon (Antti Laaksonen)" },
  { id: "a4", aika: "2026-09-10T05:50:00Z", kuka: "Tekoäly", mita: "Vahvisti oikomishoidon aloituksen: Anna Nieminen, 22.9. klo 9.00" },
  { id: "a5", aika: "2026-09-10T05:02:00Z", kuka: "Web-chat", mita: "Uusi liidi: Pekka Hämäläinen (perustarkastus)" },
  { id: "a6", aika: "2026-09-10T03:15:00Z", kuka: "Työnkulku: Kuuma seuranta", mita: "Lähetti seurantaviestin liidille Emma Järvinen" },
];

// --- Apurit ------------------------------------------------------------
export const CHANNELS: Channel[] = ["whatsapp", "voice", "webchat", "instagram"];

export function leadsByStage(stage: PipelineStage): Lead[] {
  return leads.filter((l) => l.pipelineAsamasi === stage);
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
