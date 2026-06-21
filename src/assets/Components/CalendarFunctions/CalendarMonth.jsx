import styled from "styled-components";
import WeekdaysHeader from "./WeekdaysHeader";
import GhostDay from "./GhostDay";
import CalendarDay from "./CalendarDay";
import FilledCalendarDay from "./FilledCalendarDay";
import MonthHeader from "./MonthHeader";
import WeddingWithPartnerDayTile from "./WeddingWithPartnerDayTIle";
import WeddingWoPartnerDayTile from "./WeddingWoPartnerDayTIle";

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

export default function CalendarMonth({month, year, monthData, time, openModal}) {
    const startOfMonth = new Date(year, month - 1, 1)
    const firstMonthDayNumber = (startOfMonth.getDay() + 6) % 7
    const daysInMonth = new Date(year, month, 0).getDate()
    const polishMonthsNames = {"1": "Styczeń", "2": "Luty", "3": "Marzec", "4": "Kwiecień", "5":"Maj", "6": "Czerwiec", "7": "Lipiec", "8": "Sierpień", "9": "Wrzesień", "10": "Październik", "11": "Listopad", "12": "Grudzień"}
    let numberOfGhostDaysBefore
    if (firstMonthDayNumber != 5) {
        numberOfGhostDaysBefore = firstMonthDayNumber
    }
    else {
        numberOfGhostDaysBefore = 5
    }

   
    let ghostDaysBefore = []
    let allRealDays = []
    if (numberOfGhostDaysBefore > 0) {
        for (let i=0; i<numberOfGhostDaysBefore; i++) {
            ghostDaysBefore.push(<GhostDay key={`ghost-${i}`} />)
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
        } else if (dayData && dayData.class != "" && dayData.class != "wedding") {
            allRealDays.push(
                <FilledCalendarDay time={time} dayClass={dayData.class} photosArr={dayData.photos} dayTitle={dayData.computedTitle}/>
            );
        }
        else if (dayData && dayData.class != "" && dayData.class === "wedding" && dayData.partnerPhoto ) {
            allRealDays.push(
                <WeddingWithPartnerDayTile  dayTitle={dayData.title} groomPhoto={dayData.manPhoto} bridePhoto={dayData.womanPhoto} partnerPhoto={dayData.partnerPhoto} />
            )
        }
        else if (dayData && dayData.class != "" && dayData.class === "wedding" && !dayData.partnerPhoto ) {
            allRealDays.push(
                <WeddingWoPartnerDayTile  dayTitle={dayData.title} groomPhoto={dayData.manPhoto} bridePhoto={dayData.womanPhoto} />
            )
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