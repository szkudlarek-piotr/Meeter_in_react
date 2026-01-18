import { useState, useEffect } from "react";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextInput.jsx";
import ControledTextInputWithHeader from "./Multiuse/SimpleControlledComponents/ControlledTextInputWithHeader.jsx"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styled from "styled-components";

// Fix Leaflet default icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    font-weight: 900;
    font-size: 30px;
    &:hover {
        background-color: red;
    }

`

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;



function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    }
  });
  return null;
}


export default function FrontendToAddPlace() {

  function setInitialState() {
    return ({
        placeCategoryInput: "",
        chosenCategory: "",
        placeLat: "",
        placeLon: "",
        addedPlaceName: "",

        placeCategorySuggestions: [],
        selectedPlaceCategoryValue: ""
      })
    }

  const [addPlaceState, setAddPlaceState] = useState(setInitialState())
  const [isAdding, setIsAdding] = useState(false)

  const defaultCenter = [52.228749899765276, 21.00281945835816]

    function setMapCenter(latitude, longitude) {
        setAddPlaceState(prevState => ({
            ...prevState,
            "placeLat": latitude,
            "placeLon": longitude
        }))
    }

    function setSingleProperty(propertyName, propertyValue) {
    setAddPlaceState(prevState => ({
        ...prevState,
        [propertyName]: propertyValue
    }));
    }


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter(latitude, longitude);
          console.log("Ustawiam Twoją obecną lokalizację...");
        },
        (err) => {
          console.error("Nie udało się pobrać Twojej lokalizacji. Ustawiam Dworzec Centrany w Warszawie jako Twoją pozycję.", err)
          setMapCenter([52.22881561496193, 21.003034035068655])
        }
      );
    }
    else {

    }
  }, [])

    useEffect(() =>{
        if (isAdding == false ) return;
        const addPlaceFunction = async () => {
            const addPlaceReq = await fetch(`http://localhost:3000/add-place`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: addPlaceState.addedPlaceName,
                        category: addPlaceState.placeCategoryInput,
                        lat: addPlaceState.placeLat,
                        lon: addPlaceState.placeLon
                    })
                }
            )
            const addPlaceJson = await addPlaceReq.json()
            console.log(addPlaceJson)
        }
        addPlaceFunction()
        //setAddPlaceState(setInitialState())
    }, [isAdding])

  const lat = parseFloat(addPlaceState.placeLat)
  const lng = parseFloat(addPlaceState.placeLon)

  const hasValidCoords = Number.isFinite(lat) && Number.isFinite(lng)

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dodaj miejsce</h1>

      <h2>Podaj nazwę miejsca</h2>
      <ControlledTextInput key="addedPlaceNameInput" placeholderValue="Podaj nazwę dodawanego miejsca..." fieldValue={addPlaceState.addedPlaceName} changeFieldValue={(newValue) => setSingleProperty("addedPlaceName", newValue)}/>

      <h2>Wpisz kategorie miejsca</h2>
      <ControlledTextInput key="addedPlaceCategory" placeholderValue="Podaj kategorię miejsca" fieldValue={addPlaceState.placeCategoryInput} changeFieldValue={(newValue) => setSingleProperty("placeCategoryInput", newValue)} />



      <MapContainer
        center={[addPlaceState.placeLat, addPlaceState.placeLon]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid black",
          marginTop: "30px",
          aspectRatio: 2/1
        }}
      >
        <MapClickHandler onClick={setMapCenter} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasValidCoords && (
          <Marker position={[lat, lng]}>
            <Popup>
              <b>{addPlaceState.addedPlaceName}</b><br />
              {addPlaceState.addedPlaceCategory}
            </Popup>
          </Marker>
        )}
        <ChangeView center={hasValidCoords ? [lat, lng] : defaultCenter} />


      </MapContainer>

      <h2>Współrzędne miejsca</h2>
      <div style={{width: "100%", minHeight: "200px", display: "flex", justifyContent: "space-evenly", marginTop: "40px" }}>
        <ControledTextInputWithHeader headerText="Szerokość geograficzna" fieldValue={addPlaceState.placeLat} changeFieldValueFunction={(newValue) => setSingleProperty("placeLat", newValue)}/>
        <ControledTextInputWithHeader headerText="Długość geograficzna" fieldValue={addPlaceState.placeLon} changeFieldValueFunction={(newValue) => setSingleProperty("placeLon", newValue)}/>
      </div>


      <StyledButton onClick={() => setIsAdding(true)}>Dodaj miejsce</StyledButton>
    </div>
  );
}