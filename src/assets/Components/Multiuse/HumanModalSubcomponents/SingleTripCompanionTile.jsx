import styled from 'styled-components'

const StyledPhoto = styled.img`
    width: 75px;
    border: 1px solid black;
    border-radius: 15px;
`


export default function SingleTripCompanionTile({photoUrl, name}) {
    return (
            <StyledPhoto src={photoUrl} alt={name} title={name}/>
    )
}