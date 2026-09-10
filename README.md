# Vahti AI

**Vahti AI** on tekoälyvastaanottovirkailija-alusta Suomen markkinalle:
monikanavainen (puhelu, WhatsApp, verkkokeskustelu, Instagram) tekoälyagentti,
joka vastaa terveydenhuollon klinikoiden yhteydenottoihin, karsii liidejä ja
varaa aikoja ympäri vuorokauden. Suomi on ensisijainen kieli, englanti
toissijainen.

Repositorio seuraa `docs/vahti-ai-fonksiyonel-sartname.md`-dokumentin **Bölüm 6**
-tehtävälistaa (Görev 1–9). **Görev 1–4 on toteutettu** (toimivat mock-datalla,
ei API-avaimia). **Görev 5–9 on hahmoteltu** rungoiksi, joissa on selkeät
`TODO`-merkinnät oikeita integraatioita varten.

> Lähdedokumentit: `docs/finlandiya-ai-resepsiyonist-mimari-dokumani.md`
> (arkkitehtuuri) ja `docs/vahti-ai-fonksiyonel-sartname.md` (toiminnallinen
> määrittely + tehtävälista).

---

## Pikakäynnistys

```bash
npm install
cp .env.example .env      # valinnainen — dashboard toimii ilman avaimiakin
npm run dev
```

Avaa **http://localhost:3000** → uudelleenohjaa suomenkieliseen etusivuun.
Hallintapaneeli: **http://localhost:3000/fi/dashboard**

PostgreSQL tarvitaan vasta, kun Prisma-kerros kytketään näkymiin (nyt data on
mock). Halutessasi:

```bash
docker run --name vahti-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vahti_ai -p 5432:5432 -d postgres:16
npm run db:push
```

---

## Sivut (npm run dev jälkeen)

| Osoite | Kuvaus | Görev |
|---|---|---|
| `/fi` , `/en` | Etusivu, kielivalitsin | 1 |
| `/fi/dashboard/overview` | Yleiskatsaus: KPI-kortit, viikkokaavio (recharts), tapahtumavirta | 3 |
| `/fi/dashboard/inbox` | Saapuneet: kanavasuodatin + keskustelun detaljit, AI-vastaukset korostettu | 4 |
| `/fi/dashboard/pipeline` | Liidiputki: raahaa-ja-pudota kanban (dnd-kit), 5 vaihetta | 4 |
| `/fi/dashboard/calls` | Puhelut: loki + AI-yhteenveto + kerätyt tiedot + ehdotus | (UI valmis; putki = Görev 9) |
| `/fi/dashboard/ai-assistant` | Tietopankki + agentin testinäyttö (chat) | 2 + 7 (UI) |
| `/fi/dashboard/workflows` | Automaatiot: lista + kuivaharjoitus | 8 (UI + runko) |
| `/fi/dashboard/settings` | Klinikan tiedot + tiimi (mock, lukutila) | 1 |

### API-reitit

| Reitti | Kuvaus |
|---|---|
| `POST /api/chat` | Görev 2 — Claude-agentti (Sonnet 5) + mock-työkalu `randevu_olustur`. Ilman `ANTHROPIC_API_KEY`:tä mock-tila. Body: `{ "message": "..." }` tai `{ "messages": [...] }` |
| `GET/POST /api/whatsapp` | Görev 5 — webhook-runko (verify + agenttiajo; ei lähetystä ilman tokenia) |
| `POST /api/workflows/:id/run` | Görev 8 — työnkulun kuivaharjoitus (laskee kohteet, ei lähetä) |

---

## Kansiorakenne

```
app/
  [locale]/
    layout.tsx                 # <html>/<body> + NextIntlClientProvider
    (marketing)/               # etusivun kehys (Header + keskitetty container)
      layout.tsx
      page.tsx                 # laskeutumissivu
    dashboard/
      dashboard.css            # paneelin tyylit (Nordic-minimalismi)
      layout.tsx               # sivupalkki + yläpalkki + sisältöalue
      page.tsx                 # → /dashboard/overview
      overview|inbox|calls|pipeline|ai-assistant|workflows|settings/page.tsx
  api/
    chat/route.ts              # Görev 2
    whatsapp/route.ts          # Görev 5 (runko)
    workflows/[id]/run/route.ts# Görev 8

components/
  Header.tsx, LocaleSwitcher.tsx
  dashboard/
    Sidebar.tsx, Topbar.tsx, icons.tsx
    WeeklyChart.tsx            # recharts
    InboxView.tsx, CallsView.tsx
    PipelineBoard.tsx          # dnd-kit kanban
    TestChat.tsx               # kutsuu /api/chat
    WorkflowsView.tsx

i18n/                          # next-intl: routing / navigation / request
messages/{fi,en}.json          # KAIKKI UI-tekstit (fi = oletus)

lib/
  mock/data.ts                # keskitetty mock-data (klinikka, liidit, keskustelut,
                              #  puhelut, tietopankki, työnkulut, KPI:t)
  agent/
    claude.ts                 # Anthropic-kutsu + tool-loop + mock-fallback
    knowledge.ts              # system prompt tietopankista
    tools.ts                  # randevu_olustur (mock, logittaa)
  integrations/google-calendar.ts   # Görev 6 (mock + TODO)
  rag/index.ts                # Görev 7 (avainsanahaku + TODO pgvector)
  workflows/engine.ts         # Görev 8 (kuivaharjoituslogiikka + TODO ajastin)
  voice/pipeline.ts           # Görev 9 (kuoret + TODO Twilio/Deepgram/TTS)
  format.ts                   # pienet muotoiluapurit

prisma/schema.prisma          # Klinik · Kullanici · Lead · Konusma
```

---

## Mitä puuttuu ja mitä avaimia tarvitaan

Kaikki avaimet ovat `.env.example`-tiedostossa valmiina (tyhjinä). Dashboard
toimii ilman niitä.

| Görev | Mitä puuttuu | Avain / mistä |
|---|---|---|
| **2** | Oikeat Claude-vastaukset (nyt mock-sääntöjä) | `ANTHROPIC_API_KEY` — https://console.anthropic.com → Settings → API Keys |
| **5** | WhatsApp-viestien vastaanotto ja lähetys | `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` — https://developers.facebook.com (luo sovellus → WhatsApp-tuote → Webhooks) |
| **6** | Ajanvaraus oikeaan kalenteriin (nyt mock-tapahtuma) | `GOOGLE_CALENDAR_CLIENT_ID/_SECRET/_REFRESH_TOKEN` — https://console.cloud.google.com (Calendar API + OAuth 2.0) |
| **7** | Vektorihaku (nyt koko tietopankki system-promptissa) | `VOYAGE_API_KEY` — https://www.voyageai.com/ + pgvector Postgresissa |
| **8** | Ajastin + jono (nyt vain kuivaharjoitus selaimesta) | ei ulkoista avainta — `node-cron` TAI `REDIS_URL` + BullMQ |
| **9** | Puhelu → STT → agentti → TTS -putki | `TWILIO_ACCOUNT_SID/_AUTH_TOKEN/_PHONE_NUMBER`, `DEEPGRAM_API_KEY` (varmista Fince-STT laatu!), `ELEVENLABS_API_KEY` |

TODO-merkinnät koodissa: hae `grep -rn "TODO" lib app`.

---

## Skriptit

| Skripti | Kuvaus |
|---|---|
| `npm run dev` | Kehityspalvelin (http://localhost:3000) |
| `npm run build` / `npm start` | Tuotantokäännös / -ajo |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Generoi Prisma-client |
| `npm run db:push` | Vie skeema tietokantaan (kehitys) |

## Teknologiat

Next.js 16 (App Router) · React 19 · next-intl 4 · Prisma 6 · recharts 3 ·
dnd-kit · @anthropic-ai/sdk · PostgreSQL
