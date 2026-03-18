import styled from 'styled-components'
import ControlledTextInput from './Multiuse/SimpleControlledComponents/ControlledTextInput.jsx'
import ControlledPasswordInput from './Multiuse/SimpleControlledComponents/ControlledPasswordInput .jsx'
import { useState } from 'react'

const StyledButton = styled.button`
    width: 30%;
    background-color: white;
    border: 2px solid black;
    margin-bottom: 40px;
    font-weight: 900;
    font-size: 30px;
    margin-top: 40px;
    &:hover {
        background-color: red;
    }
`


export default function FrontendToLogin() {

    const initialFormState = {
        "username": "",
        "password": ""
    }

    const [formState, setFormState] = useState(initialFormState)

    function setLoggingAtribute(propName, propValue) {
        setFormState(prev => ({
            ...prev,
            [propName]: propValue
        }))
    }

    const tryToLogUser = async () => {
        try {
                let logReq = await fetch(`http://localhost:3000/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formState),
                    credentials: "include"
                })
                const logJson = await logReq.json()
                console.log(logJson)
        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <h2>Podaj login</h2>
            <ControlledTextInput fieldValue={formState.username} changeFieldValue={(newValue) => setLoggingAtribute("username", newValue)} placeholder="Podaj nazwę użytkownika"/>
            
            <h2>Podaj hasło</h2>
            <ControlledPasswordInput fieldValue={formState.password} changeFieldValue={(newValue) => setLoggingAtribute("password", newValue)} placeholder="Wpisz hasło..."/>
            
            <StyledButton onClick={() => tryToLogUser()}>Zaloguj się</StyledButton>

        </>
    )
}