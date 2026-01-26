import React, { useEffect } from "react";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextInput.jsx";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import DatePickerWithClock from "./Multiuse/SimpleControlledComponents/DatePickerWithClock.jsx";
import ControlledTextArea from "./Multiuse/SimpleControlledComponents/ControlledTextArea.jsx";
import HumansTileSelector from "./Multiuse/HumansTileSelector";
import DropdownMenuForPlace from "./Multiuse/DropdownComponents/DropdownMenuForPlace2.jsx";
import RadioOptionsPicker from "./Multiuse/RadioOptionsPicker.jsx";
import PhotoSelector from "./Multiuse/PhotoSelector.jsx";
import { Pool } from "@mui/icons-material";

const StyledButton = styled.button`
    width: 50%;
    background-color: white;
    margin-bottom: 40px;
    border: 2px solid black;
    font-weight: 900;
    font-size: 30px;
    &:hover {
        background-color: red;
    }

`
const DivWithMargins = styled.div`
    margin-top: 10px;
    margin-bottom: 30px;
`



export default function FrontendToAddEvent() {
    function setInitialState() {
        return {
            eventName: "",
            startDate: dayjs(),
            stopDate: dayjs(),
            comingDate: dayjs(),
            leavingDate: dayjs(),
            longDesc: "",
            placeText: "",
            placeSelectorInput: "",
            chosenPlaceName: "",
            chosenPlaceId: "",
            placesSuggestions: [],
            humanSelectorInputValue: "",
            suggestedHumans: [],
            chosenHumans: [],

            chosenPhotoAddingOption: "database",
            chosenEventPhotoAddress: "http://localhost:3000/human-photo/anonymous.jpg",
            chosenPhotoFileName: "anonymous.jpg",
            chosenPhotoName: "anonymous",
            chosenPhotoLink: "",
            photoSelectorValue: "",
            suggestedPhotos: []
        }
    }



    const [addEventState, setAddEventState] = useState(setInitialState())
    const [isAdding, setIsAdding] = useState(false)

    function setSingleProperty(propName, newValue) {
        setAddEventState(prevState => ({
            ...prevState,
            [propName]: newValue
        }))
    }

    useEffect(() => {
        if (addEventState.startDate > addEventState.stopDate || addEventState.stopDate == dayjs()) {
            setSingleProperty("stopDate", addEventState.startDate)
        }
    }, [addEventState.startDate])


    useEffect(() => {
        if (addEventState.comingDate > addEventState.leavingDate || addEventState.leavingDate == dayjs()) {
            setSingleProperty("leavingDate", addEventState.comingDate)
        }
    }, [addEventState.comingDate])


    useEffect(() => {
        const excludedIds = addEventState.chosenHumans.map((human) => (human.id)).join(',')
        if (addEventState.humanSelectorInputValue.length > 2) {
            fetch(`http://localhost:3000/get-humans-sorted-filtered?substring=${addEventState.humanSelectorInputValue}&mode=events&excludedIds=${excludedIds}`).then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych o ludziach.")
                }
                return response.json()

            })
            .then(data => {
                setSingleProperty("suggestedHumans", data)
            })
        }
    }, [addEventState.humanSelectorInputValue])    

    useEffect(() => {
        const populatePlacesOptions = async () => {
            if (addEventState.placeSelectorInput.length > 2) {
                const placeReq = await fetch(`http://localhost:3000/get-places-from-substring?placeInput=${addEventState.placeSelectorInput}`)
                const placesJson = await placeReq.json()
                setSingleProperty("placesSuggestions", placesJson)
            } else {
                setSingleProperty("placesSuggestions", [])
            }
        }
        populatePlacesOptions()
    }, [addEventState.placeSelectorInput])

    useEffect(() => {
        if (!isAdding) return;
        const addEventWithPeople = async () => {
            const addEventReq = await fetch(`http://localhost:3000/add-event`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                     body: JSON.stringify({
                        name: addEventState.eventName,
                        startDate:addEventState.startDate.format("YYYY-MM-DD HH:mm:ss"),
                        stopDate: addEventState.stopDate.format("YYYY-MM-DD HH:mm:ss"),
                        comingDate: addEventState.comingDate.format("YYYY-MM-DD HH:mm:ss"),
                        leavingDate: addEventState.leavingDate.format("YYYY-MM-DD HH:mm:ss"),
                        longDesc: addEventState.longDesc,
                        placeName: addEventState.chosenPlaceName,
                        placeId: addEventState.chosenPlaceId,
                        photoAddingInfo: {
                            name: addEventState.chosenPhotoFileName,
                            link: addEventState.chosenPhotoLink,
                            mode: addEventState.chosenPhotoAddingOption
                        }
                        })
                    })
            const addEventJson = await addEventReq.json()
            const newEventId = addEventJson.insertId
            if (addEventState.chosenHumans.length > 0) {
                const addCompanionReq = await fetch(`http://localhost:3000/add-event-companion`,
                      {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            eventId: newEventId,
                            humansArr: addEventState.chosenHumans 
                        })
                    }
                )
                const addCompanionJson = addCompanionReq.json()
                console.log(addCompanionJson)
            }
            setIsAdding(false)
        }
        addEventWithPeople()
    }, [isAdding])

    useEffect(() => {
        const showProposedPhotos = async () => {
            if (addEventState.photoSelectorValue.length > 2) {
                const photosReq = await fetch(`http://localhost:3000/eventPhotos?inputText=${addEventState.photoSelectorValue}`)
                const photosJson = await photosReq.json()
                setSingleProperty("suggestedPhotos", photosJson)
            }
        }
        showProposedPhotos()
    }, [addEventState.photoSelectorValue])

    useEffect(() => {
        setSingleProperty("chosenEventPhotoAddress", "http://localhost:3000/human-photo/anonymous.jpg")
        setSingleProperty("chosenPhotoFileName", "")
    },[addEventState.chosenPhotoAddingOption])

    function handlePlaceDoubleClick(place) {
        setAddEventState(prev => ({
            ...prev,
            chosenPlaceName: place.place_name,
            chosenPlaceId: place.id,
            placeSelectorInput: "",       
            placesSuggestions: []
        }));
    }

    function removeTileFromChosen(humanToRemove) {
        setAddEventState(prev => ({
            ...prev,
            chosenHumans: prev.chosenHumans.filter(
                human => human.id !== humanToRemove.id
            )
        }));
    }

    function addHumanToChosen(humanJson) {
        setAddEventState(prev => ({
            ...prev,
            chosenHumans: [...prev.chosenHumans, humanJson],
            suggestedHumans: prev.suggestedHumans.filter(
                human => human.id !== humanJson.id
            )
        }));
    }

    function onPhotoAddingOptionChange(e) {
        setSingleProperty("chosenPhotoAddingOption", e.target.value);
    }


    function setSelectedPhoto(photoName) {

        const photoFullAddress = `http://localhost:3000/event-photo/${photoName}`
        setSingleProperty("chosenEventPhotoAddress", photoFullAddress)
        setSingleProperty("chosenPhotoFileName", photoName)
    }
    function renderEventPhotoAddingPart() {
        switch (addEventState.chosenPhotoAddingOption) {
            case "database":
                return (
                    <PhotoSelector chosenPhotoAddress={addEventState.chosenEventPhotoAddress} photosToShow={addEventState.suggestedPhotos} onInputChange={(newValue) => {setSingleProperty("photoSelectorValue", newValue)}} onClickFunction={setSelectedPhoto}/>
                );

            case "file":
                return <div>Upload pliku</div>;

            case "link":
                return (
                    <DivWithMargins>
                        <ControlledTextInput placeholderValue="Podaj nazwę zdjęcia. Jeśli pozostawisz to puste, zdjećie zostane zapisane z ID eventu."  changeFieldValue={(newValue) => setSingleProperty("chosenPhotoName", newValue)} />
                        <h3>Wklej link do zdjęcia</h3>
                        <ControlledTextInput placeholderValue="Link:" changeFieldValue={(newValue) => setSingleProperty("chosenPhotoLink", newValue)}/>
                        
                    </DivWithMargins>
                )

            default:
                return null;
        }
    }

    return(
        <>
            <h2>Nazwa wydarzenia</h2>
            <ControlledTextInput placeholderValue="Podaj nazwę wydarzenia..." fieldValue={addEventState.eventName} changeFieldValue={(newValue) => setSingleProperty("eventName", newValue)} id="eventNameinput"/>
            
            <h2>Data rozpoczęcia wydarzenia</h2>
            <DatePickerWithClock id="startDateInput" pickerHeader="Podaj datę rozpoczęcia wydarzenia" dateValue={addEventState["startDate"]} changeDateFunction={(newValue) => setSingleProperty("startDate", newValue)}/>
            
            <h2>Data zakończenia wydarzenia</h2>
            <DatePickerWithClock pickerHeader="Podaj datę zakończenia wydarzenia" dateValue={addEventState["stopDate"]}changeDateFunction={(newValue) => setSingleProperty("stopDate", newValue)} id="stopDateInput"/>
            
            <h2>Data przybycia na wydarzenie</h2>
            <DatePickerWithClock pickerHeader="Podaj datę przybycia na wydarzenia" dateValue={addEventState["comingDate"]} changeDateFunction={(newValue) => setSingleProperty("comingDate", newValue)} id="comingDateInput"/>
            
            <h2>Data opuszczenia wydarzenie</h2>
            <DatePickerWithClock pickerHeader="Podaj datę opuszczenia wydarzenia" dateValue={addEventState["leavingDate"]} changeDateFunction={(newValue) => setSingleProperty("leavingDate", newValue)} id="leavingDateInput"/>
            
            <h2>Miejsce wydarzenia</h2>
            <ControlledTextInput placeholderValue="Wpisz miejsce wydarzenia..." fieldValue={addEventState.placeText} changeFieldValue={(newValue) => setSingleProperty("placeText", newValue)}/>
            
            <h2>Wybierz miejsce wydarzenia</h2>
            <DropdownMenuForPlace onInputChange={(newValue) => setSingleProperty("placeSelectorInput", newValue)} inputValue={addEventState.placeSelectorInput} placeholder={addEventState.chosenPlaceName} choiceOptions={addEventState.placesSuggestions} onOptionDoubleClick={handlePlaceDoubleClick} />
            
            <h2>Długi opis eventu</h2>
            <ControlledTextArea placeholderValue="Wpisz długi opis eventu..." fieldValue={addEventState.longDesc} changeFieldValue={(newValue) => setSingleProperty("longDesc", newValue)}/>
            
            <HumansTileSelector headerText="Wybierz towarzystwo na wydarzeniu" selectedHumansHeaderText="Wybrani ludzie" selectorInputValue={addEventState.humanSelectorInputValue} onInputValueChange={(newValue) => setSingleProperty("humanSelectorInputValue", newValue)} suggestedHumans={addEventState.suggestedHumans} chosenHumans={addEventState.chosenHumans} onSuggestedTileClickFunction={addHumanToChosen} tileRemoverFunction={removeTileFromChosen} />

            <RadioOptionsPicker header="Wybierz sposób dodawania zdjęcia" options={[
                {value: "database", text: "Z bazy danych"}, 
                {value:"file", text: "Z pliku"}, 
                {value:"link", text: "Z linku"}]} chosenOptionName={addEventState.chosenPhotoAddingOption} onChangeFunction={onPhotoAddingOptionChange}/> <br/>
            {renderEventPhotoAddingPart()}

            
            <StyledButton type="button" onClick={() => {setIsAdding(true);}}>Dodaj wydarzenie</StyledButton>
        </>
    )

}