import { styled } from ".."

export const Button = styled('button', {
  display: 'inline-block',
  margin: '1rem 0',
  color: 'white',
  fontWeight: 500,
  fontSize: '1.3rem',
  background: '$btnAmzn',
  letterSpacing: '.02em',
  border: 'none',
  borderRadius: 5,
  padding: '0.8rem 1rem .9rem',
  textShadow: '0 1px rgba(black,.3)',
  boxShadow: '0 0 2px rgba(black,.2)',

  '&:hover': {
    background: 'lighten($btnAmzn, 5%)',
  }
})