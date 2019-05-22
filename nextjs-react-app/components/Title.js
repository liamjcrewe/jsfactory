import styled from 'styled-components'

const StyledH1 = styled.h1`
  text-decoration: underline ${props => props.theme.colors.tertiary};
`

const Title = props => <StyledH1>{props.children}</StyledH1>

export default Title
