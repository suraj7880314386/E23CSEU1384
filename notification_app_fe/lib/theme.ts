import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a73e8", // Google Blue
      light: "#e8f0fe",
      dark: "#1557b0",
    },
    secondary: {
      main: "#d93025", // Google Red (Priority)
      light: "#fce8e6",
      dark: "#a50e0e",
    },
    background: {
      default: "#F6F8FC",
      paper: "#FFFFFF",
    },
    error: { main: "#d93025" },
    warning: { main: "#f29900" },
    success: { main: "#1e8e3e" },
    info: { main: "#1a73e8" },
    text: {
      primary: "#202124",
      secondary: "#5f6368",
    },
    divider: "#f1f3f4",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 500, letterSpacing: "0" },
    h5: { fontWeight: 400, fontSize: "1.375rem" },
    h6: { fontWeight: 500, fontSize: "1.125rem" },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, fontSize: "0.875rem" },
    body1: { fontSize: "0.875rem" }, // Gmail uses denser text
    body2: { fontSize: "0.875rem" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F6F8FC",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #f1f3f4",
          borderRadius: 0,
          backgroundColor: "#ffffff",
          "&:last-child": {
            borderBottom: "none",
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: "none", 
          fontWeight: 500, 
          borderRadius: 24,
          padding: "6px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
          }
        },
        contained: {
          "&:hover": {
            boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
          borderRadius: 16,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 4,
          height: 24,
        }
      }
    }
  },
});

export default theme;
