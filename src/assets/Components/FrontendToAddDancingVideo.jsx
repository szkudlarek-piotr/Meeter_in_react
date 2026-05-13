import styled from 'styled-components'
import { useState } from 'react'
import ControlledTextInput from './Multiuse/SimpleControlledComponents/ControlledTextInput'

const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    margin-bottom: 40px;
    font-weight: 900;
    font-size: 30px;
    margin-top:40px;
    &:hover {
        background-color: red;
    }
`

export default function FrontendToAddDanvingVideo() {
    const [addDancingVideoState, setAddDancingVideoState] = useState(
        {
            "link": "",
            "status": ""
        }
    )



    function setSingleProperty(propName, propValue) {
        setAddDancingVideoState(prev => ({
            ...prev,
            [propName]: propValue
        }))
    }

    const addCheoreoVideo = async() => {
        const addVideoReq = await fetch(`http://localhost:3000/add-dancing-video`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    videoLink: addDancingVideoState.link
                })
            })
        const response = await addVideoReq.json()
        console.log(response)
    }


    return (
        <>
            <h2>Link do filmiku</h2>
            <ControlledTextInput fieldValue={addDancingVideoState.link} changeFieldValue={(newValue) => setSingleProperty("link", newValue)} placeholderValue="Wklej adres filmiku" />
            <StyledButton onClick={() => addCheoreoVideo()}>Dodaj filmik...</StyledButton>
        </>
    )
}