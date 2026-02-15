import styled from 'styled-components'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from 'react';
import { placesCategoriesDict } from "../PlacesCategoriesDict";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SingleTripCompanionTile from './SingleTripCompanionTile';


const SingleTripElement = styled.div`
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
    &>h4 {
        margin-bottom: 5px;
    }
`

const PhotosContainer = styled.div`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    min-height: 150px;
    overflow-x: scroll;
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    justify-content: space-evenly;

`
const SinglePhoto = styled.img`
    height: 100px;
    border-radius: 10px;
    border:1px solid black;
`

const MapWrapper = styled.div`
  width: 80%;
  margin: 30px auto 20px;
  border: 1px solid black;
  height: 350px;   /* ALBO 40vh */
`;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
`;


const getIconSafe = (category) => placeIcons[category] || L.Icon.Default.prototype


const placeIcons = Object.fromEntries(
Object.entries(placesCategoriesDict).map(([category, file]) => [
    category,
    L.icon({
        iconUrl: `http://localhost:3000/map-icons/${file}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: category === "Dream direction" ? "unicorn-icon" : "",
    }),
])
)


function FitMapToMarkers({ places }) {
  const map = useMap();

  useEffect(() => {
    if (!map || places.length === 0) return;

    const bounds = L.latLngBounds(places[0].map(p => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [20, 20] }); // padding = margines w px
  }, [map, places]);

  return null;
}

export default function SingleTripInHumanModal({dateStart, dateStop, photosArr, shortDesc, places, companion}) {
    
    const mappedPhotos = photosArr.map((photo) => (
        <SinglePhoto src={photo} key={photo}/>
    ))
    
    let mappedPlaces = places[0].map((place) => 
    <Marker position={[place.latitude, place.longitude]} key={place.place_name} icon={getIconSafe(place.category)}>
        <Popup>
            <b>{place.place_name}</b><br/>
            {place.category}
        </Popup>
    </Marker>)


    function FixMapResize() {
        const map = useMap();
        
        useEffect(() => {
            const timer = setTimeout(() => {
                map.invalidateSize();
            }, 200);
            
            return () => clearTimeout(timer);
        }, [map]);
        
        return null;
    }

    const mappedCompanion = companion.map((human) => (
        <SingleTripCompanionTile photoUrl={human.photo} name={human.name} />
    ))

    return (
        <SingleTripElement>
            <h4>{shortDesc}</h4>
            {(dateStart === dateStop) ? (<h4>{dateStart}</h4>) : (<h4>{dateStart} - {dateStop}</h4>)}

            {mappedCompanion.length > 0 && (
                <>
                    <h6>Towarzysze podrózy</h6>
                    <div style={{display: "flex", justifyContent: "space-evenly", gap: "15px"}}>
                        {mappedCompanion}
                    </div>
                    
                </>
            )}

            <MapWrapper>
                <StyledMapContainer
                    center={[52.23, 21.01]}
                    zoom={13}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mappedPlaces}
                    <FixMapResize />
                    <FitMapToMarkers places={places} />
                </StyledMapContainer>
                
            </MapWrapper>
            
                {mappedPhotos.length > 0 && (
                    <>
                        <h6>Zdjęcia</h6>
                        <PhotosContainer>
                            {mappedPhotos}
                        </PhotosContainer>
                    </>)}
            

        </SingleTripElement>
    )
}