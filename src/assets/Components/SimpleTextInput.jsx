import styled from "styled-components"

const TextInput=styled.input`
    width: 80%;
    height: 24px;
    margin-bottom: 30px;
`

export default function SimpleTextInput({headerText, placeholder, id}) {
    return (
    <>
    <h3>{headerText}</h3>
    <TextInput type="text" placeholder={placeholder} id={id} key={id}/>
    </>)
}