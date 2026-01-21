import styled from 'styled-components'
import { useState, useEffect } from 'react'
import CaptionedPhoto from './Multiuse/CaptionedPhoto.jsx'
import DropdownMenuForHuman from './Multiuse/DropdownComponents/DropdownMenuForHuman.jsx';

const QuoteFrame = styled.div`
    margin-right: 5%;
    width: 70%;
    align-items: stretch;

    display: flex;            
    align-items: center;    
    justify-content: center;  

    font-style: italic;
    font-size: 24px;
    font-family: 'Patrick Hand', cursive;
    border: 4px solid #daa520;
    border-radius: 30px;
    background: linear-gradient(145deg, #fff8dc, #fffdf5);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    text-align: center;
    line-height: 1.5;
    &::before {
        font-size: 60px;
        color: #daa520;
        font-family: Georgia, serif;
        position: relative;
        content: "“";
        margin-right: 10px;
    }
    &::after {
        font-size: 60px;
        color: #daa520;
        font-family: Georgia, serif;
        position: relative;
        content: "”";
        margin-right: 10px;
    }
`;
const GuessParamsContainer = styled.div`
    display: flex;
    align-items: stretch;

`


export default function FrontendForGuessingQuoteAuthor() {
    
    const [guessAuthorState, setGuessAuthorState] = useState({
        playerName: "Wybierz siebie z dropdownMenu",
        playerId: "",
        playerSuggestions: [],
        playerInputValue: "",

        guessedAuthorPhoto: "http://localhost:3000/human-photo/anonymous.jpg",
        guessAuthorName: "Złotousty Anonim",
        currentQuote: "Nie udało się pobrać żadnego dostępnego cytatu. Dzięki za grę!",

        excludedQuoteIds: [],
        excludedCliques: [15, 16]
    })
    

    function setSingleProp(propName, propValue) {
        setGuessAuthorState(prev => ({
            ...prev, 
            [propName]: propValue
        }))
    }

    function setPlayer(humanId, humanName) {
        setGuessAuthorState(prev => ({
            ...prev,
            "playerId": humanId,
            "playerName": humanName,
            "playerSuggestions": [],
            "playerInputValue": ""
        }))
    }

    useEffect(() => {
        const fillPlayerSuggestions = async () => {
            const playerSuggestionsReq = await fetch(`http://localhost:3000/get-human-from-substring?substring=${guessAuthorState.playerInputValue}`)
            const playerSuggestionsJson = await playerSuggestionsReq.json()
            setSingleProp("playerSuggestions", playerSuggestionsJson)
        }
        
        if (guessAuthorState.playerInputValue.length > 2) {
            fillPlayerSuggestions()
        }
        else {
            setSingleProp("playerSuggestions", [])
        }
    }, [guessAuthorState.playerInputValue])

    useEffect(() => {
        
    })



    return (
        <>
            <h2>Wybierz gracza</h2>
            <DropdownMenuForHuman inputValue={guessAuthorState.playerInputValue} choiceOptions={guessAuthorState.playerSuggestions} placeholder={guessAuthorState.playerName} onInputChange={(newVal) => setSingleProp("playerInputValue", newVal)} onOptionDoubleClick={setPlayer} />
            <GuessParamsContainer>
                <CaptionedPhoto divWidth="30" photoWidth="50" borderRadius="10" photoBorderWidthInPx="1" photoCaption={guessAuthorState.guessAuthorName} photoAdress={guessAuthorState.guessedAuthorPhoto}/>
                <QuoteFrame id="quoteFrame">{guessAuthorState.currentQuote}</QuoteFrame>
            </GuessParamsContainer>

        </>
    )
}
