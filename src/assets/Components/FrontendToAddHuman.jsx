import { useEffect, useState } from "react";
import styled from "styled-components";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextINput.jsx";
import RadioOptionsPicker from "./Multiuse/RadioOptionsPicker.jsx";
import DropdownMenuForClique from './Multiuse/DropdownComponents/DropdownMenuForClique.jsx'

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


export default function FrontendToAddHuman() {
    function getInitialAddHumanState() {
        return {
            name: "",
            surname: "",
            gender: "M",
            cliqueInput: "",
            cliquesSuggestions: [],
            chosenCliqueId: null,
            cliqueName: "",
            livesWhere: "",
            photoLink: "",
            fbLink: ""
        }
    }
    const [addHumanState, setAddHumanState] = useState(getInitialAddHumanState())
    
    useEffect(() => {

        const getSuggestedCliques = async () => {
            try {
                const cliquesReq = await fetch(`http://localhost:3000/cliques-from-substring?substring=${addHumanState.cliqueInput}`)
                const cliquesJson = await cliquesReq.json()
                console.log(cliquesJson)
                setSingleValue("cliquesSuggestions", cliquesJson)
            }
            catch (error) {
                console.log(error)
            }

        } 

        if (addHumanState.cliqueInput.length < 3) {
            setSingleValue("cliquesSuggestions", [])
        }
        else {
            getSuggestedCliques()
        }
    }, [addHumanState.cliqueInput])

    function setSingleValue(propName, propValue) {
        setAddHumanState(prev => ({
            ...prev,
            [propName]: propValue
        })
        )
    }

    function setClique(cliqueName, cliqueId) {
        setAddHumanState(prev => ({
            ...prev,
            "chosenCliqueId": cliqueId,
            "cliqueName": cliqueName,
            "cliquesSuggestions": [],
            "cliqueInput": ""
        }))
    }

    const sendDetailsHumanToDb = async () => {
        try {
            const addHumanReq = await fetch(
                "http://localhost:3000/add-human",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: addHumanState.name,
                        surname: addHumanState.surname, 
                        gender: addHumanState.gender, 
                        livesWhere: addHumanState.livesWhere,
                        cliqueId: addHumanState.chosenCliqueId,
                        fbLink: addHumanState.fbLink,
                        photoLink: addHumanState.photoLink
                    })
                }
            )
            const addHumanJson = await addHumanReq.json()
            console.log(addHumanJson)
            setAddHumanState(getInitialAddHumanState())
        }
        catch (error) {
            console.log(error)
        }
    }

    const addHuman = async () => {
        if (addHumanState.name == "" || addHumanState.surname == "" || addHumanState.chosenCliqueId == null) {
            alert("Podane dane zostały uznane za niewystarczające.")
            console.log(addHumanState)
        }
        else {
            await sendDetailsHumanToDb()
        }
    }

    function setGender(e) {
        setSingleValue("gender", e.target.value)
    }

    return (
        <>
            <h3>Imię</h3>
            <ControlledTextInput fieldValue={addHumanState.name} changeFieldValue={(value) => setSingleValue("name", value)} placeholderValue="Podaj imię..."/>     
            
            <h3>Nazwisko</h3>
            <ControlledTextInput fieldValue={addHumanState.surname} changeFieldValue={(value) => setSingleValue("surname", value)} placeholderValue="Podaj nazwisko..."/>  


            <h3>Mieszka w</h3>
            <ControlledTextInput fieldValue={addHumanState.livesWhere} changeFieldValue={(value) => setSingleValue("livesWhere", value)} placeholderValue="Podaj miejsce zamieszkania osoby..." />  

            <h3>Klika</h3>
            <DropdownMenuForClique inputValue={addHumanState.cliqueInput} choiceOptions={addHumanState.cliquesSuggestions} placeholder={addHumanState.cliqueName} onInputChange={(newValue) => setSingleValue("cliqueInput", newValue)} onOptionDoubleClick={setClique} />
            
            <h3>Link do Facebooka</h3>
            <ControlledTextInput fieldValue={addHumanState.facebookLink} changeFieldValue={(value) => setSingleValue("facebookLink", value)}/>
            
            <h3>Link do zdjęcia</h3>
            <ControlledTextInput fieldValue={addHumanState.photoLink} changeFieldValue={(value) => setSingleValue("photoLink", value)} placeholderValue="Podaj link do zdjęcia" />               
            
            <RadioOptionsPicker options={[{"text": "Mężczyzna", "value": "M"}, {"text": "Kobieta", "value": "F"}]} header="Płeć" chosenOptionName={addHumanState.gender} onChangeFunction={setGender}/>


            <StyledButton onClick={()=> addHuman()}>Dodaj człowieka</StyledButton>
        </>
    )
}