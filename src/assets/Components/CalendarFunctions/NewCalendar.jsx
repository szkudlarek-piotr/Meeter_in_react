import styled from "styled-components";
import CalendarMonth from "./CalendarMonth";
import { useEffect, useState } from "react";




export default function NewCalendar() {
    const [year, setYear] = useState(2026);
    const [calendarData, setCalendarData] = useState({});
    const [time, setTime] = useState(0)

    useEffect(() => {
        const getYearData = async () => {
            const res = await fetch(`http://localhost:3000/get-calendar?year=${year}`);
            const yearData = await res.json();
            setCalendarData(yearData);
        };
        getYearData();
    }, [year]);


    //odliczanie liczby sekund od otwarcia modalu
    useEffect(() => {
        const start = Date.now()
        
        const interval = setInterval(() => {
            const seconds = Math.floor((Date.now() - start) / 1000)
            setTime(seconds)
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const getMonthData = (month) =>
        Object.fromEntries(
            Object.entries(calendarData).filter(
                ([dateString]) =>
                    dateString.substring(5, 7) === String(month).padStart(2, "0")
            )
        );

    if (Object.keys(calendarData).length === 0) {
        return <div>Loading...</div>;
    }

    const allMonths = Array.from({ length: 12 }, (_, i) => (
        <CalendarMonth
            key={i + 1}
            year={year}
            month={i + 1}
            monthData={getMonthData(i + 1)}
            time={time}
        />
    ));

    return <>{allMonths}</>;
}
