import DropdownMenuForHuman from './Multiuse/DropdownComponents/DropdownMenuForHuman.jsx';
import DropdownMenuForPlace from "./Multiuse/DropdownComponents/DropdownMenuForPlace2.jsx";
import ControlledTextInput from './Multiuse/SimpleControlledComponents/ControlledTextInput.jsx';
import DatePickerWithClock from "./Multiuse/SimpleControlledComponents/DatePickerWithClock.jsx";
import RadioOptionsPicker from "./Multiuse/RadioOptionsPicker.jsx";
import ControlledTextArea from "./Multiuse/SimpleControlledComponents/ControlledTextArea.jsx";
import InsertResultModal from "./Multiuse/InsertResultModal.jsx";
import CaptionedPhoto from "./Multiuse/CaptionedPhoto.jsx";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import dayjs from "dayjs";

const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    font-weight: 900;
    font-size: 30px;
    margin-bottom: 50px;
    &:hover {
        background-color: red;
    }

`

export default function FrontendToAddWedding() {

    const DECAY_TIME = 10000
    function getInitialWeddingState() {
        return (
            {
                weddingName: "",
                weddingLongDesc: "",
                weddingDate: dayjs(),
                groomInputValue: "",
                groomName: "Pan Młody",
                groomPhoto: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", 
                groomId: "0",
                groomDropdownData: [],
                brideInputValue: "",
                brideName: "Panna Młoda",
                bridePhoto: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", 
                brideId: "0",
                brideDropdownData: [],
                        
                partnerInputValue: "",
                partnerName: "Partnerka",
                partnerPhoto: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", 
                partnerId: null,
                partnerDropdownData: [],
                        
                ceremonyPlaceName: "Wpisz miejsce ślubu...",
                ceremonyPlaceId: null,
                ceremonyPlaceInputValue: "",
                ceremonyPlaceSuggestions: [],

                partyPlaceName: "Wpisz miejsce wesela...",
                partyPlaceId: null,
                partyPlaceInputValue: "",
                partyPlaceSuggestions: [],

                hotelPlaceName: "Wpisz nazwę hotelu...",
                hotelPlaceId: null,
                hotelPlaceInputValue: "",
                hotelPlaceSuggestions: [],

                hasAfterparty: 0,
                wasIInvited: 1
            }
        )
    }

    const [weddingState, setWeddingState] = useState(getInitialWeddingState())

    const [isAdding, setIsAdding] = useState(false)
    const [insertResult, setInsertResult] = useState({ message: "", status: null });




    function setWeddingAttribute(propName, propValue) {
        setWeddingState(prev => ({
            ...prev,
            [propName]: propValue
        }))
    }

    function setGroom(photo, name, humanId) {
        setWeddingState(prev => ({
            ...prev,
            groomName: name,
            groomInputValue: "",
            groomPhoto: photo,
            groomId: humanId,
            groomDropdownData: []
        }))
    }

    function setBride(photo, name, humanId) {
        setWeddingState(prev => ({
            ...prev,
            brideInputValue: "",
            brideName: name,
            bridePhoto: photo,
            brideId: humanId,
            brideDropdownData: []
        }))
    }

    function setPartner(photo, name, humanId) {
        setWeddingState(prev => ({
            ...prev,
            partnerInputValue: "",
            partnerName: name,
            partnerPhoto: photo,
            partnerId: humanId,
            partnerDropdownData: []
        }))
    }

    function setCeremonyPlace(place) {
        setWeddingState(prev => ({
            ...prev,
            ceremonyPlaceName: place.place_name,
            ceremonyPlaceId: place.id,
            ceremonyPlaceInputValue: "",
            ceremonyPlaceSuggestions: []
        }))
    }

    
    function setPartyPlace(place) {
        setWeddingState(prev => ({
            ...prev,
            partyPlaceName: place.place_name,
            partyPlaceId: place.id,
            partyPlaceInputValue: "",
            partyPlaceSuggestions: []
        }))
    }
        
    function setHotelPlace(place) {
        console.log(`Miejsce inputowe: ${JSON.stringify(place)}`)
        setWeddingState(prev => ({
            ...prev,
            hotelPlaceName: place.place_name,
            hotelPlaceId: place.id,
            hotelPlaceInputValue: "",
            hotelPlaceSuggestions: []
        }))
    }

    function setHasAfterparty(e) {
        setWeddingAttribute("hasAfterparty", e.target.value)
    }

    function setWereYouInvited(e) {
        setWeddingAttribute("wasIInvited", e.target.value)
    }


    useEffect(()=>{
        const getGroomSuggestions =  async () => {
            const substring = await fetch(`http://localhost:3000/get-human-from-substring?substring=${weddingState.groomInputValue}`)
            const groomSuggestionsJson = await substring.json()
            setWeddingAttribute("groomDropdownData", groomSuggestionsJson)
        }
        if (weddingState.groomInputValue.length > 2) {
            getGroomSuggestions()
        }
    }, [weddingState.groomInputValue])


    useEffect(()=>{
        const getBrideSuggestions =  async () => {
            const substring = await fetch(`http://localhost:3000/get-human-from-substring?substring=${weddingState.brideInputValue}`)
            const brideSuggestionsJson = await substring.json()
            setWeddingAttribute("brideDropdownData", brideSuggestionsJson)
        }
        if (weddingState.brideInputValue.length > 2) {
            getBrideSuggestions()
        }
    }, [weddingState.brideInputValue])


    useEffect(()=>{
        const getPartnerSuggestions =  async () => {
            const substring = await fetch(`http://localhost:3000/get-human-from-substring?substring=${weddingState.partnerInputValue}`)
            const partnerSuggestionsJson = await substring.json()
            setWeddingAttribute("partnerDropdownData", partnerSuggestionsJson)
        }
        if (weddingState.partnerInputValue.length > 2) {
            getPartnerSuggestions()
        }
    }, [weddingState.partnerInputValue])
    

    useEffect(()=>{
        const getCeremonyPlaceSuggestions=  async () => {
            const ceremonySuggestionsFetch = await fetch(`http://localhost:3000/get-places-from-substring?placeInput=${weddingState.ceremonyPlaceInputValue}`)
            const ceremonyPlaceSuggestionsJson = await ceremonySuggestionsFetch.json()
            setWeddingAttribute("ceremonyPlaceSuggestions", ceremonyPlaceSuggestionsJson)
        }
        if (weddingState.ceremonyPlaceInputValue.length > 2) {
            getCeremonyPlaceSuggestions()
        }
        else {
            setWeddingAttribute("ceremonyPlaceSuggestions", [])
        }
    }, [weddingState.ceremonyPlaceInputValue])


    useEffect(()=>{
        const getPartyPlaceSuggestions=  async () => {
            const partyPlaceFetch = await fetch(`http://localhost:3000/get-places-from-substring?placeInput=${weddingState.partyPlaceInputValue}`)
            const partyPlaceSuggestionsJson = await partyPlaceFetch.json()
            setWeddingAttribute("partyPlaceSuggestions", partyPlaceSuggestionsJson)
        }
        if (weddingState.partyPlaceInputValue.length > 2) {
            getPartyPlaceSuggestions()
        }
        else {
            setWeddingAttribute("partyPlaceSuggestions", [])
        }
    }, [weddingState.partyPlaceInputValue])

    useEffect(()=>{
        const getHotelPlaceSuggestions=  async () => {
            const hotelPlaceFetch = await fetch(`http://localhost:3000/get-places-from-substring?placeInput=${weddingState.hotelPlaceInputValue}`)
            const hotelPlaceSuggestionsJson = await hotelPlaceFetch.json()
            setWeddingAttribute("hotelPlaceSuggestions", hotelPlaceSuggestionsJson)
        }
        if (weddingState.hotelPlaceInputValue.length > 2) {
            getHotelPlaceSuggestions()
        }
        else {
            setWeddingAttribute("hotelPlaceSuggestions", [])
        }
    }, [weddingState.hotelPlaceInputValue])

useEffect(() => {
  if (!isAdding) return;

  const addWedding = async () => {
    const formattedDate = weddingState.weddingDate.format("YYYY-MM-DD HH:mm:ss")
    try {
      const postReq = await fetch(`http://localhost:3000/add-wedding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortDesc: weddingState.weddingName,
          date: formattedDate,
          groomId: weddingState.groomId,
          brideId: weddingState.brideId,
          partnerId: weddingState.partnerId,
          ceremonyPlaceId: weddingState.ceremonyPlaceId,
          partyPlaceId: weddingState.partyPlaceId,
          hotelPId: weddingState.hotelPlaceId,
          afterpaty: weddingState.hasAfterparty,
          longDescription: weddingState.weddingLongDesc,
          wasIInvited: weddingState.wasIInvited
        })
      });

      const postReqJson = await postReq.json();

      if (postReq.ok) {
        setInsertResult({ message: `Pomyślnie dodano ${weddingState.weddingName}`, status: "1", decayTime: DECAY_TIME });
      } else {
        setInsertResult({ message: `Błąd dodawania wesela: ${postReqJson.error || "nieznany"}`, status: "-1", decayTime: DECAY_TIME });
      }

    } catch (error) {
      console.log(error);
      setInsertResult({ message: `Błąd sieci: ${error.message}`, status: "-1", decayTime: DECAY_TIME });
    } finally {
      setIsAdding(false);
      setWeddingState(getInitialWeddingState())
    }
  };

  addWedding();

}, [isAdding]);

    return (
        <>
            <h3>Data wesela</h3>
            <DatePickerWithClock pickerHeader="Data wesela" dateValue={weddingState.weddingDate} changeDateFunction={(newVal) => setWeddingAttribute("weddingDate", newVal)} style={{width: "80%"}}/>
            
            <h2>Krótki opis wesela</h2>
            <ControlledTextInput placeholderValue="Wpisz nazwę wesela..." fieldValue={weddingState.weddingName} changeFieldValue={(newValue) => setWeddingAttribute("weddingName", newValue)}/>

            <h3>Pan Młody:</h3>
            <DropdownMenuForHuman 
                inputValue={weddingState.groomInputValue} 
                placeholder={weddingState.groomName} 
                choiceOptions={weddingState.groomDropdownData}
                onInputChange={value => setWeddingAttribute("groomInputValue", value)}
                onOptionDoubleClick={setGroom}  
            />

            <h3>Panna Młoda:</h3>
            <DropdownMenuForHuman 
                inputValue={weddingState.brideInputValue} 
                placeholder={weddingState.brideName} 
                choiceOptions={weddingState.brideDropdownData}
                onInputChange={value => setWeddingAttribute("brideInputValue", value)}
                onOptionDoubleClick={setBride}   
            />


            <h3>Partnerka:</h3>
            <DropdownMenuForHuman 
                inputValue={weddingState.partnerInputValue} 
                placeholder={weddingState.partnerName} 
                choiceOptions={weddingState.partnerDropdownData}
                onInputChange={value => setWeddingAttribute("partnerInputValue", value)}
                onOptionDoubleClick={setPartner}  
            />

            <h3>Miejsce ślubu</h3>
            <DropdownMenuForPlace inputValue={weddingState.ceremonyPlaceInputValue} choiceOptions={weddingState.ceremonyPlaceSuggestions} onInputChange={value => setWeddingAttribute("ceremonyPlaceInputValue", value)} placeholder={weddingState.ceremonyPlaceName} onOptionDoubleClick={setCeremonyPlace}/>

            <h3>Miejsce wesela</h3>
            <DropdownMenuForPlace inputValue={weddingState.partyPlaceInputValue} choiceOptions={weddingState.partyPlaceSuggestions} onInputChange={value => setWeddingAttribute("partyPlaceInputValue", value)} placeholder={weddingState.partyPlaceName} onOptionDoubleClick={setPartyPlace}/>
                
            <h3>Hotel</h3>
            <DropdownMenuForPlace inputValue={weddingState.hotelPlaceInputValue} choiceOptions={weddingState.hotelPlaceSuggestions} onInputChange={value => setWeddingAttribute("hotelPlaceInputValue", value)} placeholder={weddingState.hotelPlaceName} onOptionDoubleClick={setHotelPlace}/>

            <h3>Długi opis wesela</h3>
            <ControlledTextArea fieldValue={weddingState.weddingLongDesc} placeholderValue="Wpisz dłużśzy opis wesela..." changeFieldValue={(newValue) => {setWeddingAttribute("weddingLongDesc", newValue)}} key="wedLongDesc" id="wedLongDescInput"/>

            <RadioOptionsPicker onChangeFunction={setHasAfterparty} header="Czy po weselu będą poprawiny?" options={[{"text": "Tak", "value": 1}, {"text": "Nie", "value": 0}]} chosenOptionName={weddingState.hasAfterparty} name="wedingWithAfterparty"/>
            <RadioOptionsPicker onChangeFunction={setWereYouInvited} header="Czy byłeś zaproszony?" options={[{"text": "Tak", "value": 1}, {"text": "Nie", "value": 0}]} chosenOptionName={weddingState.wasIInvited} name="wasIInvited"/>




            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={weddingState.groomName} captionWidth="80" borderRadius="20" photoAdress={weddingState.groomPhoto} />

                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={weddingState.partnerName} captionWidth="80" borderRadius="20" photoAdress={weddingState.partnerPhoto} />
                
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={weddingState.brideName} captionWidth="80" borderRadius="20" photoAdress={weddingState.bridePhoto} />

            </div>

            
            <StyledButton onClick={() => setIsAdding(true)}>Dodaj wesele</StyledButton>
            
            {
                insertResult.status && (
                    <InsertResultModal key={Date.now()} messageText={insertResult.message} status={insertResult.status} decayTime={DECAY_TIME} />
                )
            }
        </>
    )
}