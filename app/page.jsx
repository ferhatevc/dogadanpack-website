import { Navbar, Hero, Products, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";
import ScrollJourney from "../components/ScrollJourney.jsx";
import StudioGallery from "../components/StudioGallery.jsx";
import Catalog from "../components/Catalog.jsx";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ScrollJourney />
      <Products />
      <StudioGallery />
      <Catalog />
      <Features />
      <SocialProof />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
