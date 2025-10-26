import styled from "styled-components";

const WeekdayHeader = styled.div` 
    width:85%;
    display:flex;
    margin-left:10%;
    margin-right:10%;
    align:center;
    margin-top:30px;


    &>.nameOfWeekdayDiv {
        width: 11% ;
        border: 2px solid black;
        margin-left: 1%;
        margin-right: 1%;
        margin-bottom: 10px;
        aspect-ratio: 3/1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
    }
`
const weekdaysArray = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"]
const trimDays = weekdaysArray.map((nameOfWeek) => nameOfWeek.substring(0,3) + ".")
export default function WeekdaysHeader() {
    return (
        <WeekdayHeader>
            {trimDays.map(day => <div className="nameOfWeekdayDiv" key={day}>{day}</div>)}
        </WeekdayHeader>
    )
}