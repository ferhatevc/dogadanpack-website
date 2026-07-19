import { Navbar, Hero, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
