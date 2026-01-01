import styled from "styled-components"
import ControlledTextInput from "./ControlledTextInput"
import HumanSelectorTileElement from "./HumanSelectorTileElement"



    const HumansTileContainer = styled.div`
        min-height: 80px;
        width: 80%;
        margin-left: 10%;
        margin-right: 10%;
        display: flex;
        flex-wrap: wrap;

    `

export default function HumansTileSelector({headerText, selectedHumansHeaderText, selectorInputValue, onInputValueChange, suggestedHumans, chosenHumans, onSuggestedTileClickFunction, tileRemoverFunction}) {

    const mappedSuggestedHumans = suggestedHumans.map((human) => (
        <HumanSelectorTileElement humanPhoto={human.photoDir} humanName={human.name} humanId={human.id} onTileClickFunction={onSuggestedTileClickFunction} key={human.id}/>
    ))
    const mappedChosenHumans = chosenHumans.map((human) => (
        <HumanSelectorTileElement tileRemovingFunction={tileRemoverFunction} humanPhoto={human.photoDir} humanName={human.name} humanId={human.id} key={human.id} />
    ))
    return (
        <>
            <h2>{headerText}</h2>
            <ControlledTextInput fieldValue={selectorInputValue} changeFieldValue={onInputValueChange} placeholderValue="Wpisz dane szukanej osoby..."/>
            <HumansTileContainer>
                {mappedSuggestedHumans}
            </HumansTileContainer>
            <h2>{selectedHumansHeaderText}</h2>
            <HumansTileContainer>
                {mappedChosenHumans}
            </HumansTileContainer>
        </> 
    )
}