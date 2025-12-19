import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(11, 107, 203, 1)", // Professional Blue
      contrastText: "#ffffff",
    },
    secondary: {
      main: "rgba(234, 239, 245, 1)", // Light Blue Secondary
      contrastText: "rgba(48, 61, 79, 1)",
    },
    error: {
      main: "rgba(223, 62, 62, 1)",
    },
    warning: {
      main: "rgba(245, 166, 10, 1)",
    },
    info: {
      main: "rgba(13, 167, 232, 1)",
    },
    success: {
      main: "rgba(34, 195, 117, 1)",
    },
    text: {
      primary: "rgba(29, 37, 48, 1)",
      secondary: "rgba(109, 118, 130, 1)",
    },
    background: {
      default: "rgba(249, 250, 251, 1)",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "system-ui",
      "Avenir",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.5rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
        },
      },
    },
  },
});

export default theme;
