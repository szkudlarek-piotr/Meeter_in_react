import styled from "styled-components"

export default function ControlledTextInput({fieldValue, changeFieldValue, placeholderValue}) {
    const StyledInputField = styled.input`
        height: 50px;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    `
    return (
        <StyledInputField type="text" value={fieldValue} placeholder={placeholderValue} onChange={(e) => changeFieldValue(e.target.value)}/>
    )
}