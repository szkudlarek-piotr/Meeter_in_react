import styled from "styled-components";

const Main = styled.main`
    width: calc(${(props) => props.width} - 2px);
    min-height:1200px;
    padding: 0px;
    margin-top:30px;
    
`
export default function MainContent({ children, width }) {
    return <Main width={width}>{children}</Main>;
}