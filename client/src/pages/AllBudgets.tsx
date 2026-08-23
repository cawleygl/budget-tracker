import { useState, useEffect, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import { api } from "../utils/api.tsx";
import type { Budget } from "../utils/dataTypes.tsx";
import { formatCurrency, formatDateNumbered } from "../utils/tools.tsx";
import { Edit, Clear } from "@mui/icons-material";

function ShowBudgetPage() {
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [budgetList, setBudgetList] = useState<Budget[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const fetchedBudgets: Budget[] = await api.getAllBudgets();
        setBudgetList(fetchedBudgets);
      } catch (error) {
        console.error("Budget Page Fetch Error:", error);
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
      <h1>Budget Tracker</h1>
      <Table sx={{ minWidth: 650 }} aria-label="budget table">
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
            <TableRow key={budget.id}>
              <TableCell>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => handleBudgetNavigate(budget.id)}
                >
                  {budget.name}
                </Button>
              </TableCell>
              <TableCell>{formatCurrency(budget.amount)}</TableCell>
              <TableCell>{formatDateNumbered(budget.expiration)}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <IconButton
                    onClick={() =>
                      navigate(`/budgets/${budget.id}/edit`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
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
    </>
  );
}

export default ShowBudgetPage;
