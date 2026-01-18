import styled from "styled-components"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom";

const StyledDiv = styled.div`
  position: fixed;          /* uniezależnia od formularza */
  top: 20px;                /* odległość od góry ekranu */
  right: 20px;              /* odległość od prawej krawędzi */
  width: 250px;             /* szerokość powiadomienia */
  padding: 15px;            /* trochę paddingu */
  font-size: 14px;
  background-color: ${props => {
    if (props.status === "1") return "#5FFF7F";
    if (props.status === "0") return "#fa6969";
    if (props.status === "-1") return "#f1f135";
  }};
  border: 1px solid black;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 9999;
`

export default function InsertResultModal({ messageText, decayTime = 5000, status }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), decayTime);
    return () => clearTimeout(timer);
  }, [decayTime]);

  if (!isVisible) return null;

  return createPortal(
    <StyledDiv status={status}>
      {messageText}
    </StyledDiv>,
    document.body
  );
}
