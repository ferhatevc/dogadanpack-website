import { Navbar, Hero, Products, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <Features />
      <SocialProof />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
