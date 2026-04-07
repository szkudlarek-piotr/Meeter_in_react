import styled from 'styled-components'

const MeetingStyle = styled.div`
    margin-bottom: 1.5rem;
    border-bottom: 4px dashed black;
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
    &:last-of-kind {
        border-bottom: none;
    }
`


export default function SingleMeetingOfLoggedHuman({shortDesc, place, date, longDesc, mappedHumans}) {
    return (
        <MeetingStyle>
            <h2>{shortDesc}</h2>
            <h3>{place}</h3>
            <h3>{date}</h3>
            <p>{longDesc}</p>
            <div>
                {mappedHumans}
            </div>
        </MeetingStyle>
    )
}