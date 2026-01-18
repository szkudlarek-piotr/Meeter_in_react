import styled from "styled-components";

const StyledOptionsContainer = styled.div`
    margin-top:20px;
    margin-bottom: 30px;
    display:flex;
    margin-left:10%;
    margin-right: 10%;
    justify-content: space-evenly;
`

export default function RadioOptionsPicker({ header, options, chosenOptionName, onChangeFunction, name="defaultPickerNAme" }) {
  return (
    <>
      <h2>{header}</h2>
      <StyledOptionsContainer>
        {options.map(option => (
          <label key={option.value}>
            <input
              type="radio"
              name="photoSource"
              value={option.value}
              checked={chosenOptionName == option.value}
              onChange={onChangeFunction}
              name={name}
            />
            {option.text}
          </label>
        ))}
      </StyledOptionsContainer>
    </>
  );
}
