import styled from "styled-components";
import DropdownOptionForPlace from './DropdownOptionForPlace.jsx'
import ControlledTextInput from "./ControlledTextInput.jsx";

const StyledDropdown = styled.div`
    width:100%;
    margin-bottom: 20px;
    
    >.containerForOptions {
        max-height: 240px;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        overflow-y: auto;
        border-bottom: 1px solid black;
    }
`

export default function DropdownMenuForPlace({inputValue, onInputChange, choiceOptions, placeholder, onOptionDoubleClick}) {
    const choicesOptions = choiceOptions.map((place) => 
        <DropdownOptionForPlace
            name={place.place_name}
            category={place.category}
            id={place.id}
            key={place.id}
            onDoubleClick={() => onOptionDoubleClick(place)}
        />
    )
    return (
        <StyledDropdown>
        <ControlledTextInput fieldValue={inputValue} changeFieldValue={onInputChange} placeholderValue={placeholder}/>
        <div className="containerForOptions">
            {choicesOptions}
        </div>
        
        </StyledDropdown>
    )
}