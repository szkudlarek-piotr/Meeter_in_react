import styled from "styled-components";
import DropdownOptionForHuman from './DropdownOptionForHuman.jsx'
import SimpleTextInput from "../SimpleTextInput.jsx";

const StyledDropdown = styled.div`
    width:80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 20px;
`

export default function DropdownMenu({inputValue, onInputChange, choiceOptions, placeholder, onOptionDoubleClick}) {
    const choicesOptions = choiceOptions.map((option) => 
        <DropdownOptionForHuman
            photo={option.photo}
            name={option.name}
            id={option.id}
            key={option.id}
            onDoubleClick={() => onOptionDoubleClick(option)}
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
        {choicesOptions}
        </StyledDropdown>
    )
}