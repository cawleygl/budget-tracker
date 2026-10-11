import { useNavigate } from "react-router";
import { Button, Paper, Typography } from "@mui/material";
import { Add, ListAlt } from "@mui/icons-material";
import PageHeader from "../components/PageHeader.tsx";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Welcome to the Budget Tracker" />
      <Paper variant="outlined" sx={{ p: 3, maxWidth: 560 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Track repeating budgets with spending pace, or running budgets that
          carry a balance forward.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ListAlt />}
          onClick={() => navigate("/budgets")}
          sx={{ mr: 1 }}
        >
          View Budgets
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => navigate("/budgets/new")}
        >
          New Budget
        </Button>
      </Paper>
    </>
  );
}

export default HomePage;
