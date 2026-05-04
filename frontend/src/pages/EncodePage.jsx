import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import EncodePanel from "../components/sections/EncodePanel";

function EncodePage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 min-h-[calc(100vh-160px)]">
        <div className="mx-auto max-w-3xl opacity-0 fade-in-up">
          <EncodePanel />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EncodePage;
