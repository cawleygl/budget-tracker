import { useState, useEffect, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  ButtonGroup,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import PageHeader from "../components/PageHeader.tsx";
import { api } from "../utils/api.tsx";
import { type Budget, BudgetTypes } from "../utils/dataTypes.tsx";
import { formatCurrencyFromAmount, formatDateNumbered } from "../utils/tools.tsx";
import { Edit, Clear, Add } from "@mui/icons-material";

function ShowBudgetPage() {
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  // True until the first fetch finishes (whether it succeeds or fails)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const fetchedBudgets: Budget[] = await api.getAllBudgets();
        setBudgetList(fetchedBudgets);
      } catch (error) {
        console.error("Budget Page Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudgets();
  }, [refreshTrigger]);

  function handleBudgetNavigate(id: string) {
    navigate(`${id}`);
  }

  const handleDeleteBudget = async (
    event: MouseEvent<HTMLButtonElement>,
    budgetId: string,
  ): Promise<void> => {
    event?.preventDefault();

    console.log(budgetId);
    if (!budgetId || budgetId === "") {
      throw new Error("Budget ID Not Found");
    }

    try {
      await api.deleteBudget(budgetId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete Budget Error:", error);
    }
  };

  return (
    <>
      <PageHeader
        title="Budgets"
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/budgets/new")}
          >
            New Budget
          </Button>
        }
      />
      {isLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", py: 6 }}
          role="status"
          aria-label="Loading budgets"
        >
          <CircularProgress />
        </Box>
      ) : (
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="budget table">
          <TableHead>
            <TableRow>
              <TableCell>Budget</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetList.map((budget) => (
              <TableRow key={budget.id} hover>
                <TableCell>
                  <Button
                    variant="text"
                    sx={{ fontWeight: 600 }}
                    type="button"
                    onClick={() => handleBudgetNavigate(budget.id)}
                  >
                    {budget.name}
                  </Button>
                </TableCell>
                <TableCell>{formatCurrencyFromAmount(budget.amount)}</TableCell>
                <TableCell>{formatDateNumbered(
                    budget.type === BudgetTypes.running ? null : budget.expiration,
                  )}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/budgets/${budget.id}/edit`)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(event) => handleDeleteBudget(event, budget.id)}
                    >
                      <Clear />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </>
  );
}

export default ShowBudgetPage;
