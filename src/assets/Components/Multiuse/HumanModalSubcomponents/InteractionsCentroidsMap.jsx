import styled from 'styled-components'
import "leaflet/dist/leaflet.css";
import L, { icon } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import ControlledNumberInput from '../SimpleControlledComponents/ControlledNumberInput.jsx'
import { useDebounce } from '../Debounce.jsx';


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

export default function InteractionsCentroidsMap({humanId}) {
    const [centroidsData, setCentroidsData] = useState(
        {
            "centroids": [],
            "minDistance": 100
        })
    
    const debouncedMinDistance = useDebounce(centroidsData.minDistance, 500);     

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
        const bounds = L.latLngBounds(places.map(p => [p[0], p[1]]));
        map.fitBounds(bounds, { padding: [20, 20] }); // padding = margines w px
      }, [map, places]);
      return null;
    }

    function setSingleProperty(propertyName, propertyValue) {
    setCentroidsData(prevState => ({
        ...prevState,
        [propertyName]: propertyValue
    }));
    }

    


    useEffect(() => {
    const getCentroidsData = async () => {
        setSingleProperty("centroids", []);
        console.log(`minDist: ${centroidsData.minDistance}`)
        const fetchResult = await fetch(
        `http://localhost:3000/human-interactions-centroids?humanId=${humanId}&minDistance=${debouncedMinDistance}`
        );
        const centroidsJson = await fetchResult.json();
        setSingleProperty("centroids", centroidsJson);
    }

    if (!isNaN(debouncedMinDistance)) getCentroidsData();
    }, [debouncedMinDistance]);

    const mappedCentroids = centroidsData.centroids.map((centroid, index) => 
      <Marker position={[centroid[0], centroid[1]]} key={`centroid_${index}`} 
      icon={new L.Icon(
        {
          iconUrl: `http://localhost:3000/map-icons/centroid.png`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        }
      )} >
        <Popup>
          <b>Centroid</b>
        </Popup>
      </Marker>
    )

    return (
        <>
            <StyledTextContainer>
                <h2>Mapa interakcji</h2>

                {centroidsData.centroids.length == 0 && <h3>Wyliczanie centroidów interakcji...</h3>}
                <h3>Minimalna odległość między centroidami</h3>
                <ControlledNumberInput value={centroidsData.minDistance} onchangeFunction={(newValue) => setSingleProperty("minDistance", Number(newValue))}/>
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
                        {mappedCentroids.length > 0 ? 
                        <>
                        {mappedCentroids}
                        </> : <p>Brak miejsc do wyświetlenia</p>}
                        <FitMapToMarkers places={centroidsData.centroids} />
                    </MapContainer>
            
            </StyledTextContainer>
        </>
    )

}

