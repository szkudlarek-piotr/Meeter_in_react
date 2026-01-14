import { useEffect, useState } from "react";
import styled from 'styled-components'
import DropdownMenuForHuman from "./Multiuse/DropdownMenuForHuman";
import ControlledTextArea from "./Multiuse/ControlledTextArea";
import RadioOptionsPicker from "./Multiuse/RadioOptionsPicker";


const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    font-weight: 900;
    font-size: 30px;
    &:hover {
        background-color: red;
    }

`

export default function FrontendToAddQuote() {
    function getInitialState() {
        return ({
            humanInputValue: "",
            suggestedHumans: [],
            chosenAuthorId: "",
            chosenAuthorName: "Wybierz autora cytatu...",
            quoteValue: "",
            isPublic: "1"
        })
    }

    const [addQuoteState, setAddQuoteState] = useState(getInitialState())
    const [isAdding, setIsAdding] = useState(false)

    function setSingleProperty(propertyName, changedValue) {
        setAddQuoteState(prevState => ({
            ...prevState,
            [propertyName]: changedValue
        }))
    }

    function setChosenQuoteAuthor(humanId, humanName) {
        setAddQuoteState(prevState => ({
            ...prevState,
            "chosenAuthorId": humanId,
            "chosenAuthorName": humanName,
            "suggestedHumans": [],
            "humanInputValue": ""
        }))
    }

    function setQuotePrivacy(e) {
        setSingleProperty("isPublic", e.target.value)
    }

    useEffect(() => {
        const suggestPeople = async () => {
            const quoteAuthorReq = await fetch(`http://localhost:3000/get-humans-sorted-filtered?substring=${addQuoteState.humanInputValue}&mode=quotes&excludedIds=77`)
            //this dropdown doesn't need excluding any ids, but I don't want to create a separate function for that, therefore, I am only passign "" in excluded ids.
            const suggestedAuthorsJson = await quoteAuthorReq.json()
            setSingleProperty("suggestedHumans", suggestedAuthorsJson)
            
        }
        if (addQuoteState.humanInputValue.length > 2) {
            suggestPeople()
        }

    }, [addQuoteState.humanInputValue])

    useEffect(() =>{
        if (isAdding == false ) return;
        const addQuoteFunction = async () => {
            const addQuoteReq = await fetch(`http://localhost:3000/add-quote`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        humanId: addQuoteState.chosenAuthorId,
                        quote: addQuoteState.quoteValue,
                        isPublic: addQuoteState.isPublic
                    })
                }
            )
            const addQuoteJson = await addQuoteReq.json()
            console.log(addQuoteJson)
        }
        addQuoteFunction()
    }, [isAdding])

    return (
    <>
        <h2>Wybierz autora cytatu</h2>
        <DropdownMenuForHuman inputValue={addQuoteState.humanInputValue} placeholder={addQuoteState.chosenAuthorName} choiceOptions={addQuoteState.suggestedHumans} onInputChange={(newValue) => {setSingleProperty("humanInputValue", newValue)}} onOptionDoubleClick={setChosenQuoteAuthor}/>
        <h2>Wpisz cytat</h2>
        <ControlledTextArea fieldValue={addQuoteState.quoteValue} changeFieldValue={(newValue) => {setSingleProperty("quoteValue", newValue)}}/>
        <RadioOptionsPicker
        header="Czy cytat ma być publiczny?"
        options={[
            { value: "1", text: "Tak" },
            { value: "0", text: "Nie" }
        ]}
        chosenOptionName={addQuoteState.isPublic}
        onChangeFunction={setQuotePrivacy}

        /> <br/>
        <StyledButton type="button" onClick={() => {setIsAdding(true);}}>Dodaj cytat!</StyledButton>
    </>)
}