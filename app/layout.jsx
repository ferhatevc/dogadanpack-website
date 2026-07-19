import "./globals.css";

export const metadata = {
  title: "DoğadanPack — Yeşil Bir Gelecek İçin",
  description:
    "Mısır nişastası, şeker kamışı ve palmiye yaprağından üretilen, doğada tamamen çözünen tek kullanımlık gıda servis ürünleri. Plastik değildir — bitki bazlıdır.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
