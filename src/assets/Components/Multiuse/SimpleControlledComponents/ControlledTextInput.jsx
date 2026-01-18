import styled from "styled-components"

    const StyledInputField = styled.input`
        height: 50px;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    `

export default function ControlledTextInput({fieldValue, changeFieldValue, placeholderValue, id}) {

    return (
        <StyledInputField type="text" id={id} key={id} value={fieldValue} placeholder={placeholderValue} onChange={(e) => changeFieldValue(e.target.value)}/>
    )
}