import styled from "styled-components"

export default function ControlledTextArea({fieldValue, changeFieldValue, placeholderValue, id}) {
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
        <StyledTextarea id={id} key={id} value={fieldValue} placeholder={placeholderValue} onChange={(e) => changeFieldValue(e.target.value)}/>
    )
}