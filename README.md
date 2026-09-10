# Vahti AI

**Vahti AI** on tekoälyvastaanottovirkailija-alusta Suomen markkinalle:
monikanavainen (puhelu, WhatsApp, verkkokeskustelu ym.) tekoälyagentti, joka
vastaa terveydenhuollon klinikoiden yhteydenottoihin, karsii liidejä ja varaa
aikoja ympäri vuorokauden. Suomi on ensisijainen kieli, englanti toissijainen.

Tämä repositorio on tuotteen **kehitysrunko**. Toteutus etenee
`docs/vahti-ai-fonksiyonel-sartname.md`-dokumentin tehtävälistan mukaan; tässä on
valmiina **Tehtävä 1 — projektin runko**.

> Lähdedokumentit: [`docs/finlandiya-ai-resepsiyonist-mimari-dokumani.md`](docs/finlandiya-ai-resepsiyonist-mimari-dokumani.md)
> (arkkitehtuuri) ja [`docs/vahti-ai-fonksiyonel-sartname.md`](docs/vahti-ai-fonksiyonel-sartname.md)
> (toiminnallinen määrittely + tehtävälista).

---

## Mitä tässä on (Tehtävä 1)

- **Next.js** (TypeScript, App Router) -projekti, käynnistyy `npm run dev`
- **Monikielisyys** `next-intl`:llä: `fi` (oletus) + `en`, käännökset
  `messages/*.json`-tiedostoissa, kielivalitsin (fi | en) headerissa
- **PostgreSQL + Prisma**: mallit `Klinik`, `Kullanici`, `Lead`, `Konusma`
- **`.env.example`**: `ANTHROPIC_API_KEY`, `DATABASE_URL`

Ei muuta boilerplatea — dashboard-näkymät, chat-API, WhatsApp yms. tulevat
seuraavissa tehtävissä.

---

## Teknologiat

| Osa | Valinta |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Kielet (i18n) | next-intl 4 — reititys `/` (fi) ja `/en` |
| Tietokanta | PostgreSQL |
| ORM | Prisma 7 |
| LLM (myöhemmin) | Claude API (`ANTHROPIC_API_KEY`) |

---

## Kansiorakenne

```
vahti-ai/
├─ app/
│  ├─ layout.tsx              # juurilayout (välittää lapset [locale]-layoutille)
│  ├─ globals.css             # globaalit tyylit (Nordic-minimalismi)
│  └─ [locale]/
│     ├─ layout.tsx           # <html>/<body>, NextIntlClientProvider, <Header/>, metadata
│     └─ page.tsx             # laskeutumissivun runko
├─ components/
│  ├─ Header.tsx              # brändi + tagline + kielivalitsin
│  └─ LocaleSwitcher.tsx      # fi | en -valitsin (client-komponentti)
├─ i18n/
│  ├─ routing.ts              # locale-määrittely (fi oletus, en)
│  ├─ navigation.ts           # kielitietoiset Link/router-apurit
│  └─ request.ts              # lataa messages/<locale>.json per pyyntö
├─ messages/
│  ├─ fi.json                 # suomenkieliset UI-tekstit (runko)
│  └─ en.json                 # englanninkieliset UI-tekstit (runko)
├─ lib/
│  └─ prisma.ts               # Prisma-clientin singleton
├─ prisma/
│  └─ schema.prisma           # Klinik · Kullanici · Lead · Konusma
├─ middleware.ts              # next-intl-reititysmiddleware
├─ next.config.ts             # next-intl-plugin kytketty
└─ .env.example
```

### Tietomalli (`prisma/schema.prisma`)

Kenttien nimet ovat toimeksiannon mukaisia (turkinkieliset tunnisteet).

| Malli | Kentät |
|---|---|
| **Klinik** (tenant) | `id`, `ad`, `email`, `telefon`, `sehir`, `ulke`, `sektor`, `aiDili`, `saatDilimi`, `createdAt`, `updatedAt` |
| **Kullanici** (käyttäjä) | `id`, `klinikId → Klinik`, `ad`, `email`, `rol` |
| **Lead** (liidi) | `id`, `klinikId → Klinik`, `isim`, `dil`, `kaynakKanal`, `leadSkoru`, `pipelineAsamasi`, `createdAt`, `updatedAt` |
| **Konusma** (keskustelu) | `id`, `leadId → Lead`, `kanal`, `mesajlar` (JSON), `createdAt` |

Relaatiot on kytketty `onDelete: Cascade`-säännöllä (klinikan poisto poistaa sen
käyttäjät ja liidit; liidin poisto poistaa sen keskustelut).

---

## Käyttöönotto

### 1. Vaatimukset

- Node.js ≥ 20
- PostgreSQL (paikallinen tai Docker)

Nopea PostgreSQL Dockerilla:

```bash
docker run --name vahti-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vahti_ai -p 5432:5432 -d postgres:16
```

### 2. Riippuvuudet ja ympäristö

```bash
npm install
cp .env.example .env      # täytä ANTHROPIC_API_KEY ja DATABASE_URL
```

`npm install` ajaa `prisma generate` automaattisesti (`postinstall`).

### 3. Tietokannan skeema

```bash
npm run db:push           # vie Prisma-skeeman tietokantaan (kehitys)
# tai versioidut migraatiot:
npm run prisma:migrate
```

### 4. Kehityspalvelin

```bash
npm run dev
```

Avaa <http://localhost:3000> — uudelleenohjaa suomenkieliseen näkymään.
Englanniksi: <http://localhost:3000/en>. Kieltä voi vaihtaa headerin
**fi | en** -valitsimesta.

---

## Skriptit

| Skripti | Kuvaus |
|---|---|
| `npm run dev` | Kehityspalvelin |
| `npm run build` | Tuotantokäännös |
| `npm start` | Ajaa tuotantokäännöksen |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Generoi Prisma-client |
| `npm run db:push` | Synkronoi skeema tietokantaan ilman migraatiotiedostoja |
| `npm run prisma:migrate` | Luo/aja versioitu migraatio (`prisma migrate dev`) |

---

## Seuraavat tehtävät (ks. `docs/vahti-ai-fonksiyonel-sartname.md`)

2. Claude-agentin perusintegraatio — `/api/chat`
3. Dashboard: Yleiskatsaus
4. Saapuneet + liidiputki (kanban)
5. WhatsApp Business Cloud API
6. Kalenteri-integraatio (Google Calendar)
7. Tietopankki (RAG, pgvector)
8. Työnkulut (automaatiomoottori)
9. Puhekanava (Twilio + Fince STT/TTS)
