import styled from "styled-components";

const MenuOption = styled.a`
    font-size: 20px;
    font-family: Times New Roman;
    height: 30px;
    text-align: center;

    

    &:hover {
        font-weight: 700;
    }
`
export default function ChoiceOption({children, id, onClick}){
    return <MenuOption id={id} onClick={onClick}>{children}</MenuOption>
}