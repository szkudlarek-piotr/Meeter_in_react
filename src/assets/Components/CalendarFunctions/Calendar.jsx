import WeekdaysHeader from "./WeekdaysHeader";
import CalendarMonth from "./CalendarMonth";
import HumanModal from '../Multiuse/HumanModal'
export default function Calendar({year}) {

    return (
    <>

        <CalendarMonth month="1" year={year} />
        <CalendarMonth month="2" year={year} />
        <CalendarMonth month="3" year={year} />
        <CalendarMonth month="4" year={year} />
        <CalendarMonth month="5" year={year} />
        <CalendarMonth month="6" year={year} />
        <CalendarMonth month="7" year={year} />
        <CalendarMonth month="8" year={year} />
        <CalendarMonth month="9" year={year} />
        <CalendarMonth month="10" year={year} />
        <CalendarMonth month="11" year={year} />
        <CalendarMonth month="12" year={year} />
    </>
    )
}