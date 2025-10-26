import  styled from 'styled-components'
const MenuContainer = styled.nav`
        background-color: #f4f4f4;
        min-height: 1200px;
        width: ${(props) => props.width};
        padding: 0px;
        display: flex;
        flex-direction: column;
    `

export default function MenuElement({withHeader, width, children}) {

    return (
    <MenuContainer style={{width}}>
        {withHeader && <h2>Menu</h2>}
        {children}
    </MenuContainer>)
}