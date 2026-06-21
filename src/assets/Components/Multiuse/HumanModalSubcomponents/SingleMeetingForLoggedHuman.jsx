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
            <h2 style={{marginTop: "0px", marginBottom: "2px"}}>{shortDesc}</h2>
            <h3 style={{marginTop: "0px", marginBottom: "2px"}}>{place}</h3>
            <h3 style={{marginTop: "0px", marginBottom: "2px"}}>{date}</h3>
            <p>{longDesc}</p>
            <div>
                {mappedHumans}
            </div>
        </MeetingStyle>
    )
}