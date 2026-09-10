# Vahti AI

**Vahti AI** on tekoälyvastaanottovirkailija-alusta Suomen markkinalle:
monikanavainen (puhelu, WhatsApp, verkkokeskustelu, Instagram) tekoälyagentti,
joka vastaa terveydenhuollon klinikoiden yhteydenottoihin, karsii liidejä ja
varaa aikoja ympäri vuorokauden. Suomi on ensisijainen kieli, englanti
toissijainen.

Repositorio seuraa `docs/vahti-ai-fonksiyonel-sartname.md`-dokumentin **Bölüm 6**
-tehtävälistaa (Görev 1–9). **Kaikki 9 tehtävää on kirjoitettu oikeilla API-
kutsuilla** (Anthropic, WhatsApp Cloud API, Google Calendar, OpenAI/Voyage
embeddingit, node-cron, Twilio, Deepgram, ElevenLabs). Jokainen integraatio
menee automaattisesti **demo/mock-tilaan**, jos sen avain puuttuu — järjestelmä
ei kaadu, ja `.env`:n täyttäminen kytkee oikean tilan päälle. Tilan näkee
osoitteesta `GET /api/integrations` ja Asetukset-sivulta.

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

PostgreSQL (pgvector) kytkee päälle tallennuksen (keskustelut, liidit,
ajanvaraukset, tietopankki + vektorihaku). Ilman sitä dashboard näyttää
mock-datan.

```bash
docker run --name vahti-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vahti_ai -p 5432:5432 -d pgvector/pgvector:pg16
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
| `/fi/dashboard/calls` | Puhelut: loki + AI-yhteenveto + kerätyt tiedot + puheputken tila | 9 |
| `/fi/dashboard/ai-assistant` | Tietopankki (haku, lisäys, uudelleenindeksointi) + agentin testinäyttö | 2 + 7 |
| `/fi/dashboard/workflows` | Automaatiot: lista + "Kuivaharjoitus" / "Aja nyt" (oikea suoritus) | 8 |
| `/fi/dashboard/settings` | Klinikan tiedot + tiimi + integraatioiden tila | 1 |

### API-reitit

| Reitti | Görev | Kuvaus |
|---|---|---|
| `POST /api/chat` | 2 | Claude-agentti (Sonnet 5) + työkalu `create_appointment`. Ilman avainta mock-tila. |
| `GET/POST /api/webhooks/whatsapp` | 5 | WhatsApp Cloud API -webhook: verify + saapuva viesti → agentti → vastaus → DB. |
| `POST /api/workflows/:id/run?dryRun=` | 8 | Suorittaa työnkulun (oikeasti tai kuivaharjoituksena). |
| `GET /api/knowledge?q=` · `POST /api/knowledge` | 7 | Tietopankin haku (vektori/avainsana) ja lisäys. |
| `POST /api/knowledge/reindex` | 7 | Siementää + laskee embeddingit. |
| `POST /api/webhooks/twilio/voice` · `/recording` · `/gather` | 9 | Puhelun TwiML-virta (STT → agentti → TTS). |
| `GET /api/voice/audio/:id` | 9 | Tarjoilee ElevenLabsin mp3:n Twilion `<Play>`:lle. |
| `GET /api/integrations` | — | Kaikkien integraatioiden tila (live/demo). |

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
    chat/route.ts                       # Görev 2
    integrations/route.ts               # integraatioiden tila
    knowledge/route.ts + reindex/       # Görev 7
    webhooks/whatsapp/route.ts          # Görev 5
    webhooks/twilio/{voice,recording,gather}/route.ts   # Görev 9
    voice/audio/[id]/route.ts           # Görev 9 (mp3-tarjoilu)
    workflows/[id]/run/route.ts         # Görev 8

instrumentation.ts             # Görev 8: käynnistää node-cron-ajastimen

lib/
  env.ts                       # keskitetty avainten luku + integrationStatus()
  db.ts                        # Prisma + saatavuustunnistus (withDb-fallback)
  mock/data.ts                 # mock-data kun DB puuttuu
  agent/{claude,knowledge,tools}.ts     # Görev 2: agentti + RAG-system-prompt + create_appointment
  integrations/
    google-calendar.ts         # Görev 6: OAuth refresh → events.insert
    whatsapp.ts                # Görev 5: Graph API -lähetys + allekirjoitus
  conversations.ts             # keskustelujen tallennus (whatsapp/voice → Konusma)
  rag/
    embeddings.ts              # Görev 7: OpenAI / Voyage embeddingit
    index.ts                   # 3-tasoinen haku: vektori → DB-avainsana → mock
    store.ts                   # tietopankin CRUD + siemennys + reindex
  workflows/
    definitions.ts             # työnkulut + cron-aikataulut + viestipohjat
    runner.ts                  # Görev 8: oikea suoritus (DB-kysely → WhatsApp-lähetys)
    scheduler.ts               # node-cron-rekisteröinti
  voice/
    stt.ts                     # Görev 9: Deepgram (raaka HTTP)
    tts.ts                     # Görev 9: ElevenLabs
    twilio.ts                  # allekirjoitus + nauhoituksen lataus
    twiml.ts                   # <Say>/<Play> + <Record>/<Gather> -rakennus
    pipeline.ts                # nauhoitus → STT → agentti → TTS -orkestrointi
    store.ts                   # muistivarasto (mp3 + puhelun historia)

prisma/schema.prisma           # Klinik · Kullanici · Lead · Konusma
                               # + KnowledgeEntry (vector) · Appointment · WorkflowRun
```

---

## API-avaimet — mistä ja miten

Kaikki `.env.example`:ssa (tyhjinä). Ilman avainta kyseinen integraatio on
demo-tilassa; täyttäminen kytkee oikean API:n.

| Avain(ket) | Görev | Hankinta |
|---|---|---|
| `ANTHROPIC_API_KEY` | 2 | console.anthropic.com → **Settings → API Keys** → *Create Key*. Malli oletuksena `claude-sonnet-5`. |
| `WHATSAPP_VERIFY_TOKEN` `WHATSAPP_TOKEN` `WHATSAPP_PHONE_ID` | 5 | developers.facebook.com → **Create App** (tyyppi *Business*) → lisää tuote **WhatsApp** → *API Setup*: kopioi *Phone number ID* ja *temporary access token* (tuotantoon: luo *System User* + pysyvä token). VERIFY_TOKEN = itse keksitty merkkijono. Aseta webhook-URL `https://<domain>/api/webhooks/whatsapp` ja tilaa `messages`. |
| `GOOGLE_CALENDAR_CLIENT_ID` `_SECRET` `_REFRESH_TOKEN` | 6 | console.cloud.google.com → **APIs & Services** → ota **Google Calendar API** käyttöön → **Credentials** → *Create OAuth client ID* (tyyppi *Web*). Hae refresh token esim. developers.google.com/oauthplayground (scope `https://www.googleapis.com/auth/calendar.events`, "Use your own credentials"). |
| `OPENAI_API_KEY` *(tai `VOYAGE_API_KEY` + `EMBEDDING_PROVIDER=voyage`)* | 7 | platform.openai.com/api-keys → *Create secret key* (malli `text-embedding-3-small`). Vaihtoehto: voyageai.com (Anthropicin suositus, malli `voyage-3` — huom. 1024 ulottuvuutta, päivitä silloin skeeman `vector(1536)`). Tarvitsee myös Postgresin pgvectorilla. |
| *(ei avainta)* | 8 | Ajastin on `node-cron` prosessin sisällä (`instrumentation.ts`). `ENABLE_CRON=false` sammuttaa. Skaalaukseen voi vaihtaa BullMQ + `REDIS_URL`. Viestit lähtevät WhatsApp-avaimella. |
| `TWILIO_ACCOUNT_SID` `TWILIO_AUTH_TOKEN` `TWILIO_PHONE_NUMBER` | 9 | console.twilio.com → *Account Info* (SID + token) → **Phone Numbers → Buy a number** (Voice). Aseta numeron *A call comes in* → Webhook → `https://<domain>/api/webhooks/twilio/voice` (POST). Tarvitsee julkisen URLin (ngrok / deploy). |
| `DEEPGRAM_API_KEY` | 9 | console.deepgram.com → **API Keys**. Malli `nova-2` + `detect_language`. **Puuttuessa** käytetään Twilion omaa `<Gather input="speech">` -tunnistusta. |
| `ELEVENLABS_API_KEY` (+ `ELEVENLABS_VOICE_ID`) | 9 | elevenlabs.io → *Profile → API Keys*. Malli `eleven_multilingual_v2`. **Puuttuessa** käytetään Twilion `<Say>`-ääntä. |

Kun `.env` on täytetty, tarkista: `curl localhost:3000/api/integrations`.

---

## Käyttäytyminen ilman avaimia (demo-tila)

| Integraatio | Ilman avainta |
|---|---|
| Claude (2) | Sääntöpohjainen fi/en-vastaus, `mode: "mock"`, testinäyttö näyttää huomautuksen. |
| Tietokanta | Dashboard lukee `lib/mock/data.ts`:stä. Tallennukset ovat no-op. |
| WhatsApp (5) | Webhook toimii, agentti ajetaan, vastaus **kirjataan konsoliin** (ei lähetetä). `delivery: "mock"`. |
| Google Calendar (6) | `create_appointment` palauttaa demo-tapahtuman `kalenteri: "mock"`. |
| Embeddingit (7) | Haku avainsanoilla (DB ILIKE tai mock). `reindex` kertoo mitä puuttuu. |
| Automaatiot (8) | `runner` simuloi mock-datalla, `sent: 0`, `backend: "mock"`. Cron on silti ajastettu. |
| Twilio/Deepgram/ElevenLabs (9) | Webhookit palauttavat validia TwiML:ää. Ilman Deepgramia → Twilio-STT; ilman ElevenLabsia → Twilio-`<Say>`. Puhelua ei voi vastaanottaa ilman Twilio-numeroa + julkista URLia. |

## Skriptit

| Skripti | Kuvaus |
|---|---|
| `npm run dev` | Kehityspalvelin (http://localhost:3000) — käynnistää myös cron-ajastimen |
| `npm run build` / `npm start` | Tuotantokäännös / -ajo |
| `npm run lint` | ESLint |
| `npm run db:push` | Vie Prisma-skeema (pgvector) tietokantaan |

## Teknologiat

Next.js 16 (App Router) · React 19 · next-intl 4 · Prisma 6 (+ pgvector) ·
recharts 3 · dnd-kit · @anthropic-ai/sdk · twilio · node-cron · PostgreSQL
