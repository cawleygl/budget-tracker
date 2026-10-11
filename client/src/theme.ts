import { createTheme } from "@mui/material/styles";

/**
 * App-wide Material UI theme.
 *
 * Colors (use these via the theme, e.g. color="primary" or sx={{ color: "success.main" }}):
 *  - primary   deep blue    - navbar, main buttons, links
 *  - secondary teal         - supporting accents
 *  - success   green        - on track / credits / healthy balance
 *  - warning   orange       - slightly over pace
 *  - error     red          - over budget / expenses / destructive actions
 *  - background.default is a soft grey-blue page background, with white cards (paper)
 */
const fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

const theme = createTheme({
  palette: {
    primary: {
      main: "#1f5fae",
      light: "#4f86c6",
      dark: "#143f78",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00897b",
      contrastText: "#ffffff",
    },
    success: { main: "#2e7d32" },
    warning: { main: "#ed6c02" },
    error: { main: "#d32f2f" },
    background: {
      default: "#f4f6fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2933",
      secondary: "#52606d",
    },
    divider: "#e1e6ee",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 7 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 600,
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.default,
        }),
      },
    },
  },
});

export default theme;
