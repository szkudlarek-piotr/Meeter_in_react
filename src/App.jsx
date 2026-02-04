import './App.css'
import MenuElement from './assets/Components/MenuElement.jsx'
import MainContent from './assets/Components/MainContent.jsx'
import FrontendToAddClique from './assets/Components/FrontendToAddClique.jsx'
import FrontendToAddPlace from './assets/Components/FrontendToAddPlace.jsx'
import AllHumanTiles from './assets/Components/AllHumans.jsx'
import ChoiceOption from './assets/Components/ChoiceOption.jsx'
import FrontendToAddVisit from './assets/Components/FrontendToAddVisit.jsx'
import FrontendToAddMeeting from './assets/Components/FrontendToAddMeeting.jsx'
import FrontendToAddEvent from './assets/Components/FrontendToAddEvent.jsx'
import FrontendToAddQuote from './assets/Components/FrontendToAddQuote.jsx'
import FrontendToAddWedding from './assets/Components/FrontendToAddWedding2.jsx'
import FrontendForGuessingQuoteAuthor from './assets/Components/FrontendForGuessingQuoteAuthor.jsx'
import NewCalendar from './assets/Components/CalendarFunctions/NewCalendar.jsx'
import FrontendToAddHuman from './assets/Components/FrontendToAddHuman.jsx'
import { useState } from 'react'

import { leftMenuOptions } from './assets/data/lefttMenuOptions.js'
function App() {

  const [ meeterPage, setMeeterPage ] = useState("news")

  let mainContent;
  switch (meeterPage) {
    case "news":
      mainContent = "Tu będą newsy";
      break;
    case "allHumans":
      mainContent = <AllHumanTiles />
      break;
    case "calendar":
      mainContent = <NewCalendar year="2026"/>
      break;
    case "allCliques":
      mainContent = "Tu będą kliki";
      break;
    case "dancingVideos":
      mainContent = "Tu będą filmiki taneczne";
      break;
    case "addHuman":
      mainContent = <FrontendToAddHuman/>
      break;
    case "addVisit":
      mainContent = <FrontendToAddVisit/>
      break;
    case "addMeeting":
      //mainContent = "Tu będzie dodawanie spotkania";
      mainContent = <FrontendToAddMeeting/>
      break;
    case "addClique":
      mainContent = <FrontendToAddClique/>
      break;
    case "addEvent":
      mainContent = <FrontendToAddEvent/>
      break;
    case "addPlace":
      mainContent = <FrontendToAddPlace/>
      break;
    case "addQuote":
      mainContent = <FrontendToAddQuote/>
      break;
    case "addWedding":
      mainContent = <FrontendToAddWedding />
      break;
    case "addDancingVideo":
      mainContent = "Tu będzie dodawanie filmikó tanecznych.";
      break;
    case "guessQuoteAuthors":
      mainContent = <FrontendForGuessingQuoteAuthor/>
      break;
  }


  return (
    <>
      <MenuElement width="20%" withHeader={true}>
        {leftMenuOptions.map(
          (option) => 
        <ChoiceOption id={option.id} key={option.id} onClick={() => setMeeterPage(option.state)}>
          {option.text}
        </ChoiceOption>
        )}
      </MenuElement>

      <MainContent width="60%">
        {mainContent}
      </MainContent>
      <MenuElement width="20%" withHeader={false}/>
    </>
  )
}

export default App
