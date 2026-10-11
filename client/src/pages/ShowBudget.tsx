import { useState, useEffect, type SubmitEvent, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import RepeatingBudgetVisuals from "../components/RepeatingBudgetVisuals.tsx";
import { api } from "../utils/api.tsx";
import {
  formatCurrencyFromAmount,
  formatCurrencyFromCost,
  formatBudgetStatus,
  formatDateNumbered,
} from "../utils/tools.tsx";
import {
  calculateBudget,
  calculateRunningTotals,
} from "../utils/calculator.tsx";
import {
  type Budget,
  type Cost,
  type BudgetCalculations,
  BudgetStatuses,
} from "../utils/dataTypes.tsx";
import { Edit, Clear } from "@mui/icons-material";

function ShowBudgetPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [budgetID] = useState<string>(params.budgetId || "");
  const [budgetObj, setBudgetObj] = useState<Budget>({
    createdAt: new Date(),
    id: "",
    name: "",
    amount: 0,
  } as Budget);

  // Repeating budgets have a start or expiration; running budgets have neither.
  // "loading" until the budget has been fetched.
  const [budgetType, setBudgetType] = useState<
    "loading" | "running" | "repeating"
  >("loading");

  const [costList, setCostList] = useState<Cost[]>([]);

  const [budgetCalculations, setBudgetCalculations] =
    useState<BudgetCalculations>({
      status: BudgetStatuses.not_started,
      costTotal: 0,
      amountRemaining: 0,
      expectedCostToDate: 0,
      remainingBudgetPerDay: 0,
      expectedRemainingBudget: 0,
      totalDays: 0,
      daysElapsed: 0,
    });

  useEffect(() => {
    console.log("costList", costList);
  }, [costList]);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const fetchedBudget: Budget = await api.getBudgetById(budgetID);
        setBudgetObj(fetchedBudget as Budget);
        setBudgetType(
          fetchedBudget.start || fetchedBudget.expiration
            ? "repeating"
            : "running",
        );

        // Sort costs by createdAt date
        fetchedBudget.costs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        setCostList(fetchedBudget.costs as Cost[]);
        const calculations: BudgetCalculations = calculateBudget(fetchedBudget);
        setBudgetCalculations(calculations);
      } catch (error) {
        console.error("Budget Page Fetch Error:", error);
      }
    };

    fetchBudget();
  }, [refreshTrigger]);

  const validateIDs = (budgetID: string, costID: string): boolean => {
    if (!budgetID || budgetID === "") {
      console.error("Delete Cost Error: Budget ID Not Found");
      return false;
    }
    if (!costID || costID === "") {
      console.error("Delete Cost Error: Cost ID Not Found");
      return false;
    }
    return true;
  };

  const handleDeleteCost = async (
    event: MouseEvent<HTMLButtonElement>,
    costId: string,
  ): Promise<void> => {
    event?.preventDefault();

    console.log(costId);
    if (!validateIDs) return;

    try {
      await api.deleteCost(budgetID, costId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete Cost Error:", error);
    }
  };

  // Hide the page until the budget has loaded
  if (budgetType === "loading") return null;

  const isRunning = budgetType === "running";
  const runningTotals: number[] = isRunning
    ? calculateRunningTotals(budgetObj.amount, costList)
    : [];
  const currentBalance: number =
    runningTotals.length > 0
      ? runningTotals[runningTotals.length - 1]
      : Number(budgetObj.amount);

  return (
    <>
      {isRunning ? (
        <>
          <h1>
            {budgetObj.name}
            <IconButton
              onClick={() => navigate(`/budgets/${budgetID}/edit`)}
            >
              <Edit />
            </IconButton>
          </h1>
          <p>Current Balance: {formatCurrencyFromAmount(currentBalance)}</p>
        </>
      ) : (
        <>
          <h1>
            {budgetObj.name} - {formatBudgetStatus(budgetCalculations.status)}
            <IconButton
              onClick={() => navigate(`/budgets/${budgetID}/edit`)}
            >
              <Edit />
            </IconButton>
          </h1>
          <RepeatingBudgetVisuals
            budgetAmount={budgetObj.amount}
            start={budgetObj.start}
            expiration={budgetObj.expiration}
            calculations={budgetCalculations}
          />
          {budgetCalculations.status === BudgetStatuses.expired ? (
            <>
              <p>
                <Button variant="contained">Reset Budget</Button>
              </p>
            </>
          ) : (
            <></>
          )}
          {budgetCalculations.status === BudgetStatuses.not_started ? (
            <>
              <p>
                <Button variant="contained">Start Budget</Button>
              </p>
            </>
          ) : (
            <></>
          )}
        </>
      )}

      <Table sx={{ minWidth: 650 }} aria-label="budget table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Amount</TableCell>
            {isRunning && <TableCell>Running Total</TableCell>}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isRunning && (
            <TableRow key="starting-amount">
              <TableCell>{formatDateNumbered(budgetObj.createdAt)}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Starting Amount</TableCell>
              <TableCell>{formatCurrencyFromAmount(budgetObj.amount)}</TableCell>
              <TableCell>{formatCurrencyFromAmount(budgetObj.amount)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
          {costList.map((cost: Cost, index: number) => (
            <TableRow key={cost.id}>
              <TableCell>{formatDateNumbered(cost.createdAt)}</TableCell>
              <TableCell>
                {cost.vendor && cost.vendor.name ? cost.vendor.name : "N/A"}
              </TableCell>
              <TableCell>
                {cost.payment_method && cost.payment_method.name
                  ? cost.payment_method.name
                  : "N/A"}
              </TableCell>
              <TableCell>{cost.description}</TableCell>
              <TableCell>{formatCurrencyFromCost(cost)}</TableCell>
              {isRunning && (
                <TableCell>
                  {formatCurrencyFromAmount(runningTotals[index])}
                </TableCell>
              )}
              <TableCell>
                <ButtonGroup>
                  <IconButton
                    onClick={() =>
                      navigate(`/budgets/${budgetID}/costs/${cost.id}/edit`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={(event) => handleDeleteCost(event, cost.id)}
                  >
                    <Clear />
                  </IconButton>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
          {!isRunning && (
            <TableRow key="total">
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Total</TableCell>
              <TableCell>
                {formatCurrencyFromAmount(budgetCalculations.costTotal)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Button
        variant="contained"
        component="a"
        href={`/budgets/${budgetID}/costs/new`}
      >
        Add Cost
      </Button>
    </>
  );
}

export default ShowBudgetPage;
