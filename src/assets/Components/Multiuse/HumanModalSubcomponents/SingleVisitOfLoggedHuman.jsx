import styled from 'styled-components'

const TripDiv = styled.div`
    margin-bottom: 1.5rem;
    border-bottom: 4px dashed black;
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
    &:last-of-kind {
        border-bottom: none;
    }
`


export default function SingleVisitOfLoggedHuman({visitName, visitDate, longDesc, mappedHumans}) {
    return (
        <TripDiv>
            <h2>{visitName}</h2>
            <h3>{visitDate}</h3>

            <p>{longDesc}</p>
            <div>
                {mappedHumans}
            </div>
        </TripDiv>
    )

} 