import styled from "styled-components";
import ControlledTextInput from "./ControlledTextInput";
import PhotoSelectorTile from "./PhotoSelectorTile";


const StyledChosenPhoto = styled.img`
    width: 10%;
    aspect-ratio: 1/1;
    border: 1px solid black;
    border-radius: 5px;
`

const InputPhotoContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10%;
    margin-right: 10%;
`

const ContainerForPhotos = styled.div`
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    display: flex;
    flex-wrap: wrap;
    min-height: 300px;
    justify-content: space-evenly;
`

export default function PhotoSelector({inputValue, onInputChange, chosenPhotoAddress, photosToShow, onClickFunction}) {
    const mappedPhotos = photosToShow.map((photo) => <PhotoSelectorTile photoFileName={photo.photoFileName} photoName={photo.name} onClickFunction={onClickFunction}/>)
    return (
        <>
            <InputPhotoContainer >
                <ControlledTextInput placeholderValue="Wpisz nazwę zdjęcia, którego chcesz użyć" fieldValue={inputValue} id="eventPhotoSelector" style={{width: "60%", marginLeft: "10%"}} changeFieldValue={onInputChange}/>
                <StyledChosenPhoto src={chosenPhotoAddress} /> 
            </InputPhotoContainer>
            <h2>Sugerowane zdjęcia</h2>
            <ContainerForPhotos>
                {mappedPhotos}
            </ContainerForPhotos>
        </>
    )
}