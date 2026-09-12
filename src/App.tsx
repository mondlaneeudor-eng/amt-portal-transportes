import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesGrid } from "./components/ServicesGrid";
import { Footer } from "./components/Footer";
import { ControlRoomContainer } from "./components/ControlRoom/ControlRoomContainer";
import { useControlRoomRoute } from "./hooks/useControlRoomRoute";

function App() {
  const { isControlRoom, enter, exit } = useControlRoomRoute();

  return (
    <div className="page">
      <Header onOpenControlRoom={enter} />
      <main className="page__main">
        {isControlRoom ? (
          <ControlRoomContainer onExit={exit} />
        ) : (
          <>
            <Hero />
            <ServicesGrid />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
