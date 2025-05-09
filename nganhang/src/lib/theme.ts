"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1876d0",
    },
    secondary: {
      main: "#4e6d9c",
    },
    background: {
      default: "#f0f0f0",
    },
  },
  typography: {
    fontFamily: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px",
        },
      },
    },
  },
});

export default theme;
