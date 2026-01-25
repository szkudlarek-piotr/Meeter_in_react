
import DatePickerWithClock from "./Multiuse/SimpleControlledComponents/DatePickerWithClock.jsx";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextInput.jsx";
import DropdownMenuForPlace from "./Multiuse/DropdownComponents/DropdownMenuForPlace2.jsx";
import ControlledTextArea from "./Multiuse/SimpleControlledComponents/ControlledTextArea.jsx";
import HumansTileSeletor from "./Multiuse/HumansTileSelector.jsx"
import { useEffect, useState } from "react";
import dayjs from "dayjs"
import styled from "styled-components";
import InsertResultModal from "./Multiuse/InsertResultModal.jsx";

const DECAY_TIME = 5000

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

export default function FrontendToAddMeeting() {
    const initialState = {
        "date": dayjs(),
        "shortDesc": "",
        "longDesc": "",
        "placeText": "",
        "chosenPlaceId": "",
        "chosenPlaceName": "Wpisz nazwę miejsca",
        "chosenPlaceInputValue": "",
        "placesSuggestions": [],
        "humanSelectorInputValue": "",
        "suggestedHumans": [],
        "chosenHumans": []
    }

    function getInitialState() {
        return {
            date: dayjs(),
            shortDesc: "",
            longDesc: "",
            placeText: "",
            chosenPlaceId: "",
            chosenPlaceName: "Wpisz nazwę miejsca",
            chosenPlaceInputValue: "",
            placesSuggestions: [],
            humanSelectorInputValue: "",
            suggestedHumans: [],
            chosenHumans: []
        };
    }
    const [addMeetingState, setAddMeetingState] = useState(getInitialState())
    const [isAdding, setIsAdding] = useState(false)
    const [insertResult, setInsertResult] = useState({ message: "", status: null });

    function setSingleProperty(propertyName, propertyValue) {
    setAddMeetingState(prevState => ({
        ...prevState,
        [propertyName]: propertyValue
    }));
    }

    function handlePlaceInputChange(newValue) {
        setAddMeetingState(prev => ({
            ...prev,
            chosenPlaceInputValue: newValue,
            chosenPlaceId: ""           
        }));
    }

    function removeTileFromChosen(humanToRemove) {
        setAddMeetingState(prev => ({
            ...prev,
            chosenHumans: prev.chosenHumans.filter(
                human => human.id !== humanToRemove.id
            )
        }));
    }

    function addHumanToChosen(humanJson) {
        setAddMeetingState(prev => ({
            ...prev,
            chosenHumans: [...prev.chosenHumans, humanJson],
            suggestedHumans: prev.suggestedHumans.filter(
                human => human.id !== humanJson.id
            )
        }));
    }

    function handlePlaceDoubleClick(place) {
        setAddMeetingState(prev => ({
            ...prev,
            chosenPlaceName: place.place_name,
            chosenPlaceId: place.id,
            chosenPlaceInputValue: "",       
            placesSuggestions: []
        }));
    }
    useEffect(() => {
        fetch(`http://localhost:3000/get-places-from-substring?placeInput=${addMeetingState.chosenPlaceInputValue}`).then(response => {
            if (!response.ok) {
                throw new Error("Błąd sieci!")
            }
            return response.json()
        })
        .then(data => {
                setSingleProperty("placesSuggestions", data);

        })
    }, [addMeetingState.chosenPlaceInputValue])

    useEffect(() => {
        const excludedIds = addMeetingState.chosenHumans.map((human) => (human.id)).join(',')
        if (addMeetingState.humanSelectorInputValue.length > 2) {
            fetch(`http://localhost:3000/get-humans-sorted-filtered?substring=${addMeetingState.humanSelectorInputValue}&mode=meetings&excludedIds=${excludedIds}`).then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych o ludziach.")
                }
                return response.json()

            })
            .then(data => {
                setSingleProperty("suggestedHumans", data)
            })
        }
    }, [addMeetingState.humanSelectorInputValue])

    useEffect(() => {
        if (!isAdding) return;

        const addMeetingAndHumans = async () => {
            try {
                const formattedDate = addMeetingState.date.format("YYYY-MM-DD HH:mm:ss");

                // 1️⃣ Dodanie spotkania
                const meetingRes = await fetch(
                    `http://localhost:3000/add-meeting?date=${formattedDate}&shortDesc=${addMeetingState.shortDesc}&longDesc=${addMeetingState.longDesc}&placeText=${addMeetingState.placeText}&placeId=${addMeetingState.chosenPlaceId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!meetingRes.ok) {
                    throw new Error("Błąd dodawania spotkania");
                }

                const meetingData = await meetingRes.json();
                const insertedMeetingId = meetingData.insertId;

                // 2️⃣ Dodanie ludzi do spotkania
                const chosenHumanIds = addMeetingState.chosenHumans.map(human => human.id);

                const humansRes = await fetch(
                    "http://localhost:3000/add-humans-to-meeting",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            meetingId: insertedMeetingId,
                            humanIds: chosenHumanIds
                        })
                    }
                );

                if (!humansRes.ok) {
                    throw new Error("Błąd dodawania ludzi do spotkania");
                }

                const addHumansJson = await humansRes.json();
                console.log(addHumansJson)

                setAddMeetingState(getInitialState());
                setInsertResult({status: "1", message: "Pomyślnie dodano towarzystwo do spotkania!"})

            } catch (err) {
                setInsertResult({status: "-1", message: `Wystąpił błąd podczas dodawania ludzi do spotkania. Treść błędu: ${err}.`})
            } finally {
                setIsAdding(false);
            }
        };

        addMeetingAndHumans();

    }, [isAdding]);


    const visibleSuggestedHumans = addMeetingState.suggestedHumans.filter(
        human => !addMeetingState.chosenHumans.some(
            chosen => chosen.id === human.id
        )
    )


    return (
    <>
        <h2>Data spotkania</h2>
        <DatePickerWithClock pickerHeader="Podaj datę spotkania" dateValue={addMeetingState["date"]} changeDateFunction={(newValue) =>setSingleProperty("date", newValue)}></DatePickerWithClock>
        <h2>Krótki opis spotkania</h2>
        <ControlledTextInput placeholderValue="Podaj krótki opis spotkania" fieldValue={addMeetingState["shortDesc"]} changeFieldValue={(newValue) => setSingleProperty("shortDesc", newValue)}></ControlledTextInput>
        <h2>Długi opis spotkania</h2>
        <ControlledTextArea placeholderValue="Podaj długi opis spotkania" fieldValue={addMeetingState["longDesc"]} changeFieldValue={(newValue) => setSingleProperty("longDesc", newValue)}/>
        <h2>Wpisz miejsce spotkania</h2>
        <ControlledTextInput placeholderValue="Podaj miejsce spotkania" fieldValue={addMeetingState["placeText"]} changeFieldValue={(newValue) => setSingleProperty("placeText", newValue)}></ControlledTextInput>
        <h2>Wybierz miejsce spotkania</h2>
        <DropdownMenuForPlace
            inputValue={addMeetingState.chosenPlaceInputValue}
            onInputChange={handlePlaceInputChange} 
            choiceOptions={addMeetingState.placesSuggestions}
            placeholder={addMeetingState.chosenPlaceName}
            onOptionDoubleClick={handlePlaceDoubleClick}
        />
        <HumansTileSeletor 
            selectorInputValue={addMeetingState.humanSelectorInputValue} 
            suggestedHumans={visibleSuggestedHumans} 
            chosenHumans={addMeetingState.chosenHumans}  
            headerText="Wybierz towarzystwo"  
            onInputValueChange={(newValue) => setSingleProperty("humanSelectorInputValue", newValue)} selectedHumansHeaderText="Wybrane towarzystwo" 
            onSuggestedTileClickFunction={addHumanToChosen}
            tileRemoverFunction={removeTileFromChosen}
        /> 
        <StyledButton id="addMeetingButton" onClick={() => setIsAdding(true)}>Dodaj spotkanie</StyledButton>



        {
            insertResult.status && (
                <InsertResultModal key={Date.now()} messageText={insertResult.message} status={insertResult.status} decayTime={DECAY_TIME} />
            )
        }
    </>
    )
}