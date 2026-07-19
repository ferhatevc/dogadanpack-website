# DoğadanPack — Landing Page

"Yeşil Bir Gelecek İçin" — doğal ve organik tek kullanımlık gıda servis ürünleri için Next.js 14 landing page.

## Teknolojiler
- **Next.js 14** (App Router, static export)
- **Tailwind CSS** — tasarım token'ları `tailwind.config.js` içinde
- **Framer Motion** — scroll reveal, stagger, hover ve giriş animasyonları
- 21st.dev component pattern'leri: Animated Text Cycle, Interactive Hover Button, Testimonials Marquee, Count-Up Stats, Pricing, FAQ Accordion

## Kurulum
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build
```bash
npm run build      # statik çıktı: out/
```

## Tasarım Sistemi
Tüm tasarım kuralları `.claude/skills/dogadanpack-design/SKILL.md` dosyasında.
Claude Code bu projede UI geliştirirken skill'i otomatik referans alır.
Kurallar: Pantone 5535 C (#1F3B13) marka paleti, Fraunces + Montserrat tipografi,
8px grid, asimetrik organik köşeler, uydurma istatistik yasağı.

## Yayına Almadan Önce
- [ ] Referans metinlerini ("Örnek Catering" vb.) gerçek müşteri alıntılarıyla değiştir
- [ ] WhatsApp ve E-Katalog linklerini gerçek adreslerle doldur
- [ ] Ürün kartlarındaki çeşit sayılarını doğrula
- [x] Stüdyo görselleri kalıcı: `public/studio/` altında optimize webp olarak gömülü
