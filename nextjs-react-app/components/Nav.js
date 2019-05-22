import Link from 'next/link'
import styled from 'styled-components'

const StyledLink = styled.a`
  margin-right: 10px;

  &:hover {
    border-bottom: 2px solid ${props => props.theme.colors.tertiary};
    cursor: pointer;
  }
`

const Nav = () => (
  <div>
    <Link href='/'>
      <StyledLink>Home</StyledLink>
    </Link>
    <Link href='/about'>
      <StyledLink>About</StyledLink>
    </Link>
  </div>
)

export default Nav
