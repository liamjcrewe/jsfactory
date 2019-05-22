import styled from 'styled-components'

import Nav from './Nav'

const StyledLayout = styled.div`
  height: 100vh;
  padding: 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
`

const Layout = props => (
  <StyledLayout>
    <Nav />
    {props.children}
  </StyledLayout>
)

export default Layout
