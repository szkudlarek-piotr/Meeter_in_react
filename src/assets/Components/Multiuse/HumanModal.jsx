import { createPortal } from "react-dom";
import styled from "styled-components";
import ChoiceOption from "../ChoiceOption"
import sanitizeHtml from 'sanitize-html'
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import InterationComponent from "./InteractionsComponent.jsx";
import { placesCategoriesDict } from './PlacesCategoriesDict.js'
import InteractionsMap from "./HumanModalSubcomponents/InteractionsMap.jsx";
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: fixed;
  inset: 5%;
  background: beige;
  border: 1px solid black;
  padding: 16px;
  border-radius: 30px;
  display: flex;
  height: 90%;           /* wysokość całego modala */
  box-sizing: border-box;
`
const SuperpowersContainer = styled.div`
  display: flex;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
  margin-bottom: 0px;
  justify-content: space-evenly;

`

const SuperpowerIcon = styled.img`
  width: 70px;
  height: 70px;
  margin-left: 15px;
  margin-right: 15px;
`
const MenuBox = styled.div`
    height: 100%;
    width: 20%;
    border-right: 1px solid black;
    text-align: center;
    display: flex;
    flex-direction: column;
`
const ContentBox = styled.div`
    height: 100%;
    width: 80%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    overflow-y: hidden;
`

const HumanPhotoInModal = styled.img`
  width: 20%;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid black;
`

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

const StyledTable = styled.table`
  border-collapse: collapse;
  border: 3px solid black;   /* gruba obwódka */
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 30px;
`

const StyledTableHeader = styled.th`
  border: 1px solid black;
  min-width: 250px;
`

const StyledTableRow = styled.tr`
  font: Arial;
`

const StyledTableCell = styled.td`
  border: 1px solid black;
  padding: 8px 14px;
`

const StyledQuoteInQuotesList = styled.blockquote`
  margin: 22px 12%;
  padding: 6px 0;
  width: 90%

  font-family: "Cormorant Garamond", serif;
  font-size: 26px;
  font-style: italic;
  line-height: 1.7;

  color: #3b2f2f;
  text-align: center;
  text-shadow: 0.4px 0.4px 0.8px rgba(0,0,0,0.15);
  border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
`
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

export default function HumanModal({ isDisplayed, onClose, humanId}) {
  if (!isDisplayed) return null;

  const [modalMode, setModalMode] = useState("basicData")
  const [modalData, setModalData] = useState({
    superpowers: [],
    interactionPlacesCategories: []
  })
  const [quotes, setQuotes] = useState([])
  const [placesData, setPlacesData] = useState([])
  const [visitsData, setVisitsData] = useState([])
  const [meetingsData, setMeetingsData] = useState([])
  const [eventsData, setEventsData] = useState([])

  let mappedSuperpowers = null
  if (modalData.superpowers.length > 0) {
    mappedSuperpowers = modalData.superpowers.map((superpower) => <SuperpowerIcon src={superpower.photo} title={superpower.name}/>)
  }

  let mappedPlaceCategories = null
  if (modalData.interactionPlacesCategories.length > 0) {
    mappedPlaceCategories = modalData.interactionPlacesCategories.map((row) => <StyledTableRow><StyledTableCell>{row.category}</StyledTableCell><StyledTableCell>{row.category_count}</StyledTableCell></StyledTableRow>)
  }

  
let mappedQuotes = quotes.map((quote) => (
  <StyledQuoteInQuotesList
    dangerouslySetInnerHTML={{
      __html: `"${sanitizeHtml(quote.quote)}"`,
    }}
  />
))

let mappedVisits = visitsData.map((visit) => (
  <InterationComponent
    key={visit.id}
    shortDesc={visit.shortDesc}
    date={visit.date}
    longDesc={visit.longDesc}
  />
))

let mappedMeetings = meetingsData.map((meeting) => (
  <InterationComponent
    key={meeting.id}
    shortDesc={meeting.title}
    date={meeting.date}
    longDesc={meeting.longDesc}
  />
))


let mappedEvents = eventsData.map((singleEvent) => (
  <InterationComponent
    key={singleEvent.id}
    shortDesc={singleEvent.name}
    date={singleEvent.date}
    place={singleEvent.place}
    longDesc={singleEvent.longDesc}
  />
))

  useEffect(()=> {
    const getBasicHumanInfo = async () => {
      const fetchResult = await fetch(`http://localhost:3000/basic-human-info?humanId=${humanId}`)
      const humanDataJson = await fetchResult.json()
      console.log(humanDataJson)
      setModalData(humanDataJson)
    }
    if (modalMode == "basicData") {
      getBasicHumanInfo()
    }

  },[modalMode, humanId])

  useEffect(() => {
    if (modalMode !== "quotesData") return

    const getHumanQuotes = async () => {
      const fetchResult = await fetch(
        `http://localhost:3000/get-human-quotes?humanId=${humanId}`
      )
      const quotesJson = await fetchResult.json()
      setQuotes(quotesJson)
    }

    getHumanQuotes()
  }, [modalMode, humanId])



  useEffect(() => {
  if (modalMode !== "visitsData") return

  const getVisitsData = async () => {
    const fetchResult = await fetch(
      `http://localhost:3000/human-visits?humanId=${humanId}&years=5`
    )
    const visitsJson = await fetchResult.json()
    console.log(visitsJson)
    setVisitsData(visitsJson)
  }

  getVisitsData()
}, [modalMode, humanId])




  useEffect(() => {
  if (modalMode !== "meetingsData") return

  const getVisitsData = async () => {
    const fetchResult = await fetch(
      `http://localhost:3000/human-meetings?humanId=${humanId}&years=5`
    )
    const meetingsJson = await fetchResult.json()
    setMeetingsData(meetingsJson)
  }

  getVisitsData()
}, [modalMode, humanId])



  useEffect(() => {
  if (modalMode !== "eventsData") return

  const getEventsData = async () => {
    const fetchResult = await fetch(
      `http://localhost:3000/human-events?humanId=${humanId}&years=5`
    )
    const eventsJson = await fetchResult.json()
    setEventsData(eventsJson)
  }

  getEventsData()
}, [modalMode, humanId])


  function renderContent() {
        switch (modalMode) {
            case "basicData":
            return (
              <StyledTextContainer>
                <h1>Podstawowe dane</h1>
                <HumanPhotoInModal src={modalData.photoDir}/>
                <SuperpowersContainer className="superpowersContainer">
                  {mappedSuperpowers}
                </SuperpowersContainer>
                <h2>{modalData.fullName}</h2>
                Liczba wizyt: {modalData.visitsCount} <br/>
                Liczba spotkań: {modalData.meetingsCount} <br/>
                Liczba cytatów: {modalData.quotesCount} <br/>
                {modalData.lastSeen}
                <h2>Gdzie się widujecie poza tripami?</h2>
                <StyledTable>
                  <tr>
                    <StyledTableHeader>Kategoria miejsca</StyledTableHeader>
                    <StyledTableHeader>Liczba spotkań</StyledTableHeader>
                  </tr>
                  {mappedPlaceCategories}

                </StyledTable>

              </StyledTextContainer>
            
            )
            case "visitsData":
            return (
            <StyledTextContainer>
              <h1>Wizyty</h1>
              {mappedVisits}
            </StyledTextContainer>

            )
            case "meetingsData":
            return (
              <StyledTextContainer>
                <h1>Spotkania</h1>
                {mappedMeetings}
              </StyledTextContainer>)
            case "eventsData":
            return (
            
              <StyledTextContainer>
                <h1>Wydarzenia</h1>
                {mappedEvents}
              </StyledTextContainer>
            )
            case "tripsData":
            return (
            
              <StyledTextContainer>
                <h1>Podróże</h1>
                {}
              </StyledTextContainer>
            )
            case "quotesData":
              return (
                <StyledTextContainer>
                  <h1>Cytaty</h1> 
                  {mappedQuotes}
                </StyledTextContainer>

              )
            case "relatiogram":
            return (<h1>Relacjogram</h1>)
            case "interactionsMap2":
              return <InteractionsMap humanId={humanId}/>
        }
    }

  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <MenuBox>
            <h2>Menu</h2>
            <ChoiceOption key="basicHumanModalData" onClick={() => setModalMode("basicData")}>Podstawowe dane</ChoiceOption>
            <ChoiceOption key="humanModalVisits" onClick={() => setModalMode("visitsData")}>Wizyty</ChoiceOption>
            <ChoiceOption key="humanModalMeetings" onClick={() => setModalMode("meetingsData")}>Spotkania</ChoiceOption>
            <ChoiceOption key="humanModalEvents" onClick={() => setModalMode("eventsData")}>Wydarzenia</ChoiceOption>
            <ChoiceOption key="humanModalTrips" onClick={() => setModalMode("tripsData")}>Podróże</ChoiceOption>
            <ChoiceOption key="humanModalQuotes" onClick={() => setModalMode("quotesData")}>Cytaty</ChoiceOption>
            <ChoiceOption key="relatiogram" onClick={() => setModalMode("relatiogram")}>Relacjogram</ChoiceOption>
            <ChoiceOption key="interactionsMap2" onClick={() => setModalMode("interactionsMap2")}>Mapa interakcji</ChoiceOption>
        </MenuBox>
        <ContentBox>
            {renderContent()}
        </ContentBox>
      </ModalBox>
    </Backdrop>,
    document.getElementById("modal-root")
  );
}
