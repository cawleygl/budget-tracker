import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import AllBudgetsPage from "./pages/AllBudgets";
import ShowBudgetPage from "./pages/ShowBudget";
import BudgetFormPage from "./pages/BudgetForm";
import CostFormPage from "./pages/CostForm";
import AllPaymentMethodsPage from "./pages/AllPaymentMethods";
import AllVendorsPage from "./pages/AllVendors";
import { BrowserRouter, Routes, Route } from "react-router";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/budgets/" element={<AllBudgetsPage />} />
            <Route path="/budgets/new" element={<BudgetFormPage />} />
            <Route path="/budgets/:budgetId" element={<ShowBudgetPage />} />
            <Route path="/budgets/:budgetId/edit" element={<BudgetFormPage />} />
            <Route path="/budgets/:budgetId/costs/new" element={<CostFormPage />} />
            <Route path="/budgets/:budgetId/costs/:costId/edit" element={<CostFormPage />} />
            <Route path="/payments" element={<AllPaymentMethodsPage />} />
            <Route path="/vendors" element={<AllVendorsPage />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  </StrictMode>,
);
