import CaptionedPhoto from "./Multiuse/CaptionedPhoto.jsx";
import SimpleTextInput from "./SimpleTextInput";
import DatePickerWithClock from "./Multiuse/DatePickerWithClock";
import { useState } from "react";

export default function FrontendToAddWedding() {

    const initialGroomData = {name: "Pan Młody", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}
    const initialPartnerData = {name: "Partnerka", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}
    const initialBrideData = {name: "Panna Młoda", photo: "https://rlv.zcache.com/anonymous_logo_square_sticker-r5e3b35e5655c45d5bc36562960a42d9b_zg2qgs_644.webp?rlvnet=1", id: "0"}

    const [groomData, setGroomData] = useState(initialGroomData)
    const [partnerData, setPartnerData] = useState(initialPartnerData)
    const [brideData, setBrideData] = useState(initialBrideData)
    return (
        <>
            <h3>Data wesela</h3>
            <DatePickerWithClock style={{width: "80%"}}/>
            <SimpleTextInput headerText="Nazwa wesela" placeholder="Wpisz nazwę wesela..." id="weddingNamInput" />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={groomData.name} captionWidth="80" borderRadius="20" photoAdress={groomData.photo} />

                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={partnerData.name} captionWidth="80" borderRadius="20" photoAdress={partnerData.photo} />
                
                <CaptionedPhoto divWidth="30" photoWidth="50" photoBorderWidthInPx="2" photoCaption={brideData.name} captionWidth="80" borderRadius="20" photoAdress={brideData.photo} />

            </div>
        </>
    )
}