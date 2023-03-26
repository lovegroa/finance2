import {createTheme} from '@mui/material';

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c182f',
      light: '#5f3264',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#eeeeee',
      paper: '#ffffff',
    },
  },

  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1.25rem',
      fontFamily: 'sans-serif',
    },
  },
  shape: {
    borderRadius: 5,
  },
});
