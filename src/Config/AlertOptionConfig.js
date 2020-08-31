import { transitions, positions } from 'react-alert'

export const alertOptionConfig = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 5000
  }
}