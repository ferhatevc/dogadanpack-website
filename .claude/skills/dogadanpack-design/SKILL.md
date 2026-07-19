---
name: dogadanpack-design
description: DoğadanPack marka arayüzleri için tasarım sistemi ve zevk rehberi. Web sitesi, landing page, e-katalog, admin paneli veya herhangi bir UI bileşeni geliştirirken KULLAN. Tipografi ölçeği, 8px boşluk sistemi, renk token'ları, component pattern'leri ve "generic AI estetiğinden kaçınma" kurallarını içerir. Frontend kodu yazmadan ÖNCE oku.
---

# DoğadanPack Tasarım Sistemi

Sen küçük bir stüdyonun tasarım lideri gibi çalışıyorsun. DoğadanPack, Sivas merkezli
premium bir eko-ambalaj markası: mısır nişastası, şeker kamışı bagasse ve areca palmiye
yaprağından üretilen tek kullanımlık gıda servis ürünleri. Hedef kitle: catering
firmaları, restoran zincirleri, toptancılar. Ton: doğal, güvenilir, premium — asla
ucuz "yeşil pazarlama" hissi vermez.

## 1. Renk Token'ları

Rastgele hex kodu YASAK. Yalnızca bu token'ları kullan:

```css
:root {
  /* Marka — Pantone 5535 C */
  --green:      #1F3B13;  /* primary: başlıklar, CTA, logo, footer zemini */
  --green-soft: #2E5220;  /* primary hover durumu */
  --leaf:       #4C8A2E;  /* accent: eyebrow, vurgu, italik em, link hover */
  --moss:       #7BA05B;  /* soft accent: hover border, ikincil vurgular */

  /* Nötrler — doğal elyaf paleti */
  --bone:  #F7F5EE;  /* sayfa zemini (bagasse tonu) */
  --fiber: #EDE9DC;  /* ikincil zemin, ikon kutuları, why-section */
  --cream: #FBFAF5;  /* kart zeminleri */
  --line:  #DDD8C8;  /* border'lar */
  --ink:   #171D12;  /* gövde metni */

  /* Koyu zemin üzeri metin */
  --on-green:       #F2EFE4;  /* yeşil zeminde ana metin */
  --on-green-muted: #AEC49A;  /* yeşil zeminde ikincil metin/ikon */
}
```

Kurallar:
- Saf beyaz (`#FFFFFF`) ve saf siyah (`#000000`) kullanma — palet doğal elyaf tonlarında.
- Metin kontrastı minimum 4.5:1 (WCAG AA). `--ink` / `--bone` ve `--on-green` / `--green`
  çiftleri test edilmiştir; yeni kombinasyon eklersen kontrastını doğrula.
- Kırmızı/uyarı gerekiyorsa `#A63D2F` (toprak kızılı) — parlak `#FF0000` asla.

## 2. Tipografi Ölçeği

İki font, net roller — rastgele font boyutu YASAK:

- **Fraunces** (serif, optik boyutlu): display ve başlıklar. Weight 400–600.
  Sıcak, organik karakter taşır; markanın "doğal premium" sesi budur.
- **Montserrat** (geometrik sans): gövde, UI, buton, label. Weight 400–800.
  Logonun harf yapısıyla akrabadır.

Ölçek (1.25 oranlı, clamp ile akışkan):

```css
--text-display: clamp(2.4rem, 5vw, 3.8rem);   /* hero h1 — Fraunces 500 */
--text-h2:      clamp(1.8rem, 3.4vw, 2.6rem); /* bölüm başlığı — Fraunces 500 */
--text-h3:      1.15rem;                       /* kart başlığı — Montserrat 600 */
--text-body:    1rem;                          /* gövde — Montserrat 400, lh 1.6 */
--text-lead:    1.08rem;                       /* hero paragrafı */
--text-small:   0.88rem;                       /* kart açıklaması */
--text-caption: 0.8rem;                        /* alt etiketler */
--text-eyebrow: 0.78rem;                       /* 700, letter-spacing .14em, uppercase */
```

- Satır yüksekliği: başlıklarda 1.15, gövdede 1.6.
- İtalik vurgu yalnızca Fraunces'ta ve yalnızca marka mesajlarında
  ("doğaya döner.", slogan).
- ALL CAPS yalnızca eyebrow ve logo lockup'ta.

## 3. Boşluk Sistemi — 8px Grid

Tüm padding, margin, gap değerleri 8'in katı (yarım adım 4px'e yalnızca ikon
hizalamada izin var):

```
4 / 8 / 16 / 24 / 32 / 48 / 56 / 64 / 96 / 110
```

- Bölüm dikey padding: `96px` (mobilde 64px).
- Kart iç padding: `32px 24px`.
- Grid gap: `24px`.
- Container: `max-width: 1180px; padding: 0 24px`.
- Rastgele `13px`, `27px` gibi değerler YASAK.

## 4. Component Pattern'leri

### Buton
- Şekil: `border-radius: 999px` (hap) — köşeli buton bu markada yok.
- Primary: `--green` zemin, beyaz metin, `0 8px 24px rgba(31,59,19,.25)` gölge.
  Hover: `--green-soft` + 2-3px yukarı kalkma. Tap: scale .97.
- Ghost: şeffaf zemin, `2px solid --green` border.
- Her durumda: `cursor: pointer`, görünür `:focus-visible` (3px `--leaf` outline,
  3px offset), 150-300ms geçiş.
- İkon + metin arası gap: `10px`. İkonlar stroke tabanlı SVG (Lucide tarzı) — emoji YASAK.

### Kart
- Zemin `--cream`, border `1px solid --line`, radius `20px`, padding `32px 24px`.
- İkon kutusu: 64px, **asimetrik organik radius** `18px 22px 16px 24px`, zemin `--fiber`.
  Bu asimetri markanın imzasıdır — düz `border-radius: 12px` kullanma.
- Hover: 6-8px yukarı kalkma + `0 18px 40px rgba(31,59,19,.12)` gölge + border `--moss`.
  Spring geçiş (stiffness ~320, damping ~24) tercih et.
- İçerik sırası: ikon → h3 → açıklama → yeşil alt-link (`--leaf`, 600).

### Form
- Input: `--cream` zemin, `--line` border, radius `12px`, padding `12px 16px`.
- Focus: border `--leaf` + hafif `rgba(76,138,46,.12)` ring. Kırmızı hata ancak
  toprak kızılı `#A63D2F` ile, hata metni input'un hemen altında `--text-caption`.
- Label her zaman input'un üstünde, `--text-caption` 600. Placeholder label yerine geçmez.
- Buton adları eylemi söyler: "Teklif İste", "Katalog İndir" — "Gönder" değil.

### Bölüm yapısı
- Her bölüm: eyebrow → h2 → (opsiyonel) tek paragraf → içerik. `sec-head` max 640px.
- Zemin ritmi: bone → green şerit → bone → fiber (üst köşeleri 64px radius) → bone → green footer.
- Organik blob'lar (asimetrik border-radius) yalnızca hero ve CTA'da, opacity ≤ .15.

### Animasyon (Framer Motion varsayılan)
- Giriş: fade-up 28px, 0.6s, ease `[0.22, 1, 0.36, 1]`, `whileInView` + `once: true`.
- Stagger: 70-120ms adım.
- Ambient hareket (blob, yaprak): 9-22s döngü, hafif.
- `useReducedMotion` HER ZAMAN kontrol edilir; azaltılmışsa ambient ve hover
  transform'ları kapat.

## 5. Generic AI Estetiğinden Kaçın

Bu markayı "AI yaptı" görünümünden uzak tutan kurallar:

- **YASAK:** mor→mavi gradient'ler, glassmorphism, neon glow, `#6366F1`/Tailwind
  indigo varsayılanları, koyu zemin + tek asit yeşili accent, emoji ikonlar,
  "🚀 Hemen Başla" tarzı copy.
- **YASAK:** krem zemin + terracotta accent kombinasyonu (yaygın AI şablonu) —
  bizim nötrlerimiz elyaf tonları, accent'imiz her zaman yeşil ailesi.
- **YASAK:** anlamsız numaralı marker'lar (01/02/03) — sıra ancak gerçek bir süreç
  anlatıyorsa (ör. yaşam döngüsü: Bitkiden Gelir → Sofranıza Ulaşır → Doğaya Döner).
- **YASAK:** her bölümde ayrı animasyon şovu. Cesaret tek yerde harcanır
  (imza öğe: organik asimetrik köşeler + logo sahnesi); geri kalan sessiz ve disiplinli.
- Copy kuralları: Türkçe, sade, aktif fiil. Satış jargonu ("devrim niteliğinde",
  "çığır açan") yok. Markanın gerçek dili: "Plastik değildir. Bitki bazlıdır.",
  "Bitkiden gelir, doğaya döner."
- Sayı/istatistik ancak gerçekse yazılır — uydurma "%97 müşteri memnuniyeti" YASAK
  (greenwashing algısı yaratır).
- Stok foto estetiği yerine ürünün kendi malzeme dünyası: bagasse dokusu, palmiye
  yaprağı deseni, elyaf tonları.

## 6. Teslim Öncesi Kontrol Listesi

- [ ] Tüm renkler token'lardan mı? (rastgele hex yok)
- [ ] Tüm boşluklar 8px grid'de mi?
- [ ] Font boyutları ölçekten mi?
- [ ] Tıklanabilir her öğede cursor-pointer + hover + focus-visible var mı?
- [ ] Kontrast 4.5:1 sağlanıyor mu?
- [ ] `prefers-reduced-motion` / `useReducedMotion` uygulanıyor mu?
- [ ] 375 / 768 / 1024 / 1440px kırılımlarında test edildi mi?
- [ ] Emoji ikon, mor gradient, uydurma istatistik var mı? (varsa sil)
- [ ] Logo doğru mu: Ğ üstünde yaprak, O içinde çatal-kaşık-bıçak, Pantone 5535 C?
