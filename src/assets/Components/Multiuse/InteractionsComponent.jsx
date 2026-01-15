import styled from "styled-components"

const InteractionCOntainer = styled.div`
    width: 90%;
    border-bottom: 1px dotted black;
    &>h3 {
        margin-bottom: 5px;
        margin-top: 5px;
    }
    &>h4 {
        margin-top: 5px;
    }
`

export default function InterationComponent({shortDesc, date, place, longDesc}) {
    return (
        <InteractionCOntainer>
            <h3>{shortDesc}</h3>
            <h4>{date}</h4>
            {place && <h4>{place}</h4>}
            {longDesc}
        </InteractionCOntainer>
    )
}