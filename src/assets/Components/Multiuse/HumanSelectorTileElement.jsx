import styled from 'styled-components'


    const TileElement = styled.div`
        width: 23%;
        margin: 5%;
        aspect-ratio: 8/9;
        border: 1px solid black;
        border-radius: 20px;

        &>img {
            width: 80%;
            margin: 10%;
            border: 1px solid black;
            border-radius: 20px;
        }
        &>h3 {
            margin-left: 10%;
            margin-right: 10%;
        }
        &>.tileClosingCross {
            position: relative;
            left: 85%;
            width: 10%;
            aspect-ratio: 1/1;
            font-weight: 900;
            border-radius: 50%;
            font-size: 15px;
            border: 1px solid black;
            top: 5%;
            cursor: pointer;
        }
        &:hover {
            background-color: red
        }
    `

export default function HumanSelectorTileElement({humanPhoto, humanName, humanId, onTileClickFunction, tileRemovingFunction}) {

    return (
        <TileElement 
            key={humanId}
            onClick={
                tileRemovingFunction
                    ? undefined
                    : () => onTileClickFunction({
                        name: humanName,
                        photoDir: humanPhoto,
                        id: humanId
                    })
            }>
            {tileRemovingFunction && <div onClick={() => tileRemovingFunction({                        name: humanName,
                        photoDir: humanPhoto,
                        id: humanId})} className='tileClosingCross'>x</div>}
            <img src={`http://localhost:3000${humanPhoto}`} alt={`Zdjęcie ${humanName}`}></img>
            <h3>{humanName}</h3>
        </TileElement>)
}