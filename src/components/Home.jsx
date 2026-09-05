import Hero from "./Hero";
import Services from "./Services";
import PromoBanner from "./PromoBanner";
import Features from "./Features";
import Testimonials from "./Testimonials";

function Home() {
  return (
    <div className="pt-20">
      <Hero />
      <Services />
      <PromoBanner />
      <Features />
      <Testimonials />
    </div>
  );
}

export default Home;