import DatePickerWithClock from "./Multiuse/SimpleControlledComponents/DatePickerWithClock.jsx";
import ControlledTextInput from "./Multiuse/SimpleControlledComponents/ControlledTextInput.jsx";
import ControlledTextArea from "./Multiuse/SimpleControlledComponents/ControlledTextArea.jsx";
import HumansTileSeletor from "./Multiuse/HumansTileSelector.jsx";
import ControlledNumberInput from "./Multiuse/SimpleControlledComponents/ControlledNumberInput.jsx";
import InsertResultModal from "./Multiuse/InsertResultModal.jsx";
import { useEffect, useState } from "react";
import dayjs from "dayjs"
import styled from "styled-components";

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



export default function FrontendToAddVisit() {
    function getInitialState() {
        return {
            date: dayjs(),
            shortDesc: "",
            longDesc: "",
            humanSelectorInputValue: "",
            visitDuration: 1,
            suggestedHumans: [],
            chosenHumans: []
        };
        
    }

    function removeTileFromChosen(humanToRemove) {
        setAddVisitState(prev => ({
            ...prev,
            chosenHumans: prev.chosenHumans.filter(
                human => human.id !== humanToRemove.id
            )
        }));
    }

    function addHumanToChosen(humanJson) {
        setAddVisitState(prev => ({
            ...prev,
            chosenHumans: [...prev.chosenHumans, humanJson],
            suggestedHumans: prev.suggestedHumans.filter(
                human => human.id !== humanJson.id
            )
        }));
    }

    function setSingleProperty(propertyName, propertyValue) {
        setAddVisitState(prevState => ({
        ...prevState,
        [propertyName]: propertyValue
        }));
    }

    const DECAY_TIME = 5000
    const [addVisitState, setAddVisitState] = useState(getInitialState())
    const [isAdding, setIsAdding] = useState(false)
    const [insertResult, setInsertResult] = useState({ message: "", status: null })



    useEffect(() => {
        const excludedIds = addVisitState.chosenHumans.map((human) => (human.id)).join(',')
        if (addVisitState.humanSelectorInputValue.length > 2) {
            fetch(`http://localhost:3000/get-humans-sorted-filtered?substring=${addVisitState.humanSelectorInputValue}&mode=visits&excludedIds=${excludedIds}`).then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych o ludziach.")
                }
                return response.json()

            })
            .then(data => {
                setSingleProperty("suggestedHumans", data)
            })
        }
    }, [addVisitState.humanSelectorInputValue, addVisitState.chosenHumans])

useEffect(() => {
        if (!isAdding) return;

        const addVisitAndHumans = async () => {
            try {
                const formattedDate = addVisitState.date.format("YYYY-MM-DD HH:mm:ss");

                const visitRes = await fetch(
                    `http://localhost:3000/add-visit`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            date: formattedDate,
                            duration: addVisitState.visitDuration,
                            shortDesc: addVisitState.shortDesc,
                            longDesc: addVisitState.longDesc
                        })
                    }
                )

                if (!visitRes.ok) {
                    throw new Error("Błąd dodawania wizyty.");
                }

                const visitData = await visitRes.json();
                const insertedVisitId = visitData.insertId;
                const chosenHumanIds = addVisitState.chosenHumans.map((human) => human.id)
                const visitorsRes = await fetch(`http://localhost:3000/add-visiting-humans`, {
                    method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            visitId: insertedVisitId,
                            humanIds: chosenHumanIds
                        })
                    })
                const addingResponse = await visitorsRes.json()
                if (visitorsRes.ok) {
                    setInsertResult({status: "1", message: "Pomyślnie dodano gości do wizyty."})
                }
                else {
                    setInsertResult({status: "-1", mesaage: "Podczas dodawania gości do wizyty wystąpił bład."})
                }
                console.log(addingResponse)

                setAddVisitState(getInitialState());

            } catch (err) {
                console.error("Błąd:", err);
            } finally {
                setIsAdding(false);
            }
        };
        
        addVisitAndHumans();

    }, [isAdding]);


    const visibleSuggestedHumans = addVisitState.suggestedHumans.filter(
        human => !addVisitState.chosenHumans.some(
            chosen => chosen.id === human.id
        )
    )

    return (
        <>
            <h2>Data wizyty</h2>
            <DatePickerWithClock pickerHeader="Podaj datę wizyty" dateValue={addVisitState["date"]} changeDateFunction={(newValue) =>setSingleProperty("date", newValue)}></DatePickerWithClock>
            <h2>Podaj długość wizyty</h2>
            <ControlledNumberInput value={addVisitState.visitDuration} id="visitDurationInput" onchangeFunction={(newValue) => setSingleProperty("visitDuration", newValue)}/>
            <h2>Krótki opis wizyty</h2>
            <ControlledTextInput placeholderValue="Podaj krótki opis wizyty..." fieldValue={addVisitState["shortDesc"]} id="shortMeetingDesc" changeFieldValue={(newValue) => setSingleProperty("shortDesc", newValue)}></ControlledTextInput>
            <h2>Dłuższy opis wizyty</h2>
            <ControlledTextArea id="longVisitInput" placeholderValue="Podaj długi opis wizyty..." fieldValue={addVisitState["longDesc"]} changeFieldValue={(newValue) => setSingleProperty("longDesc", newValue)}/>
            <HumansTileSeletor 
                selectorInputValue={addVisitState.humanSelectorInputValue} 
                suggestedHumans={visibleSuggestedHumans} 
                chosenHumans={addVisitState.chosenHumans}  
                headerText="Wybierz gości"  
                onInputValueChange={(newValue) => setSingleProperty("humanSelectorInputValue", newValue)} selectedHumansHeaderText="Wybrane towarzystwo" 
                onSuggestedTileClickFunction={addHumanToChosen}
                tileRemoverFunction={removeTileFromChosen}
            /> 
            <StyledButton id="addMeetingButton" onClick={() => setIsAdding(true)}>Dodaj wizytę</StyledButton>            
            {
                insertResult.status && (
                    <InsertResultModal key={Date.now()} messageText={insertResult.message} status={insertResult.status} decayTime={DECAY_TIME} />
                )
            }            
        </>
    )

}