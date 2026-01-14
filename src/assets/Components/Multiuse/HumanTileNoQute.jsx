import styled from 'styled-components'

export default function HumanTileForSelecting({hasClosingCross, photoUrl, name}) {
    const StyledTile = styled.div`
        width: 26%;
        margin-bottom: 40px;
        border-radius: 35px;
        aspect-ratio: 2/3;
        text-align: center;
        border: 1px solid black;
        font-family: "Comic Sans MS";
    &>img {
        width: 80%;
        border: 1px solid black;
        margin: calc(10% - 1px);
        border-radius: 10px;
        margin-bottom: 0px;
    }
    &>.fullName {
        margin-left: 10%;
        margin-right: 10%;
        text-align: center;
        padding-bottom: 10px;
        font-size: 24px;
        position: relative;
        top:10px;
    }
    &>.closingCross {
        position: absolute;
        
    }
    &:hover {
        background-color: red;
    }`
    return (
        <StyledTile>
            {hasClosingCross && <div className='closingCross'>X</div>}
            <img src={photoUrl} alt={`Zdjęcie ${name}`}></img>
            <div className='fullName'>{name}</div>
        </StyledTile>
    )
}