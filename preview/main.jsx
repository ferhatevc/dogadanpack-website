import React from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import { Navbar, Hero, Products, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";
import ScrollJourney from "../components/ScrollJourney.jsx";
import StudioGallery from "../components/StudioGallery.jsx";
import Catalog from "../components/Catalog.jsx";

createRoot(document.getElementById("root")).render(
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
