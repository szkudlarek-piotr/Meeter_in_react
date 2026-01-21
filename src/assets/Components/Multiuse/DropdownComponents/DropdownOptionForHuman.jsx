import styled from "styled-components"

const HumanDropdownOption= styled.div`
    height: 50px;
    background-color: white;
    display: flex;
    margin-left: auto;
    margin-right: auto;

    border-bottom: 1px solid black;
    border-right: 1px solid black;
    border-left: 1px solid black;
    &> img {
        width: 40px;
        margin-top: 5px;
        margin-bottom: 5px;
        height: 40px;
        border-radius: 20px;
        margin-left: calc(5% - 20px);
        margin-right: calc(5% - 20px);
    }
    &>.humanName {
        font-size: 30px;
        width: 90%;
        font-family: Cursive;
    }
    &:hover {
        font-weight: 700;
        background-color: red;
    }
`

export default function DropdownOptionForHuman({photo, name, id, onDoubleClick}) {
    return (
        <HumanDropdownOption onDoubleClick={() => photo.length > 1 ? onDoubleClick(photo, name, id) : onDoubleClick(id, name)} key={id}> 
            <img src={"http://localhost:3000" + photo} alt={name}/>
            <div className="humanName">{name}</div>
        </HumanDropdownOption>)
}