import styled from 'styled-components'

const StyledNumberInput = styled.input`
    width: 80%;
    height: 50px;
    font-size: 20px;

`
export default function ControlledNumberInput({value, onchangeFunction, id}) {
    return (
        <StyledNumberInput type="number" value={value} onChange={(e) => onchangeFunction(e.target.value)} id={id}/>
    )
}