import styled from "styled-components";

const DayStyle = styled.div`
    display: flex;
    background-color: antiquewhite;
    align-items: center;
    justify-content: center;
    margin-left: 1%;
    margin-right: 1%;
    width: calc(11% - 2px);
    aspect-ratio: 1/1;
    border: 2px solid black;
    margin-bottom: 10px;
    border-radius: 15px;
    &>img {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        border: 1px solid black;
        border-radius: 10px;
    }
`
export default function FilledCalendarDay({dayClass, photosArr, dayTitle, time}) {
    let dayColor
    switch (dayClass) {
        case "visit":
            dayColor = "#ff4700"
            break
        case "meeting":
            dayColor = "#36fc36"
            break
        case "visit_meeting":
            dayColor = "#fe03fe"
            break
        case "event":
            dayColor = "#0d7eda"
            break;
    }
    const index = Math.floor(time / 2) % photosArr.length
    return (
        <DayStyle title={dayTitle} style={{backgroundColor: dayColor}}>
            <img src={photosArr[index]}/>
        </DayStyle>
        )
}