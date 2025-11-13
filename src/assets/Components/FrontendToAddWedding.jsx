import CaptionedPhoto from "./Multiuse/CaptionedPhoto.jsx";
import SimpleTextInput from "./SimpleTextInput";
import DatePickerWithClock from "./Multiuse/DatePickerWithClock";
import DropdownMenu from './Multiuse/DropdownMenu.jsx'
import { useState } from "react";

export default function FrontendToAddWedding() {

    const initialGroomData = {name: "Pan Młody", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}
    const initialPartnerData = {name: "Partnerka", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}
    const initialBrideData = {name: "Panna Młoda", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}

    

    const [groomInputData, setGroomInputData] = useState("")
    const [brideInputData, setBrideInputData] = useState("")
    const [partnerInputData, setPartnerInputData] = useState("")
    const [groomDropdownData, setGroomDropdownData] = useState([])
    const [brideDropdownData, setBrideDropdownData] = useState([])
    const [partnerDropdownData, setPartnerDropdownData] = useState([])
    const [groomData, setGroomData] = useState(initialGroomData)
    const [partnerData, setPartnerData] = useState(initialPartnerData)
    const [brideData, setBrideData] = useState(initialBrideData)
    
    async function handleGroomInputChange(value) {
        setGroomInputData(value);

        if (value.length < 2) {
            setGroomDropdownData([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/get-human-from-substring?substring=${encodeURIComponent(value)}`
            );
            if (!response.ok) throw new Error("Błąd sieci!");
            const data = await response.json();
            setGroomDropdownData(data);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
        }
    }

    async function handleBrideInputChange(value) {
        setBrideInputData(value);

        if (value.length < 2) {
            setBrideDropdownData([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/get-human-from-substring?substring=${encodeURIComponent(value)}`
            );
            if (!response.ok) throw new Error("Błąd sieci!");
            const data = await response.json();
            setBrideDropdownData(data);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
        }
    }


    async function handlePartnerInputChange(value) {
        setPartnerInputData(value);

        if (value.length < 2) {
            setPartnerDropdownData([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/get-human-from-substring?substring=${encodeURIComponent(value)}`
            );
            if (!response.ok) throw new Error("Błąd sieci!");
            const data = await response.json();
            setPartnerDropdownData(data);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
        }
    }


    async function handleGroomChoice(person) {
        console.log(`Wybrano pana młodego: ${person.toString()}`)
        setGroomData(person)
        setGroomInputData(person.name)
        setGroomDropdownData([])
    }

    async function handleBrideChoice(person) {
        console.log(`Wybrano partnerkę: ${person}`)
        setBrideData(person)
        setBrideInputData(person.name)
        setBrideDropdownData([])
    }


    async function handlePartnerChoice(person) {
        console.log(`Wybrano partnera: ${person}`)
        setPartnerData(person)
        setPartnerInputData(person.name)
        setPartnerDropdownData([])
    }


    return (
        <>
            <h3>Data wesela</h3>
            <DatePickerWithClock style={{width: "80%"}}/>
            <SimpleTextInput headerText="Nazwa wesela" placeholder="Wpisz nazwę wesela..." id="weddingNamInput" />

            <h3>Pan Młody:</h3>
            <DropdownMenu 
                inputValue={groomInputData} 
                placeholder="Pan Młody" 
                choiceOptions={groomDropdownData}
                onInputChange={handleGroomInputChange}
                onOptionDoubleClick={handleGroomChoice}  
            />

            <h3>Panna Młoda:</h3>
            <DropdownMenu 
                inputValue={brideInputData} 
                placeholder="Panna Młoda" 
                choiceOptions={brideDropdownData}
                onInputChange={handleBrideInputChange}
                onOptionDoubleClick={handleBrideChoice}   
            />


            <h3>Partnerka:</h3>
            <DropdownMenu 
                inputValue={partnerInputData} 
                placeholder="Partnerka" 
                choiceOptions={partnerDropdownData}
                onInputChange={handlePartnerInputChange}
                onOptionDoubleClick={handlePartnerChoice}  
            />


            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={groomData.name} captionWidth="80" borderRadius="20" photoAdress={groomData.photo} />

                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={partnerData.name} captionWidth="80" borderRadius="20" photoAdress={partnerData.photo} />
                
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={brideData.name} captionWidth="80" borderRadius="20" photoAdress={brideData.photo} />

            </div>
        </>
    )
}