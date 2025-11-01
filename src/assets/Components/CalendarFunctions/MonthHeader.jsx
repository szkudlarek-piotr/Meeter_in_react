import styled from "styled-components"

const MonthHeaderStyled = styled.div`
    margin-left: calc(11% - 2px);
    margin-right: calc(11% - 2px);
    border: 2px solid black;
    border-radius: 25px;
    height: 50px;
    font-size: 30px;
    font-family: Arial;
    font-weight: 700;
    width: 78%;

    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:30px;

    &:first-of-kind {
        margin-top: 20px;
    } 
`
export default function MonthHeader({month, year}) {
    const polishMonthsNames = {"1": "Styczneń", "2": "Luty", "3": "Marzec", "4": "Kwiecień", "5":"Maj", "6": "Czerwiec", "7": "Lipiec", "8": "Sierpień", "9": "Wrzesień", "10": "Październik", "11": "Listopad", "12": "Grudzień"}

    const monthString = polishMonthsNames[month]
    return (<MonthHeaderStyled>{monthString} {year}</MonthHeaderStyled>)
}