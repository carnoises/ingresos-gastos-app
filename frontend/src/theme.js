import { createTheme } from '@mui/material/styles';
import { green, red, grey, blue } from '@mui/material/colors'; // Importar 'blue'

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700], // Un azul más intenso
    },
    secondary: {
      main: '#FFC107', // Un amarillo/ámbar
    },
    error: {
      main: red[500],
    },
    success: {
      main: green[500],
    },
    background: {
      default: grey[100], // Un gris muy claro para el fondo general
      paper: '#FFFFFF', // Blanco para los componentes Paper/Card
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#333',
    },
    h5: {
      fontWeight: 500,
      color: '#444',
    },
    h6: {
      fontWeight: 500,
      color: '#555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes más redondeados
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px', // Espacio consistente entre campos
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bordes más redondeados para Paper
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra suave
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Eliminar sombra por defecto
          borderBottom: `1px solid ${grey[200]}`, // Borde inferior sutil
        },
      },
    },
  },
});

export default theme;