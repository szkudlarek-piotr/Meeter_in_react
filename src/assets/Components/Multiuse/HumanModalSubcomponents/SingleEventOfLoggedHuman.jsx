import styled from 'styled-components'

const EventStyle = styled.div`
    margin-bottom: 1.5rem;
    border-bottom: 4px dashed black;
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
    &:last-of-kind {
        border-bottom: none;
    }
`
    const HumanSquareInEvent = styled.img`
        width: 10%;
        aspect-ratio: 1/1;
        border: 1px solid black;
        border-radius: 5px;
        justify-content: space-evenly;
        margin: 10px;
    `

export default function SingleEventOfLoggedHuman({shortDesc, place, date, longDesc, mappedHumans}) {
    return (
        <EventStyle>
            <h2 style={{marginTop: "0px", marginBottom: "2px"}}>{shortDesc}</h2>
            <h3 style={{marginTop: "0px", marginBottom: "2px"}}>{place}</h3>
            <h3 style={{marginTop: "0px", marginBottom: "2px"}}>{date}</h3>
            <p>{longDesc}</p>
            <div>
                {mappedHumans}
            </div>
        </EventStyle>
    )
}