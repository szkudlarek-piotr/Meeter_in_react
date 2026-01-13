import styled from "styled-components"

const HumanDropdownOption= styled.div`
    min-height: 50px;
    background-color: white;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    font-family: Comic-Sans;

    border-bottom: 1px solid black;
    border-right: 1px solid black;
    border-left: 1px solid black;
    &>.placeName {
        font-size: 30px;
        width: 70%;
    }
    &>.categoryName {
        width: 30%;
        font-size: 20px;
    }
    &:hover {
        font-weight: 700;
        background-color: red;
        align
    }
`

export default function DropdownOptionForHuman({ name, category, id, onDoubleClick}) {
    return (
        <HumanDropdownOption onDoubleClick={onDoubleClick} key={id}> 
            <div className="placeName">{name}</div>
            <div className="categoryName">{category}</div>
        </HumanDropdownOption>)
}