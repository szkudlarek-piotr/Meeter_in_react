import { createPortal } from "react-dom";
import styled from "styled-components";


const DayModalBox = styled.div`
  position: fixed;
  inset: 5%;
  background: beige;
  border: 1px solid black;
  padding: 16px;
  border-radius: 30px;
  display: flex;
  height: 90%;           /* wysokość całego modala */
  box-sizing: border-box;
`

export default function DayModal() {
  return createPortal(
    <Backdrop onClick={onClose}>
        <DayModalBox onClick={e => e.stopPropagation()}>

        </DayModalBox>
    </Backdrop>
  )
}