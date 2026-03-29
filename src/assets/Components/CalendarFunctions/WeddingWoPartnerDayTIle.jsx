import styled from 'styled-components'

const WedingWoPartnerTile = styled.div`    
    display: flex;
    background-color: #ec64de;
    align-items: center;
    position: relative;
    justify-content: center;
    margin-left: 1%;
    margin-right: 1%;
    width: calc(11% - 2px);
    aspect-ratio: 1/1;
    border: 2px solid black;
    margin-bottom: 10px;
    border-radius: 15px;
    &>.groomPhoto {
        width: 30%;
        left: 12.5%;
        top: 12.5%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }
    &>.bridePhoto {
        width: 30%;
        left: 62.5%;
        top: 57.5%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }      
    
    
    `

export default function WeddingWoPartnerDayTile({dayTitle, groomPhoto, bridePhoto}) {
    return (
        <WedingWoPartnerTile title={dayTitle}>
            <img className='groomPhoto' src={groomPhoto} />

            <img src="http://localhost:3000/functional-photos/rings.png" style={{width: "30%", left:"36%", top:"38%", position: "absolute"}} />
            <img className='bridePhoto' src={bridePhoto} />
        </WedingWoPartnerTile>
    )
}