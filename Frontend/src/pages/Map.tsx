import Footer from "../components/Footer";
import MapComponents from "../components/MapComponents";
import Navbar from "../components/Navbar";

export default function Map() {
  return (
    <main className="bg-slate-100 w-screen min-h-dvh h-auto text-black">
      <Navbar />
      <MapComponents />
      <Footer />
    </main>
  );
}
