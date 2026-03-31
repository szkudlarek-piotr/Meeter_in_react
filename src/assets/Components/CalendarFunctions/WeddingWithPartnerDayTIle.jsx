import styled from 'styled-components'

const WedingWithPartnerTile = styled.div`    
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
        left: 10%;
        top: 10%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }
    &>.bridePhoto {
        width: 30%;
        left: 60%;
        top: 10%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }
    &>.partnerPhoto {
        width: 30%;
        left: 35%;
        top: 65%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }        
    
    
    `

export default function WeddingWithPartnerDayTile({dayTitle, partnerPhoto, groomPhoto, bridePhoto}) {
    return (
        <WedingWithPartnerTile title={dayTitle}>
            <img className='groomPhoto' src={groomPhoto} />
            <img className='bridePhoto' src={bridePhoto} />
            <img src="http://localhost:3000/functional-photos/rings.png" style={{width: "30%", left:"35%", top:"38%", position: "absolute"}} />
            <img className="partnerPhoto" src={partnerPhoto} alt="Zdjęcie partnera weselnego"/> 
        </WedingWithPartnerTile>
    )
}