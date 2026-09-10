# Vahti AI — Fonksiyonel Şartname ve Teknik Geliştirme Dökümanı
## (Ek Döküman #2 — Mimari analizin üzerine)

> Bu döküman, STOAIX'in genel arayüzünden gözlemlenen **fonksiyonel kapsamı** (hangi ekranlar var, hangi işlevler var, veriler nasıl akıyor) referans alır. Tasarım, renk paleti, metinler, logo, ekran düzeni ve marka kimliği **STOAIX'ten kopyalanmamıştır** — tamamen orijinal olarak "Vahti AI" için tanımlanmıştır. Amaç: aynı ürün kategorisinde, aynı işlevsel kapsamda, Finlandiya pazarına uygun kendi ürününüzü kurmak.

---

## 1. Ürün Kapsamı — Fonksiyonel Envanter

Aşağıdaki liste, incelenen ekranlardan çıkarılan **işlev listesidir** (tasarım değil, yetenek):

### 1.1 Giriş Kanalları
| Kanal | Fonksiyon |
|---|---|
| Sesli AI | Telefon hattı üzerinden 7/24 arama karşılama, çok dilli otomatik algılama |
| WhatsApp | Fiyat sorgusu, randevu, SSS — otomatik yanıt |
| Web Chat | Site ziyaretçisini nitelendirme, anında randevu |
| Outbound (Giden Arama) | Yeni lead geldiğinde 60 saniye içinde otomatik arama |
| Instagram/Messenger DM | DM ve hikaye yanıtlarını randevuya çevirme |

### 1.2 Dashboard Modülleri (Klinik Paneli)

**Genel Bakış**
- Bugünkü konuşma sayısı, aktif lead sayısı, sesli arama sayısı
- AI çözüm oranı (%), dönüşüm oranı (%), dil çeşitliliği
- Son aktiviteler akışı (kim, ne yaptı, ne zaman)
- Haftalık konuşma grafiği (bar chart)

**Gelen Kutusu**
- Kanal bazlı (WhatsApp/Sesli/Chat) birleşik mesaj listesi
- Konuşma önizlemesi + zaman damgası + dil etiketi
- Konuşma detayı: mesaj geçmişi, AI yanıtları vurgulanmış

**Çağrılar**
- Sesli görüşme kayıt listesi (kişi, yön, süre, işleyen, durum)
- Otomatik konuşma özeti (AI tarafından üretilmiş)
- Toplanan bilgiler (yapılandırılmış: hasta profili, tercih, bütçe, konum, zaman)
- Satış kapatma önerisi (AI'nin önerdiği sonraki adım + lead skoru)

**Lead Pipeline**
- Kanban görünüm: Yeni → AI Qualifying → Hot Lead → Nurturing → Randevu (özelleştirilebilir aşamalar)
- Her kart: isim, ilgilendiği hizmet, lead skoru (0-100), kaynak kanal
- Sürükle-bırak aşama değiştirme

**AI Asistan**
- Bilgi Bankası: klinik hizmetlerine dair yapılandırılmış bilgi girişleri (RAG kaynağı)
- Test Ekranı: Chat Test (yazılı simülasyon) + Sesli Test (arama simülasyonu) — canlıya almadan önce agent'ı test etme

**İş Akışları (Otomasyonlar)**
- İlk Temas Araması: yeni lead'e otomatik arama tetikleme
- Sıcak Takip: yanıtsız lead'e otomatik takip mesajı (X saat sonra)
- Randevu Hatırlatma: randevudan X saat/gün önce otomatik hatırlatma
- Randevuya Gelmedi Takibi: no-show sonrası otomatik yeniden iletişim
- Memnuniyet Anketi: işlem sonrası otomatik geri bildirim toplama
- Reaktivasyon: X gündür sessiz kalan eski lead'lere otomatik yeniden ulaşma
- Her iş akışı: aktif/taslak durumu + çalıştırma sayacı

**Hesap Ayarları**
- Genel: klinik adı, e-posta, telefon, şehir/ülke, sektör, AI dili, zaman dilimi
- Modüller: aktif eklentiler
- Plan & Fatura: abonelik yönetimi
- Pipelinelar: pipeline aşamalarını özelleştirme
- Destek

### 1.3 Landing Page Bileşenleri
- Canlı istatistik sayaçları (toplam yanıtlanan mesaj, karşılanan müşteri, dönüşen görüşme)
- "Ne yapıyoruz" özet kartları (4 ana yetenek)
- Çok kanallı özellik ızgarası (5 kanal, her biri kısa açıklama)
- Gelir kaybı hesaplayıcı (randevu değeri × kaçırılan başvuru × dönüşüm oranı → aylık/yıllık kayıp)
- 3 adımlı kurulum göstergesi (Tanıt → Yapılandır → Yayına al)
- Fiyatlandırma tablosu: katmanlı planlar (Essential/Professional/Business/Enterprise), özellik bazlı karşılaştırma satırları

### 1.4 Add-on Modül Mantığı (opsiyonel — sonraki faz)
- Bağımsız, aylık faturalanan eklentiler (STOAIX'te "Smile Design", "Social Media AI" örnekleri var)
- Finlandiya için önerilen eşdeğerleri: Bölüm 5'te

---

## 2. Vahti AI — Orijinal Marka ve Tasarım Yönü

**Bu bölüm bilinçli olarak STOAIX'ten farklı olacak şekilde tanımlanmıştır.**

| Öğe | Vahti AI yönü |
|---|---|
| Renk paleti | Nordic/minimal estetik: buz mavisi + antrasit + beyaz negatif alan (STOAIX'in koyu lacivert sidebar + mavi vurgu paletinden bilinçli olarak farklı — örn. açık gri arka plan + tek vurgu rengi) |
| Tipografi | Fince okunabilirliği güçlü bir grotesk font (örn. Inter, Manrope) |
| Ton/dil | Fin iş kültürüne uygun: sade, abartısız, veri odaklı — agresif satış dili yerine güven odaklı ("luotettava", "aina valmiina" gibi kavramlar) |
| Sidebar isimleri (öneri) | Yleiskatsaus (Genel Bakış) · Saapuneet (Gelen Kutusu) · Puhelut (Çağrılar) · Liidit (Lead Pipeline) · Tekoälyavustaja (AI Asistan) · Työnkulut (İş Akışları) · Asetukset (Ayarlar) |
| Logo/isim | "Vahti AI" — önceki dökümanda önerilen isim |

---

## 3. Çok Dilli Mimari (Fince öncelikli + İngilizce)

### 3.1 Dil stratejisi
- **Varsayılan dil**: Fince (fi)
- **İkincil**: İngilizce (en) — dil değiştirici header'da (STOAIX'teki EN|TR yapısına benzer ama fi|en)
- **Üçüncül (opsiyonel, ileri faz)**: İsveççe (sv) — Finlandiya'nın ikinci resmi dili, kurumsal/kamu segmentinde önemli

### 3.2 Teknik yaklaşım
- Frontend: i18next veya next-intl (Next.js kullanılıyorsa) ile key-based çeviri yapısı
- Tüm UI string'leri `fi.json` / `en.json` (/ `sv.json`) dosyalarında tutulur — hardcoded metin yok
- AI agent tarafı: Claude'a gönderilen system prompt, kullanıcının konuştuğu dile göre dinamik seçilir (STOAIX'teki "AI Dili: Otomatik algılamaya açık" ayarının eşdeğeri)
- URL yapısı: `vahti.fi/` (Fince varsayılan) ve `vahti.fi/en/` (İngilizce) — SEO için ayrı path

### 3.3 Ses katmanı çok dillilik
- STT/TTS sağlayıcısının Fince desteği ayrı doğrulanmalı (bkz. önceki döküman Bölüm 2)
- Dil algılama: gelen aramanın ilk birkaç saniyesinden dil tespiti, sonra o dilde devam

---

## 4. Veri Modeli (Taslak)

```
Klinik (tenant)
 ├─ id, ad, email, telefon, şehir, ülke, sektör, ai_dili, saat_dilimi
 ├─ Kullanıcılar (ekip üyeleri, roller)
 ├─ Bilgi Bankası Girdileri (RAG kaynağı: hizmet adı, kategori, detaylar)
 ├─ Lead'ler
 │   ├─ id, isim, dil, kaynak_kanal, lead_skoru, pipeline_aşaması
 │   ├─ Konuşmalar (kanal, mesajlar, zaman damgaları)
 │   └─ Çağrı Kayıtları (süre, özet, toplanan_bilgiler, öneri)
 ├─ İş Akışları (tip, tetikleyici, durum: aktif/taslak, çalıştırma_sayısı)
 └─ Abonelik (plan, kullanım limitleri: AI konuşma/ay, sesli dakika/ay, ekip üyesi limiti)
```

---

## 5. Fince Pazar için Add-on Modül Önerileri (STOAIX eşdeğeri değil, orijinal fikir)

STOAIX'in "Gülüş Tasarımı" ve "Sosyal Medya AI" modüllerinin fonksiyonel kategorisine (görsel/ içerik üretim eklentisi) benzer ama Fin pazarına özgü fikirler://
- **Ennakkoarvio** (Ön Değerlendirme): Fotoğraftan basit estetik önizleme — hukuki/tıbbi onay süreçleri Finlandiya'da farklı olabileceğinden dikkatli değerlendirilmeli
- **Sisältöavustaja** (İçerik Asistanı): Instagram/Facebook için AI içerik üretimi + planlama — bu, teknik olarak daha az riskli ve hızlı eklenebilir bir modül

Bu modülleri Faz 5'e (genişleme) erteleyip önce çekirdek platforma odaklanmanızı öneririm.

---

## 6. Claude Code için Görev Listesi (Sıralı, Uygulanabilir Prompt'lar)

Aşağıdaki görevleri **tek tek, sırayla** Claude Code'a verin — her birini test edip commit attıktan sonra bir sonrakine geçin.

### Görev 1 — Proje iskeleti
```
docs/architecture.md ve docs/functional-spec.md dosyalarını oku.
Next.js (TypeScript) + PostgreSQL ile proje iskeleti kur:
- /app dizin yapısı, i18n desteği (next-intl), fi ve en locale dosyaları
- Prisma ile "Klinik", "Kullanici", "Lead", "Konusma" tablolarını tanımla
- .env.example dosyası (ANTHROPIC_API_KEY, DATABASE_URL placeholder'ları ile)
- README.md: proje amacı ve kurulum adımları
```

### Görev 2 — Claude agent temel entegrasyonu
```
/api/chat endpoint'i oluştur:
- Gelen mesajı alır, Claude API'ye gönderir (Sonnet 5)
- system prompt, klinik bilgi bankasından (mock veri ile başla) oluşturulsun
- Basit tool use: "randevu_olustur" adında mock bir araç tanımla (henüz gerçek takvime bağlanmasın, sadece log'lasın)
- Fince ve İngilizce mesajları ayırt edip uygun dilde yanıt versin
```

### Görev 3 — Dashboard: Genel Bakış
```
/dashboard/overview sayfasını oluştur:
- Mock veriyle: bugünkü konuşma sayısı, aktif lead sayısı, AI çözüm oranı kartları
- Haftalık konuşma grafiği (recharts kullan)
- Fince arayüz metinleri (fi.json üzerinden)
```

### Görev 4 — Gelen Kutusu + Lead Pipeline
```
/dashboard/inbox: kanal bazlı mock konuşma listesi + detay paneli
/dashboard/pipeline: sürükle-bırak kanban (Yeni/AI Değerlendirme/Sıcak/Bekleyen/Randevu aşamaları), 
dnd-kit kütüphanesi kullan
```

### Görev 5 — Gerçek WhatsApp entegrasyonu
```
WhatsApp Business Cloud API webhook'unu bağla:
- Gelen mesajı /api/chat'e yönlendir
- Claude yanıtını WhatsApp'a geri gönder
- Konuşmayı veritabanına kaydet
```

### Görev 6 — Takvim entegrasyonu
```
Google Calendar API ile randevu oluşturma aracını gerçek hale getir 
(Görev 2'deki mock "randevu_olustur" aracını gerçek API çağrısına bağla)
```

### Görev 7 — Bilgi Bankası (RAG)
```
/dashboard/ai-assistant sayfası: klinik hizmet bilgilerini CRUD ile yönetme
pgvector kurulumu + embedding pipeline (metni parçalayıp vektöre çevirme)
Claude'a context olarak en alakalı 3-5 parçayı gönderme mantığı
```

### Görev 8 — İş Akışları (otomasyon motoru)
```
Basit bir cron/queue tabanlı otomasyon sistemi:
- "Sıcak Takip": X saat yanıtsız kalan lead'e otomatik mesaj
- "Randevu Hatırlatma": randevudan X saat önce mesaj
node-cron veya BullMQ kullanılabilir
```

### Görev 9 — Ses katmanı (en son, en karmaşık)
```
Twilio ile telefon numarası bağlantısı, gelen aramayı Deepgram (Fince STT) ile 
metne çevirip Claude'a gönderme, yanıtı TTS ile sese çevirip Twilio üzerinden 
söyleme — streaming pipeline kur.
```

---

## 7. Yasal / Marka Notu (Tekrar Vurgu)
- Vahti AI'nin arayüz tasarımı, metinleri, görselleri STOAIX'ten kopyalanmamalı — bu döküman sadece **işlev listesi** aktarıyor, tasarım dosyası veya kod içermiyor.
- Finlandiya'da şirket/marka tescili öncesi PRH (Patentti- ja rekisterihallitus) üzerinden isim çakışma kontrolü yapılmalı.
- Sağlık verisi işleme öncesi GDPR + Valvira uyum değerlendirmesi bağımsız bir hukuk danışmanıyla teyit edilmeli.
