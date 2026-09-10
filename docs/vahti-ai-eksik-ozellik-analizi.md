# Vahti AI — Eksik Özellik Analizi (Ek Döküman #3)
## STOAIX'in tüm sayfalarının detaylı incelemesi sonrası fark listesi

> Bu döküman, STOAIX'in ana sayfası, Modules sayfası, Healthcare Clinics sayfası ve senin paylaştığın 12 dashboard ekran görüntüsünün tam incelemesine dayanır. Amaç: "bizimki aynı olmadı" dediğin noktaları netleştirip, hangi fonksiyonel katmanların eksik olduğunu göstermek.

---

## 1. Neden "aynı değil" hissi oluşuyor — Kök Neden

Şu ana kadar yaptırdığımız şey **sadece dashboard'un içi** (Genel Bakış, Gelen Kutusu, Pipeline, vb.) ve **basit bir landing page**. Ama STOAIX aslında **7-8 ayrı sayfadan oluşan bir bütün pazarlama + satış + ürün sistemi**. Bizde şu ana kadar eksik olan büyük parçalar:

| STOAIX'te var | Bizde durum |
|---|---|
| Ayrı "Healthcare Clinics" iniş sayfası (sektöre özel mesajlaşma, acı noktaları, testimonial'lar) | ❌ Yok |
| Ayrı "Modules" sayfası (add-on ürün mağazası: Smile Design $99/ay, Social Media AI $129/ay, Bundle $199/ay) | ❌ Yok |
| Gerçek kayıt akışı (signup.html — plan seçimi, ödeme, hesap oluşturma) | ❌ Yok |
| Ayrı giriş sayfası (platform.stoaix.com/login) | ❌ Yok (dashboard'a direkt gidiliyor, auth yok) |
| İnteraktif canlı demo sayfası (/demo-interactive — kayıt olmadan ürünü deneme) | ❌ Yok |
| Partner/Bayi programı sayfası (%50 komisyon) | ❌ Yok |
| Blog, Hakkımızda, Kariyer, İletişim, Yasal sayfalar | ❌ Yok |
| Özellik-plan eşleşme tablosu ("Voice AI Inbound — Professional+", "CRM — Business" gibi) | ❌ Yok (fiyatlandırma sayfası hiç yok) |
| Somut testimonial/vaka metrikleri ("8 saat → 4 dakika", "240 randevu / 6 hafta") | ❌ Yok |
| SSS (FAQ) bölümü | ❌ Yok |
| Çok dilli plan kısıtlaması mantığı (TR/EN/AR dahil, diğerleri add-on) | ❌ Yok |

**Özetle:** Şu ana kadar sadece "ürünün iç dashboard'unu" kurduk. STOAIX'in asıl gövdesi olan **pazarlama sitesi + satış hunisi + plan/kayıt sistemi** hiç yapılmadı. "Aynı değil" hissi büyük ölçüde buradan geliyor.

---

## 2. Detaylı Sayfa Envanteri (STOAIX'ten çıkarılan tam liste)

### 2.1 Ana Sayfa (/)
- Üstte kayan duyuru şeridi ("Yeni özellik...", "Şu anda canlı..." gibi 10+ rotasyonlu mesaj)
- Hero: "AI resepsiyonistiniz... dakikalar içinde canlı" + çoklu kelime animasyonu (call center/satış ajanı/chatbot/ses ajanı/CRM kelimeleri dönüşümlü)
- "500+ klinik denetiminden çıkan içgörüler" güven rozeti
- Entegrasyon logo şeridi (25+ logo: WhatsApp, Zapier, HubSpot, Salesforce, Twilio, GHL, Calendly, Pipedrive, Zoho, Google Ads, TikTok, LinkedIn, Instagram, Telegram, Facebook, Google Calendar, Slack, Dentsoft, Komo CRM, Typeform, Notion, Airtable, Webhook API, Dentally, Pabau, Fresha, Acuity, Freshworks, YouTube)
- Canlı demo bölümü (dashboard önizlemesi — senin gördüğün ekranlar)
- Canlı istatistik sayaçları
- "STOAIX nedir" — 4 yetenek kartı
- "Her klinik türü için" — 7 sektör etiketi
- Omnichannel bölümü — 5 kanal kartı
- "5 dakikada kurulum" — 3 adım
- Gelir kaybı hesaplayıcı
- Kurucu ortaklar LinkedIn kartları (Ata Ulufer - CEO, Emir Türköz - CTO)
- Footer (Ürün/Çözümler/Şirket/Yasal linkleri)

### 2.2 Healthcare Clinics sayfası (sektöre özel iniş sayfası)
- "60 saniyede geri arama" vurgusu
- **4 acı noktası bölümü** (form lead'e anında dönüş yok, takip sistemi yok, randevuya gelmeme, binlerce soğuk lead)
- **"Nasıl çalışır" — somut AI konuşma örneği** (gerçek diyalog akışı gösterimi)
- **3 gerçek testimonial, somut rakamlarla**: "8 saat → 4 dakika yanıt süresi", "%80 admin zamanı tasarrufu", "6 haftada 240 randevu"
- **Özellik-plan eşleşme**: Voice AI Inbound (Professional+), Voice AI Outbound (Business), WhatsApp (Essential+), CRM (Business), 15+ Dil (Business), Zapier/Make (Business)
- **4 klinik türü kartı**: Saç Ekimi, Diş, Estetik Cerrahi, Medikal Estetik — her biri kendine özel metinle
- **Çok dilli bölüm**: TR/EN/AR planlara dahil, 12+ ek dil add-on olarak satılıyor
- **Kurulum add-on'u**: $297'ye 60 dakikalık kurulum desteği
- **Detaylı SSS** (6 soru-cevap)

### 2.3 Modules sayfası (Add-on ürün mağazası)
- **AI Smile Design** modülü: Hasta fotoğrafından gülüş simülasyonu, WhatsApp'a otomatik gönderim — $99/ay
- **Social Media AI** modülü: İçerik üretimi + zamanlama + otomatik yayınlama (Instagram/Facebook) — $129/ay
- **Bundle** (ikisi bir arada): $199/ay (%13 indirim)
- Karşılaştırma tablosu (hangi modülde ne var)
- Modül bazlı ayrı checkout akışı
- "Tam platforma mı ihtiyacın var" yönlendirmesi (Starter Plan $497/ay)

### 2.4 Dashboard (senin ekran görüntülerinden — zaten büyük ölçüde yaptık)
Genel Bakış, Gelen Kutusu, Çağrılar, Lead Pipeline, AI Asistan, İş Akışları, Hesap Ayarları — **bu kısım büyük ölçüde tamamlandı.**

### 2.5 Diğer sayfalar (henüz incelemedik, muhtemelen benzer yapıda)
- /demo-interactive — kayıtsız, canlı interaktif ürün denemesi
- /signup.html — plan seçimli kayıt akışı
- /partners.html — bayi programı (%50 komisyon)
- platform.stoaix.com/login — gerçek kullanıcı girişi
- /about, /blog, /contact — kurumsal sayfalar
- /privacy-policy, /terms, /cookie-policy — yasal sayfalar

---

## 3. Öncelik Sıralaması — Ne Zaman Ne Yapılmalı

Her şeyi birden yapmaya çalışmak (yine) dağınıklığa yol açar. Öneri sırası:

| Öncelik | Ne | Neden |
|---|---|---|
| **1 (şimdi)** | Fiyatlandırma sayfası + plan-özellik eşleşme tablosu | Şu an hiç yok, en temel eksik |
| **2** | Sektöre özel iniş sayfası (Healthcare Clinics eşdeğeri — Fin pazarına uyarlanmış acı noktaları + testimonial'lar) | Asıl "satış" mesajı burada, dashboard'dan önemli |
| **3** | Basit auth (kayıt/giriş) — gerçek kullanıcı hesabı olmadan "gerçek ürün" hissi oluşmaz | Şu an herkes doğrudan dashboard'a giriyor |
| **4** | SSS bölümü | Kolay, hızlı, dönüşümü artırır |
| **5** | Add-on modül mağazası (Smile Design / Social Media AI eşdeğeri) | Daha ileri faz — önce çekirdek ürün + satış hunisi tamamlanmalı |
| **6** | Partner/Bayi sayfası | En son — önce ürünün kendisi tamamlanmalı |

---

## 4. Claude Code için Prompt — Öncelik 1-4'ü Kapsayan

```
docs/vahti-ai-eksik-ozellik-analizi.md dosyasını oku (yeni eklendi).

Şu ana kadar sadece dashboard'u (mock veriyle) ve basit bir landing page'i 
kurduk. Şimdi eksik olan pazarlama/satış katmanını tamamla:

GÖREV A — Fiyatlandırma sayfası (/[locale]/pricing):
- 3-4 plan kartı tasarla (kendi isimlerimizle, STOAIX'in fiyatlarını 
  kopyalama — Finlandiya pazarına uygun kendi fiyatlarımızı öner, 
  örn. Essential/Professional/Business/Enterprise yapısında ama € 
  cinsinden ve Fin pazarına makul rakamlarla)
- Özellik karşılaştırma tablosu: hangi özellik hangi planda var 
  (Sesli AI Gelen — Professional+, Sesli AI Giden — Business, 
  WhatsApp — Essential+, CRM — Business, Çok Dilli — Business, 
  Zapier/Webhook — Business gibi bir mantık kur)
- Landing page'deki fiyatlandırma bölümüyle tutarlı olsun

GÖREV B — Sektöre özel iniş sayfası (/[locale]/terveysklinikat 
veya /[locale]/for-clinics):
- "Neden lead kaybediyorsunuz" bölümü: 4 acı noktası kartı 
  (Fince/İngilizce, orijinal metin — STOAIX'in metnini çevirme, 
  kendi cümlelerimizi yaz ama aynı 4 temayı işle: anında geri 
  dönüş yok, takip sistemi yok, randevuya gelmeme, soğuk lead'ler)
- Somut AI konuşma örneği (Fince bir diyalog kutusu — hasta sorusu 
  + AI yanıtı, chat balonu tasarımıyla)
- 3 mock testimonial kartı (somut rakamlarla, örn. "8 tuntia → 4 
  minuuttia vastausaika" gibi — kendi uydurma ama gerçekçi rakamlarımız)
- SSS bölümü (6 soru-cevap, akordiyon/accordion component)

GÖREV C — Basit auth sistemi:
- NextAuth.js (veya Auth.js) ile email/şifre tabanlı basit giriş/kayıt
- /login ve /signup sayfaları
- Dashboard'a girişi bu auth'un arkasına al (şu an herkes direkt 
  giriyor, bunu düzelt)
- Prisma'daki Kullanici modelini bu auth ile bağla

Her görevi bitirdiğinde çalıştığını doğrula, özetle, sıradakine geç.
İşin sonunda site haritasını (hangi URL ne işe yarıyor) listele.
```

Bu üçü tamamlandığında, sistem artık "sadece bir dashboard" değil, STOAIX'e yapısal olarak çok daha yakın, uçtan uca bir ürün gibi hissettirecek — kayıt ol, planı gör, sektöre özel mesajı oku, giriş yap, dashboard'u kullan.
