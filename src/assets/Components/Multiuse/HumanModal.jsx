import { createPortal } from "react-dom";
import styled from "styled-components";
import ChoiceOption from "../ChoiceOption"
import { useEffect, useState } from "react";
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
`
const SuperpowersContainer = styled.div`
  display: flex;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;

`

const SuperpowerIcon = styled.div`
  width: 100px;
  height: 100px;
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
  margin-left: 10%;
  margin-right: 10%;
  overflow-y: scroll;
  min-height: 180px;
`

export default function HumanModal({ isDisplayed, onClose, humanId}) {
  if (!isDisplayed) return null;

  const [modalMode, setModalMode] = useState("basicData")
  const [modalData, setModalData] = useState({
    superpowers: []
  })

  let mappedSuperpowers = null
  if (modalData.superpowers.length > 0) {
    mappedSuperpowers = modalData.superpowers.map((superpower) => <SuperpowerIcon img={superpower.photo} title={superpower.name}/>)
  }

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

              </StyledTextContainer>
            
            )
            case "visitsData":
            return (<h1>Wizyty</h1>)
            case "meetingsData":
            return (<h1>Spotkania</h1>)
            case "eventsData":
            return (<h1>Wydarzenia</h1>)
            case "quotesData":
            return (<h1>Cytaty</h1>)
            case "relatiogram":
            return (<h1>Relacjogram</h1>)
            case "interactionsMap":
            return (<h1>Mapa interakcji</h1>)
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
            <ChoiceOption key="humanModalQuotes" onClick={() => setModalMode("quotesData")}>Cytaty</ChoiceOption>
            <ChoiceOption key="relatiogram" onClick={() => setModalMode("relatiogram")}>Relacjogram</ChoiceOption>
            <ChoiceOption key="interactionsMap" onClick={() => setModalMode("interactionsMap")}>Mapa interakcji</ChoiceOption>
        </MenuBox>
        <ContentBox>
            {renderContent()}
        </ContentBox>
      </ModalBox>
    </Backdrop>,
    document.getElementById("modal-root")
  );
}
