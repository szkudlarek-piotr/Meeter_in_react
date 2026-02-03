import styled from "styled-components";
import SimpleTextInput from "../../SimpleTextInput.jsx";
import DropdownOptionForText from "./DropdownOptionForText.jsx"

const StyledDropdown = styled.div`
    width:80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 20px;
`



export default function DropdownMenuForText({inputValue, onInputChange, choiceOptions, placeholder, onOptionDoubleClick}) {
    const choicesOptions = choiceOptions.map((option) => 
        <DropdownOptionForText
            name={option.name}
            id={option.id}
            key={option.name}
            onDoubleClickFunction={onOptionDoubleClick}
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
                marginBottom: "0px"
            }}
        />
        {choicesOptions}
        </StyledDropdown>
    )
}