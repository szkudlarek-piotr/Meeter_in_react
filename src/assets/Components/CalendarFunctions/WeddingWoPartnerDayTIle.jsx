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
        width: 35%;
        left: 10%;
        top: 10%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }
    &>.bridePhoto {
        width: 35%;
        left: 55%;
        top: 55%;
        z-index: 100;
        position: absolute;
        border: 1px solid black;
        border-radius: 5px;
    }
    &>.ringPhoto {
        width: 30%;
        left: 36%;
        top: 38%;
        position: absolute;
        z-index: 101;
    }      
    `


export default function WeddingWoPartnerDayTile({dayTitle, groomPhoto, bridePhoto}) {
    return (
        <WedingWoPartnerTile title={dayTitle}>
            <img className='groomPhoto' src={groomPhoto} />

            <img src="http://localhost:3000/functional-photos/rings.png" className='ringPhoto' />
            <img className='bridePhoto' src={bridePhoto} />
        </WedingWoPartnerTile>
    )
}