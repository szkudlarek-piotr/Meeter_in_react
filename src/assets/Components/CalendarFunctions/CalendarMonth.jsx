import styled from "styled-components";
import WeekdaysHeader from "./WeekdaysHeader";
import GhostDay from "./GhostDay";
import CalendarDay from "./CalendarDay";
import FilledCalendarDay from "./FilledCalendarDay";
import MonthHeader from "./MonthHeader";


const Calendar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
    &:last-of-type {
        margin-bottom: 50px;
    }
  `

;

export default function CalendarMonth({month, year, monthData, time}) {
    const startOfMonth = new Date(year, month - 1, 1)
    const firstMonthDayNumber = startOfMonth.getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const lastDayInMonth = new Date(year, month, daysInMonth)
    const lastWeekdayInMonth = lastDayInMonth.getDay()
    const polishMonthsNames = {"1": "Styczneń", "2": "Luty", "3": "Marzec", "4": "Kwiecień", "5":"Maj", "6": "Czerwiec", "7": "Lipiec", "8": "Sierpień", "9": "Wrzesień", "10": "Październik", "11": "Listopad", "12": "Grudzień"}
    let numberOfGhostDaysBefore = firstMonthDayNumber % 7 - 1
    if (numberOfGhostDaysBefore < 0) {
        numberOfGhostDaysBefore = 6
    }
    const numberOfGhostDaysAfter = (6 - lastWeekdayInMonth) % 7
   
    let ghostDaysBefore = []
    let allRealDays = []
    if (numberOfGhostDaysBefore > 0) {
        for (let i=0; i<numberOfGhostDaysBefore; i++) {
            ghostDaysBefore.push(<GhostDay />)
        }
    } 
    for (let i = 1; i <= daysInMonth; i++) {
        const dayNumber = i;
        const dayStringNumber = String(i).padStart(2, "0");
        const monthString = String(month).padStart(2, "0");

        const dayKey = `${year}-${monthString}-${dayStringNumber}`;
        const dayData = monthData[dayKey];

        const dayLabel = `${dayNumber} ${polishMonthsNames[String(month)].substring(0, 3)}`;

        if (!dayData || dayData.class === "") {
            allRealDays.push(
                <CalendarDay key={dayKey}>{dayLabel}</CalendarDay>
            );
        } else {
            allRealDays.push(
                <FilledCalendarDay time={time} dayClass={dayData.class} photosArr={dayData.photos} dayTitle={dayData.computedTitle}/>
            );
        }
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