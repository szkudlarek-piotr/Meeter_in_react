import styled from "styled-components";

const GhostDayStyle = styled.div`
    width: calc(11% + 2px);
    margin-right: 1%;
    margin-left: 1%;
    aspect-ratio: 1/1;
    margin-bottom: 10px;
`
export default function GhostDay() {
    return <GhostDayStyle />
}