import styled from "styled-components";
import DropdownOptionForPlace from './DropdownOptionForPlace.jsx'
import SimpleTextInput from "../../SimpleTextInput.jsx";

const StyledDropdown = styled.div`
    width:80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 20px;
    >.containerForOptions {
        max-height: 240px;
        overflow-y: auto;
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
        <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #030303ff",
                fontSize: "1rem",
                marginBottom: "6px"
            }}
        />
        <div className="containerForOptions">
            {choicesOptions}
        </div>
        
        </StyledDropdown>
    )
}