import styled from "styled-components"

const TextDropdownOption = styled.div`
    height: 50px;
    background-color: white;
    display: flex;
    margin-left: auto;
    margin-right: auto;

    border-bottom: 1px solid black;
    border-right: 1px solid black;
    border-left: 1px solid black;

    &>.categoryName {
        font-size: 30px;
        width: 90%;
        font-family: Cursive;
    }
    &:hover {
        font-weight: 700;
        background-color: red;
    }
`

export default function DropdownOptionForText({name, id, onDoubleClickFunction}) {
    return (
        <TextDropdownOption key={id}> 
            <div className="categoryName" onDoubleClick={() => onDoubleClickFunction(name)}>{name}</div>
        </TextDropdownOption>)
}