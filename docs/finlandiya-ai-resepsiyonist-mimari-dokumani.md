# Finlandiya Pazarı için AI Resepsiyonist Platformu
## Mimari Analiz ve Claude ile Geliştirme Dökümantasyonu

> Not: Bu döküman STOAIX'in (stoaix.com) kamuya açık web sitesinden gözlemlenebilen ürün konumlandırması, özellik seti ve genel SaaS mimarisine dayanarak hazırlanmıştır. Kaynak kodu, marka varlıkları veya tescilli iş akışları kopyalanmamıştır — yalnızca "sağlık kliniklerine yönelik çok kanallı AI resepsiyonist" ürün kategorisinin genel mimarisi analiz edilmiştir. Finlandiya'ya özgü versiyon kendi markanız, kendi hukuki altyapınız ve kendi kod tabanınızla, orijinal bir ürün olarak inşa edilmelidir.

---

## 1. STOAIX'in Gözlemlenen Ürün Mimarisi

### 1.1 Değer Önerisi
Sağlık kliniklerine (diş, saç ekimi, estetik, fizyoterapi, veteriner) yönelik, gelen her aramayı/mesajı yakalayıp randevuya çeviren, 7/24 çalışan AI resepsiyonist.

### 1.2 Ürün Katmanları

| Katman | İşlev |
|---|---|
| **Voice AI** | Telefon hatlarına (sabit, mobil, özel numaralar) bağlanır, 15+ dilde otomatik dil algılama ile konuşur, near-real-time yanıt verir |
| **WhatsApp & Chat** | WhatsApp Business, web chat, Instagram DM üzerinden fiyat sorguları, randevu, SSS otomasyonu |
| **Outbound Agent** | Yeni lead'i 60 saniye içinde otomatik arayan proaktif modül |
| **CRM & Pipeline** | Lead skorlama, pipeline takibi, otomatik sıraya alma |
| **Knowledge Base / RAG** | Kliniğe özel bilgi tabanından soru cevaplama (AI Destek Asistanı) |
| **Reaktivasyon Motoru** | Eski/soğuk lead'leri otomatik yeniden devreye sokma |
| **Add-on Modüller** | AI Gülüş Tasarımı (foto→simülasyon), Sosyal Medya AI (içerik üretimi + otomatik yayınlama) |
| **Entegrasyonlar** | Takvim (Google Calendar, Calendly, Acuity), CRM (HubSpot, Salesforce, Pipedrive, Zoho), otomasyon (Zapier, Make), klinik yazılımları (Dentally, Pabau, Fresha, Dentsoft), reklam platformları (Google Ads, TikTok, LinkedIn), webhook API |
| **Dashboard/Platform** | Ayrı subdomain (platform.stoaix.com) üzerinden self-servis giriş, no-code kurulum |

### 1.3 Ticari Model
- Katmanlı SaaS abonelik (Starter/Essential, Professional, vb.)
- Bağımsız satın alınabilen add-on modüller (aylık, taahhütsüz)
- Partner/bayi programı (%50'ye varan komisyon)
- Ücretsiz deneme + kredi kartsız kayıt + "5 dakikada canlıya geç" konumlandırması
- Satış: self-servis kayıt + Calendly üzerinden demo görüşmesi

### 1.4 Muhtemel Teknik Bileşenler (Tipik SaaS Mimarisi)
Bu tür bir ürün genelde şu bileşenlerden oluşur — STOAIX'in iç mimarisi görünmüyor, ama sektör standardı budur:

1. **Telefon/Ses Katmanı**: SIP trunk sağlayıcı (Twilio, Vonage, Plivo) + Speech-to-Text (Whisper, Deepgram) + LLM (konuşma motoru) + Text-to-Speech (ElevenLabs, ElevenLabs benzeri) — düşük gecikmeli streaming pipeline.
2. **Mesajlaşma Katmanı**: WhatsApp Business Cloud API, Instagram Graph API, web chat widget (WebSocket).
3. **Orkestrasyon/Agent Katmanı**: LLM tabanlı ajan (araç kullanımı — takvime randevu yazma, CRM'e lead yazma, bilgi tabanından RAG sorgusu).
4. **CRM/Backend**: Multi-tenant veritabanı (klinik başına izole veri), lead/pipeline modeli, olay/webhook sistemi.
5. **Dashboard (Frontend)**: No-code konfigürasyon paneli, analytics.
6. **Entegrasyon Katmanı**: Üçüncü parti API bağlayıcıları + genel webhook/Zapier/Make desteği.
7. **Otomasyon/İş Kuralları Motoru**: Tetikleyici-eylem (trigger-action) sistemi (reaktivasyon, outbound arama vb.).

---

## 2. Finlandiya Pazarına Uyarlama — Kritik Farklar

| Konu | Finlandiya için gereklilik |
|---|---|
| **Dil** | Fince ve İsveççe (Finlandiya'nın iki resmi dili) birincil öncelik; İngilizce üçüncül. Fince, LLM ses motorlarında Türkçe/İngilizce kadar olgun değildir — TTS/STT sağlayıcı seçimi kritik (bkz. Bölüm 4). |
| **Veri Koruma** | GDPR zaten AB standardı ama Finlandiya'da sağlık verisi ekstra hassas: **Sosiaali- ja terveysministeriö (STM)** ve **Valvira** düzenlemeleri, hasta verisi için **Kanta** (Fin ulusal e-sağlık arşivi) ile entegrasyon beklentisi olabilir. Veri Finlandiya/AB sınırları içinde barındırılmalı (EU-hosted altyapı, örn. AWS eu-north-1 Stockholm veya Azure Finland Central). |
| **Kimlik Doğrulama** | Randevu/ödeme akışlarında **Suomi.fi tunnistautuminen** (Fin e-kimlik) veya bankacılık kimlik doğrulama (BankID benzeri) beklenebilir. |
| **Ödeme** | Kredi kartı + **Paytrail** (Fin yerel ödeme ağ geçidi, banka havalesi/MobilePay/Pivo dahil) desteği şart. |
| **Telefon Altyapısı** | Twilio Finlandiya numaralarını destekler ama yerel SIP sağlayıcıları (Elisa, Telia, DNA) ile de entegrasyon değerlendirilmeli — kurumsal müşteriler yerel operatör istiyor olabilir. |
| **Klinik Yazılımları** | STOAIX'in entegre olduğu Dentally/Pabau/Fresha yerine Finlandiya'da yaygın olanlar: **Nordhealth (Provet Cloud, WebOodi benzeri değil — Provet veteriner için)**, **Diarium**, **Musti/DentalEye**, **Lifecare**, **Vitec**. Bunlar doğrulanmalı ve pazar araştırması yapılmalı. |
| **Pazarlama Kanalları** | WhatsApp Finlandiya'da Türkiye kadar baskın değil — Fin kullanıcılar SMS, e-posta ve **Facebook Messenger**'ı daha çok kullanır; buna göre kanal önceliklendirmesi gözden geçirilmeli. |
| **Şirket/Hukuk** | Finlandiya'da şirket kurmak (Oy), KVKK yerine GDPR + Fin Kişisel Verileri Koruma Kanunu (Tietosuojalaki), sağlık teknolojisi için gerekiyorsa Valvira kaydı. |
| **Rekabet** | Finlandiya/Nordic pazarında var olan benzer oyuncular (örn. yerel AI resepsiyonist girişimleri) araştırılmalı — konumlandırma farklılaştırması gerekir. |

---

## 3. Önerilen Yüksek Seviye Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────┐
│                        GİRİŞ KANALLARI                            │
│  Telefon (SIP)  │  WhatsApp  │  Web Chat  │  Messenger  │  SMS    │
└──────┬──────────────┬────────────┬────────────┬───────────┬─────┘
       │              │            │            │           │
┌──────▼──────────────▼────────────▼────────────▼───────────▼─────┐
│                    KANAL AĞ GEÇİDİ (Gateway)                      │
│   Twilio/Elisa SIP · WhatsApp Cloud API · WebSocket · Messenger   │
└──────────────────────────────┬────────────────────────────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │   KONUŞMA ORKESTRASYONU       │
                 │  STT (Fince/İsveççe) → Claude  │
                 │  (agent + tool use) → TTS       │
                 └──────────────┬───────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                        │
┌───────▼───────┐     ┌─────────▼─────────┐   ┌──────────▼─────────┐
│  Bilgi Tabanı   │     │   Araçlar (Tools)   │   │   CRM / Pipeline     │
│  (RAG - klinik  │     │  - Takvime yaz       │   │  - Lead kaydı        │
│  bilgileri)     │     │  - CRM'e yaz         │   │  - Skorlama          │
└─────────────────┘     │  - Fiyat sorgula     │   │  - Otomasyon kuralı  │
                         └────────────────────┘   └──────────────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │      MULTI-TENANT BACKEND      │
                 │  (klinik başına izole veri,    │
                 │   PostgreSQL + olay/webhook)   │
                 └──────────────┬───────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │      DASHBOARD (Frontend)      │
                 │  Klinik yönetim paneli,        │
                 │  no-code konfigürasyon,        │
                 │  analytics                     │
                 └───────────────────────────────┘
```

---

## 4. Claude ile Geliştirme — Teknik Yaklaşım

### 4.1 Claude'un sistemdeki rolü
Claude, bu mimaride **konuşma orkestrasyon motoru** olarak konumlanır: gelen metni (STT çıktısı veya chat mesajı) alır, klinik bilgi tabanına RAG ile erişir, gerektiğinde "tool use" (araç çağırma) ile takvime randevu yazar, CRM'e lead kaydeder, fiyat bilgisi döner.

- **Model önerisi**: Gerçek zamanlı sesli görüşmeler için düşük gecikme önemlidir — Claude Haiku 4.5 hız/maliyet dengesi için, karmaşık karar gerektiren (fiyatlandırma, tıbbi ön bilgilendirme, çok adımlı randevu mantığı) senaryolarda Claude Sonnet 5 tercih edilebilir.
- **Tool use / function calling**: Randevu oluşturma, CRM güncelleme, bilgi tabanı sorgulama gibi eylemler Claude'un araç çağırma (tool use) yeteneğiyle yapılandırılır — her klinik için ayrı "system prompt + tool tanımları" seti.
- **RAG (Retrieval-Augmented Generation)**: Klinik bazlı bilgi tabanı (hizmetler, fiyatlar, SSS) bir vektör veritabanında (örn. pgvector, Pinecone) tutulur; Claude'a ilgili parçalar context olarak verilir.
- **Çok dilli destek**: Claude'un çok dilli yetenekleri Fince/İsveççe için kullanılabilir; ancak ses tarafında STT/TTS sağlayıcısının Fince desteği ayrı test edilmelidir (Deepgram, Azure Speech, ElevenLabs Fince desteği kontrol edilmeli).

### 4.2 Geliştirme sürecinde Claude'un kullanım şekilleri
1. **Claude Code** ile backend (API, entegrasyonlar, multi-tenant veri modeli) ve frontend (dashboard) kod tabanının yazılması.
2. **Claude (API)** üretim ortamında konuşma motoru olarak çalıştırılması (yukarıdaki mimari).
3. **Claude Cowork / Claude Desktop** ile pazar araştırması, rakip analizi, GDPR/Valvira mevzuat taraması gibi bilgi işi görevlerinde.

### 4.3 Örnek geliştirme sırası (Claude Code ile)
1. Multi-tenant veri modeli ve auth (klinik hesapları)
2. WhatsApp Cloud API entegrasyonu + basit chat agent (Claude + tool use)
3. Web chat widget + dashboard iskeleti
4. Takvim entegrasyonu (Google Calendar API)
5. Ses katmanı (Twilio + STT/TTS + Claude orkestrasyon) — en karmaşık ve en son yapılacak parça
6. CRM/pipeline + otomasyon motoru
7. Add-on modüller (isteğe bağlı — sosyal medya otomasyonu, foto simülasyonu vb.)

---

## 5. Fazlı Yol Haritası

| Faz | Süre (tahmini) | Kapsam |
|---|---|---|
| **Faz 0 — Araştırma & Kurulum** | 2-3 hafta | Fin pazar araştırması, GDPR/Valvira mevzuat incelemesi, marka/şirket kurulumu, hedef klinik türü seçimi (örn. diş klinikleri ile başla) |
| **Faz 1 — MVP (Chat + WhatsApp)** | 4-6 hafta | Tek kanal (WhatsApp veya web chat) + basit RAG tabanlı Claude agent + manuel randevu bildirimi |
| **Faz 2 — CRM & Takvim Entegrasyonu** | 3-4 hafta | Lead pipeline, otomatik takvime randevu yazma, dashboard v1 |
| **Faz 3 — Ses Katmanı (Voice AI)** | 6-8 hafta | Telefon entegrasyonu, STT/TTS pipeline, gerçek zamanlı Claude orkestrasyonu, Fince/İsveççe testleri |
| **Faz 4 — Pazara Çıkış** | 2-3 hafta | Ödeme entegrasyonu (Paytrail), self-servis kayıt, ilk pilot klinikler |
| **Faz 5 — Genişleme** | Sürekli | Ek modüller, ek entegrasyonlar (Nordic klinik yazılımları), diğer Nordic ülkelere (İsveç, Norveç) genişleme |

---

## 6. Önerilen Teknoloji Yığını (Taslak)

- **Backend**: Node.js/TypeScript veya Python (FastAPI) — multi-tenant PostgreSQL
- **Frontend/Dashboard**: React + Tailwind
- **Konuşma Motoru**: Claude API (Sonnet 5 / Haiku 4.5) + tool use
- **STT/TTS**: Deepgram veya Azure Speech (Fince/İsveççe desteği doğrulanmalı) + ElevenLabs (TTS)
- **Telefon**: Twilio (SIP trunk, Finlandiya numaraları)
- **Mesajlaşma**: WhatsApp Business Cloud API (Meta), Messenger API
- **Vektör DB (RAG)**: pgvector veya Pinecone
- **Ödeme**: Paytrail (+ Stripe uluslararası kartlar için)
- **Barındırma**: AWS eu-north-1 (Stockholm) veya Azure Finland Central — veri Finlandiya/AB sınırları içinde
- **Otomasyon**: Kendi kural motorunuz + Zapier/Make webhook desteği

---

## 7. Sonraki Adımlar
1. Hedef klinik segmentini netleştirin (diş mi, estetik mi, fizyoterapi mi — Finlandiya'da hangi segment daha az doymuş?).
2. GDPR + Valvira gerekliliklerini bir hukuk danışmanıyla teyit edin (özellikle hasta verisi işleme).
3. Fince STT/TTS kalitesini önceden test edin — bu, ses AI'sinin en riskli teknik bileşenidir.
4. MVP'yi tek kanaldan (WhatsApp veya web chat) başlatıp, ses katmanını en sona bırakın.
5. Claude Code ile geliştirmeye başlarken bu dökümandaki mimariyi teknik şartname (spec) olarak kullanın.
