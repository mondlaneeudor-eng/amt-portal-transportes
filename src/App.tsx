import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesGrid } from "./components/ServicesGrid";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="page">
      <Header />
      <main className="page__main">
        <Hero />
        <ServicesGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
