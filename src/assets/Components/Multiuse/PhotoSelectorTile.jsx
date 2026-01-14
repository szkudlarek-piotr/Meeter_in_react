import styled from 'styled-components'


const StyledPhotoContainerElement = styled.div`
    width: 26%;
    margin-top: 20px;
    margin-bottom:20px;
    border: 1px solid black;
    border-radius: 10px;
    &:hover {
        background-color:red;
    }
    &>img {
        margin-top: 20px;
        width: 70%;
        border: 1px solid black;
        border-radius: 10px;
    }
`

export default function PhotoSelectorTile({photoFileName, photoName, onClickFunction}) {
    return (
        <StyledPhotoContainerElement onClick={() => onClickFunction(photoFileName)}>
            <img src={`http://localhost:3000/event-photo/${photoFileName}`} key={photoFileName} />
            <h4>{photoName}</h4>
        </StyledPhotoContainerElement>
    )
}