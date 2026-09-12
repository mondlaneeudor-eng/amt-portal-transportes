import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesGrid } from "./components/ServicesGrid";
import { Footer } from "./components/Footer";
import { ControlRoomContainer } from "./components/ControlRoom/ControlRoomContainer";
import { InstallBanner } from "./components/InstallBanner";
import { UpdateBanner } from "./components/UpdateBanner";
import { useControlRoomRoute } from "./hooks/useControlRoomRoute";
import { useServiceWorkerUpdate } from "./hooks/useServiceWorkerUpdate";

function App() {
  const { isControlRoom, enter, exit } = useControlRoomRoute();
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();

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
      <InstallBanner />
      {updateAvailable && <UpdateBanner onUpdate={applyUpdate} />}
    </div>
  );
}

export default App;
