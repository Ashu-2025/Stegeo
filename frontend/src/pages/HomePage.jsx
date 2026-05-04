import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import TechnologyStack from "../components/sections/TechnologyStack";
import SecurityHighlights from "../components/sections/SecurityHighlights";
import UseCases from "../components/sections/UseCases";

function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <TechnologyStack />
        <SecurityHighlights />
        <UseCases />
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
