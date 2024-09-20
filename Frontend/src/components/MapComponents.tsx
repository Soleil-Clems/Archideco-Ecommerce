import { FC } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponents: FC = () => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("Rue Paradis, 13006 Marseille");
    alert("Adresse copiée dans le presse-papiers !");
  };

  const handleOpenMaps = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=43.2857363,5.3799329",
      "_blank"
    );
  };

  const handleOpenRDV = () => {
    window.open(
      "https://www.mobalpa.fr/me-rendre-en-magasin/magasins-les-plus-proches",
      "_blank"
    );
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={[43.304003, 5.474444]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[43.2857363, 5.3799329]}>
          <Popup>
            <div className="flex flex-col items-center">
              <img
                src="./src/assets/Mobalpa-paradis.png"
                alt="Archideco Marseille"
                className="mb-2 w-40 h-24 object-cover rounded-lg shadow-lg"
              />
              <h3 className="font-semibold text-lg mb-1">
                Archideco - Marseille
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Rue Paradis, 13006 Marseille
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyAddress}
                  className="px-3 py-1 text-white bg-green-emerald rounded-lg text-sm"
                >
                  Copier l'adresse
                </button>
                <button
                  onClick={handleOpenMaps}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Ouvrir dans Maps
                </button>
                <button
                  onClick={handleOpenRDV}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Prendre RDV
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
        <Marker position={[43.30364194803836, 5.472092558651513]}>
          <Popup>
            <div className="flex flex-col items-center">
              <img
                src="./src/assets/Mobalpa-valentine.png"
                alt="Archideco Marseille"
                className="mb-2 w-40 h-24 object-cover rounded-lg shadow-lg"
              />
              <h3 className="font-semibold text-lg mb-1">
                Archideco - Marseille
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                La valentine, 13006 Marseille
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyAddress}
                  className="px-3 py-1 text-white bg-green-emerald rounded-lg text-sm"
                >
                  Copier l'adresse
                </button>
                <button
                  onClick={handleOpenMaps}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Ouvrir dans Maps
                </button>
                <button
                  onClick={handleOpenRDV}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Prendre RDV
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
        <Marker position={[43.2774855, 5.6160392]}>
          <Popup>
            <div className="flex flex-col items-center">
              <img
                src="./src/assets/Mobalpa-magasin-aubagne.png"
                alt="Archideco Marseille"
                className="mb-2 w-40 h-24 object-cover rounded-lg shadow-lg"
              />
              <h3 className="font-semibold text-lg mb-1">
                Archideco - Aubagne
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                ZA Gémenos, 13420 Aubagne
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyAddress}
                  className="px-3 py-1 text-white bg-green-emerald rounded-lg text-sm"
                >
                  Copier l'adresse
                </button>
                <button
                  onClick={handleOpenMaps}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Ouvrir dans Maps
                </button>
                <button
                  onClick={handleOpenRDV}
                  className="px-3 py-1 text-white bg-green-duck rounded-lg text-sm"
                >
                  Prendre RDV
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponents;
