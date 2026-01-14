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
    border-radius: 5%;
`
export default function CalendarDay({children}) {
    return <DayStyle>{children}</DayStyle>
}