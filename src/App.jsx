import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import PromoBanner from "./components/PromoBanner";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Services />
                <PromoBanner />
                <Features />
                <Testimonials />
              </>
            } />
            <Route path="/umroh" element={<h1 className="text-center text-3xl font-bold mt-32 mb-32">Halaman Umroh</h1>} />
            <Route path="/domestik" element={<h1 className="text-center text-3xl font-bold mt-32 mb-32">Halaman Domestik & Internasional</h1>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;