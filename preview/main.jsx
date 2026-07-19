import React from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import { Navbar, Hero, Products, Features, SocialProof, Pricing, Faq, Cta, Footer } from "../components/Sections.jsx";

createRoot(document.getElementById("root")).render(
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
