import { useState } from "react";
import styled from "styled-components";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextINput.jsx";
import RadioOptionsPicker from "./Multiuse/RadioOptionsPicker.jsx";

export default function FrontendToAddHuman() {
    const [addHumanState, setAddHumanState] = useState({
        name: "",
        surname: "",
        gender: "M",
        cliqueInput: "",
        cliquesSuggestions: [],
        chosenCliqueId: "",
        photoLink: ""
    })
    

    function setSingleValue(propName, propValue) {
        setAddHumanState(prev => ({
            ...prev,
            [propName]: propValue
        })
        )
    }

    function setGender(e) {
        setSingleValue("gender", e.target.value)
    }

    return (
        <>
            <h3>Imię</h3>
            <ControlledTextInput fieldValue={addHumanState.name} changeFieldValue={(value) => setAddHumanState("name", value)} placeholderValue="Podaj imię..."/>     
            <h3>Nazwisko</h3>
            <ControlledTextInput fieldValue={addHumanState.surname} changeFieldValue={(value) => setAddHumanState("surname", value)} placeholderValue="Podaj nazwisko..."/>  
            <RadioOptionsPicker options={[{"text": "Mężczyzna", "value": "M"}, {"text": "Kobieta", "value": "F"}]} header="Płeć" chosenOptionName={addHumanState.gender} onChangeFunction={setGender}/>       
        </>
    )
}