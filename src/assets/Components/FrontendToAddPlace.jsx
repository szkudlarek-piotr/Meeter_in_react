import { useState, useEffect, useRef } from "react";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextInput.jsx";
import ControledTextInputWithHeader from "./Multiuse/SimpleControlledComponents/ControlledTextInputWithHeader.jsx"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styled from "styled-components";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import InsertResultModal from "./Multiuse/InsertResultModal.jsx";
import DropdownMenuForText from "./Multiuse/DropdownComponents/DropdownMenuForText.jsx";

const DECAY_TIME = 5000

const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    margin-bottom: 40px;
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

  const defaultCenter = [52.228749899765276, 21.00281945835816]

  function setInitialState() {
    return ({
        addedPlaceName: "",
        placeCategoryInput: "",

        placeLat: defaultCenter[0],
        placeLon: defaultCenter[1],

        placeCategorySuggestions: []
      })
    }

  const [addPlaceState, setAddPlaceState] = useState(setInitialState())
  const dropdownRef = useRef(null)


  function setMapCenter(latitude, longitude) {
      setAddPlaceState(prevState => ({
          ...prevState,
          "placeLat": String(latitude),
          "placeLon": String(longitude)
      }))
  }

    function setSingleProperty(propertyName, propertyValue) {
    setAddPlaceState(prevState => ({
        ...prevState,
        [propertyName]: propertyValue
    }));
    }
  
  function setPlaceCategory(placeCategory) {
    setAddPlaceState(prevState => ({
      ...prevState,
      "placeCategorySuggestions": [],
      "placeCategoryInput": placeCategory
    }))
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
          //defaultCenter([52.22881561496193, 21.003034035068655])
        }
      );
    }
    else {
      console.log("Nie wyrażono zgody na udostępnienie lokalizacji.")
    }
  }, [])

  useEffect(() => {
    const getPlaceCategories = async () => {
      if (addPlaceState.placeCategoryInput.length > 2) {
        const placeCategoriesReq = await fetch(`http://localhost:3000/place-categories?substring=${addPlaceState.placeCategoryInput}`)
        const categoriesJson = await placeCategoriesReq.json()
        setSingleProperty("placeCategorySuggestions", categoriesJson)
      }
    }
    getPlaceCategories()
  }, [addPlaceState.placeCategoryInput])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSingleProperty("placeCategorySuggestions", []);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const addPlace = async () => {
    const postReq = await fetch(
      "http://localhost:3000/add-place",
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
    if (postReq.ok) {
      setAddPlaceState(setInitialState())
    }
            
  }


  const hasValidCoords = Number.isFinite(Number(addPlaceState.placeLat)) && Number.isFinite(Number(addPlaceState.placeLon))

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dodaj miejsce</h1>

      <h2>Podaj nazwę miejsca</h2>
      <ControlledTextInput key="addedPlaceNameInput" placeholderValue="Podaj nazwę dodawanego miejsca..." fieldValue={addPlaceState.addedPlaceName} changeFieldValue={(newValue) => setSingleProperty("addedPlaceName", newValue)}/>


      <h2>Wybór kategorii miejsca</h2>
      <div ref={dropdownRef}>
        <DropdownMenuForText choiceOptions={addPlaceState.placeCategorySuggestions} onInputChange={(newValue) => setSingleProperty("placeCategoryInput", newValue)} onOptionDoubleClick={setPlaceCategory} inputValue={addPlaceState.placeCategoryInput}/>
      </div>



      <MapContainer
        center={[Number(addPlaceState.placeLat), Number(addPlaceState.placeLon)]}
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
          <Marker
            key={`${addPlaceState.placeLat}-${addPlaceState.placeLon}`}
            position={[Number(addPlaceState.placeLat), Number(addPlaceState.placeLon)]}
          >
            <Popup>
              <b>{addPlaceState.addedPlaceName}</b><br />
              {addPlaceState.placeCategoryInput}
            </Popup>
          </Marker>
        )}
        <ChangeView center={hasValidCoords ? [Number(addPlaceState.placeLat), Number(addPlaceState.placeLon)] : defaultCenter} />


      </MapContainer>

      <h2>Współrzędne miejsca</h2>
      <div style={{width: "100%", minHeight: "200px", display: "flex", justifyContent: "space-evenly", marginTop: "40px" }}>
        <ControledTextInputWithHeader headerText="Szerokość geograficzna" fieldValue={addPlaceState.placeLat} changeFieldValueFunction={(newValue) => setSingleProperty("placeLat", newValue)}/>
        
        <ControledTextInputWithHeader headerText="Długość geograficzna" fieldValue={addPlaceState.placeLon} changeFieldValueFunction={(newValue) => setSingleProperty("placeLon", newValue)}/>
        

      </div>


      <StyledButton onClick={() => addPlace()}>Dodaj miejsce</StyledButton>

    </div>
  );
}