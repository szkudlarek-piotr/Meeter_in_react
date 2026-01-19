import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { placesCategoriesDict } from "../PlacesCategoriesDict";
import { useEffect, useState } from "react";
import styled from "styled-components";



    const placeIcons = Object.fromEntries(
    Object.entries(placesCategoriesDict).map(([category, file]) => [
        category,
        L.icon({
        iconUrl: `http://localhost:3000/map-icons/${file}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: category === "Dream direction" ? "unicorn-icon" : "", // <- tu CSS dla "Dream direction"
        }),
    ])
    )

const StyledTextContainer = styled.div`
  font-size: 24px;
  font-family: cursive;
  padding: 0 5%;
  overflow-y: auto;       
  flex: 1;               
  display: flex;
  flex-direction: column;
  align-items: center;      
`


function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.invalidateSize();
  }, [map]);
  return null;
}


function FitMapToMarkers({ places }) {
  const map = useMap();

  useEffect(() => {
    if (!map || places.length === 0) return;

    const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [20, 20] }); // padding = margines w px
  }, [map, places]);

  return null;
}

const getIconSafe = (category) => placeIcons[category] || L.Icon.Default.prototype

export default function InteractionsMap({humanId}) {

    const [placesData, setPlacesData] = useState([])


      useEffect(() => {
    
      const getVisitsData = async () => {
        const fetchResult = await fetch(
          `http://localhost:3000/human-places?humanId=${humanId}`
        )
        const placesJson = await fetchResult.json()
        setPlacesData(placesJson)
      }
    
      getVisitsData()
    }, [])
    
    let mappedPlaces = placesData.map((place) => 
    <Marker position={[place.lat, place.lng]} key={place.place_name} icon={getIconSafe(place.category)}>
        <Popup>
            <b>{place.place_name}</b><br/>
            {place.category}
        </Popup>
    </Marker>)




    return (
        <StyledTextContainer>
            <h2>Mapa interakcji</h2>
                <MapContainer
                    center={[52.23, 21.01]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{
                      width: "80%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      border: "1px solid black",
                      marginTop: "30px",
                      aspectRatio: 2 / 1,
                      marginBottom: "20px"
                    }}
                  >
                    <InvalidateMapSize />
    
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {placesData.length > 0 ? mappedPlaces : <p>Brak miejsc do wyświetlenia</p>}
                    <FitMapToMarkers places={placesData} />
                </MapContainer>
        </StyledTextContainer>
    )
}