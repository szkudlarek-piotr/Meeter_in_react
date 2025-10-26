import styled from "styled-components"

const TextInput=styled.input`
    width: 80%;
    height: 24px;
`

export default function SimpleTextInput({placeholder, id}) {
    return <TextInput type="text" placeholder={placeholder} id={id} key={id}/>
}