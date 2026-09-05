import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import PromoBanner from "./components/PromoBanner";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Umroh from "./components/Umroh";
import Domestik from "./components/Domestik";

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
            <Route path="/umroh" element={<Umroh />} />
            <Route path="/domestik" element={<Domestik />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;