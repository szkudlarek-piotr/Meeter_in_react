import styled from "styled-components"

export default function ControlledTextArea({fieldValue, changeFieldValue, placeholderValue}) {
    const StyledTextarea = styled.textarea`
        rows: 10;
        cols: 80;
        height: 100px;
        font-size: 14px;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    `
    return (
        <StyledTextarea value={fieldValue} placeholder={placeholderValue} onChange={(e) => changeFieldValue(e.target.value)}/>
    )
}