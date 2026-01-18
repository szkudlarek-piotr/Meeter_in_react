import styled from 'styled-components'
import ControlledTextInput from './ControlledTextInput'

export default function ControledTextInputWithHeader({headerText, placeholderValue, fieldValue, changeFieldValueFunction}) {
    return (
    <div>
        <h2>{headerText}</h2>
        <ControlledTextInput style={{height: "30px", minWidth: "100px"}} type="text" value={fieldValue} placeholderValue={placeholderValue} onChange={(e) => changeFieldValueFunction(e.target.value)}/>
    </div>
    )
}