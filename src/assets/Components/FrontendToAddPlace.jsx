import { useState, useEffect, useRef, forwardRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Corrected SimpleTextInput with forwardRef
const SimpleTextInput = forwardRef(({ placeholder, id }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      id={id}
      style={{ padding: "8px", width: "300px", fontSize: "14px" }}
    />
  );
});

SimpleTextInput.displayName = "SimpleTextInput";

// Komponent do przesuwania mapy przy zmianie pozycji
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function FrontendToAddPlace() {
  const [position, setPosition] = useState([52.215081941485224, 21.035777301514607]);
  const inputRef = useRef(null);

  // Pobranie geolokalizacji użytkownika
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          console.log("Ustawiam Twoją obecną lokalizację...");
        },
        (err) => console.error("Błąd geolokalizacji:", err)
      );
    }
  }, []);

  // Funkcja wywoływana po kliknięciu przycisku
  const handleAddPlace = () => {
    const placeName = inputRef.current?.value || "Brak nazwy";
    console.log("Dodaję miejsce:", placeName, "współrzędne:", position);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Dodaj miejsce</h3>

      <div style={{ marginBottom: "20px" }}>
        <SimpleTextInput ref={inputRef} placeholder="Nazwa miejsca" id="placeNameInput" />
      </div>

      <button onClick={handleAddPlace} style={{ marginBottom: "20px", padding: "8px 16px" }}>
        Dodaj miejsce
      </button>

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "400px",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid black",
        }}
      >
        <ChangeView center={position} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            Twoja lokalizacja <br /> Możesz ją przesunąć.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}