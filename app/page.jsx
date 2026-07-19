import { Navbar, Hero, Products, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";
import ScrollJourney from "../components/ScrollJourney.jsx";
import StudioGallery from "../components/StudioGallery.jsx";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ScrollJourney />
      <Products />
      <StudioGallery />
      <Features />
      <SocialProof />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
