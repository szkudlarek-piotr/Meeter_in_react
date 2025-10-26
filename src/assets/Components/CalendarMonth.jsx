import styled from "styled-components";
import WeekdaysHeader from "./WeekdaysHeader";
import GhostDay from "./GhostDay";
import CalendarDay from "./CalendarDay";
import MonthHeader from "./MonthHeader";

const Calendar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
`;

export default function CalendarMonth({month, year}) {
    const startOfMonth = new Date(year, month - 1, 1)
    const firstMonthDayNumber = startOfMonth.getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const lastDayInMonth = new Date(year, month, daysInMonth)
    const lastWeekdayInMonth = lastDayInMonth.getDay()
    const numberOfGhostDaysAfter = (6 - lastWeekdayInMonth) % 7
   
    let ghostDaysBefore = []
    let allRealDays = []
    if (numberOfGhostDaysAfter > 0) {
        for (let i=1; i<firstMonthDayNumber; i++) {
            ghostDaysBefore.push(<GhostDay />)
        }
    } 
    for (let i=0; i<daysInMonth; i++) {
        allRealDays.push(<CalendarDay ></CalendarDay>)
    }
    return (
        <div style={{justifyContent: "space-evenly"}}>
            <MonthHeader month={month} year={year} />
            <WeekdaysHeader />
            <Calendar>
                {ghostDaysBefore}
                {allRealDays}
            </Calendar>
        </div>
    )
}