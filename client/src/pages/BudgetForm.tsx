import { useState, useEffect, type SubmitEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PostBudgetPayload as ZodPostBudgetPayload } from "../utils/zodSchema.tsx";
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Switch,
  FormControlLabel,
  Paper,
  Stack,
} from "@mui/material";
import PageHeader from "../components/PageHeader.tsx";
import BudgetTypeDescription from "../components/BudgetTypeDescription.tsx";
import { Add } from "@mui/icons-material";
import NumberField from "../components/NumberField.tsx";
import { api } from "../utils/api.tsx";
import {
  type Budget,
  type BudgetPrefill,
  type Cost,
  type Vendor,
  type PaymentMethod,
  type PostCostPayload,
  type PostVendorPayload,
  type PostPaymentMethodPayload,
  type PostBudgetPayload
} from "../utils/dataTypes.tsx";
import { PostCostPayload as ZodPostCostPayload } from "../utils/zodSchema.tsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";

function BudgetFormPage() {
    const params = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const [budgetID] = useState<string>(params.budgetId || "");

  // Values passed in when creating a budget from an existing one (Reset Budget)
  const [prefill] = useState<BudgetPrefill | null>(
    !params.budgetId ? (location.state as BudgetPrefill | null) : null,
  );

  const [budgetName, setBudgetName] = useState<string>(prefill?.name ?? "");
  const [budgetAmount, setBudgetAmount] = useState<number>(
    prefill?.amount ?? 0,
  );
  const [budgetStart, setBudgetStart] = useState<Dayjs | null>(
    dayjs(prefill?.start ?? new Date()),
  );
  const [budgetExpiration, setBudgetExpiration] = useState<Dayjs | null>(
    prefill?.expiration ? dayjs(prefill.expiration) : null,
  );
  // Repeating budgets have a start and expiration; running budgets have neither
  const [isRepeating, setIsRepeating] = useState<boolean>(true);

    useEffect(() => {
    const fetchBudget = async () => {
      try {
        const fetchedBudget: Budget = await api.getBudgetById(budgetID);
        setBudgetName(fetchedBudget.name);
        setBudgetAmount(fetchedBudget.amount);
        setBudgetStart(fetchedBudget.start ? dayjs(fetchedBudget.start) : null);
        setBudgetExpiration(
          fetchedBudget.expiration ? dayjs(fetchedBudget.expiration) : null,
        );
        setIsRepeating(!!fetchedBudget.start || !!fetchedBudget.expiration);
        console.log("---------- BUDGET SET ----------");
        console.log(budgetID);
        console.log(fetchedBudget.name);
        console.log(fetchedBudget.amount);
        console.log(fetchedBudget.start);
        console.log(fetchedBudget.expiration);
      } catch (error) {
        console.error("Cost Fetch Error:", error);
      }
    };

    if (budgetID && budgetID !== "") fetchBudget();
  }, [budgetID]);

  const handleSubmitBudget = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event?.preventDefault();

    try {
      const formData = new FormData(event.target);
      const formValues = ZodPostBudgetPayload.parse({
        name: formData.get("name"),
        amount: formData.get("amount"),
      });

      // Running budgets have no start or expiration
      const allValues = {
        name: formValues.name,
        amount: formValues.amount,
        start: isRepeating && budgetStart ? budgetStart.toDate() : null,
        expiration:
          isRepeating && budgetExpiration ? budgetExpiration.toDate() : null,
      } as PostBudgetPayload;

      let navigateBudgetID;
      if (!budgetID || budgetID === "") {
        const { id: budgetID } = await api.createBudget(allValues);
        navigateBudgetID = budgetID;
        console.log("Create Budget:", );
      } else {
        console.log(
          "Update Budget:",
          await api.updateBudget(budgetID, allValues),
          navigateBudgetID = budgetID
        );
      }
      navigate(`/budgets/${navigateBudgetID}/`);

    } catch (error) {
      console.error("Create Budget Page Submit Error:", error);
    }
  };

  return (
    <>
      <PageHeader title={`${budgetID ? "Edit" : "Add"} Budget`} />
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start" }}
      >
        <Paper variant="outlined" sx={{ p: 3, flex: "1 1 360px", maxWidth: 560 }}>
          <form onSubmit={handleSubmitBudget}>
            <Stack spacing={2.5}>
              <TextField
                variant="outlined"
                label="Name"
                id="name"
                name="name"
                type="text"
                value={budgetName}
                onChange={(event) => setBudgetName(event.target.value)}
                required
              />

              <NumberField
                label={isRepeating ? "Amount" : "Starting Amount"}
                id="amount"
                name="amount"
                min={0}
                step={0.01}
                value={budgetAmount}
                onValueChange={(value) => setBudgetAmount(value ?? 0)}
                required
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={isRepeating}
                    onChange={(event) => setIsRepeating(event.target.checked)}
                  />
                }
                label={isRepeating ? "Repeating" : "Running"}
              />

              {isRepeating && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start"
                      name="start"
                      value={budgetStart}
                      maxDate={budgetExpiration ?? undefined}
                      onChange={(date) => setBudgetStart(date ?? null)}
                      slotProps={{
                        textField: { required: true, fullWidth: true },
                      }}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Expiration"
                      name="expiration"
                      value={budgetExpiration}
                      minDate={budgetStart ?? undefined}
                      onChange={(date) => setBudgetExpiration(date ?? null)}
                      slotProps={{
                        textField: { required: true, fullWidth: true },
                      }}
                    />
                  </LocalizationProvider>
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
        <Box sx={{ flex: "1 1 280px", maxWidth: 440 }}>
          <BudgetTypeDescription isRepeating={isRepeating} />
        </Box>
      </Box>
    </>
  );
}

export default BudgetFormPage;
