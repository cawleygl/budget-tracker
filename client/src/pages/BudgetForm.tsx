import { useState, useEffect, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router";
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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import NumberField from "../components/NumberField.tsx";
import { api } from "../utils/api.tsx";
import {
  type Budget,
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

  const [budgetID] = useState<string>(params.budgetId || "");

  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgetStart, setBudgetStart] = useState<Dayjs>(dayjs(new Date()));
  const [budgetExpiration, setBudgetExpiration] = useState<Dayjs>(dayjs(new Date()));

    useEffect(() => {
    const fetchBudget = async () => {
      try {
        const fetchedBudget: Budget = await api.getBudgetById(budgetID);
        setBudgetName(fetchedBudget.name);
        setBudgetAmount(fetchedBudget.amount);
        setBudgetStart(dayjs(fetchedBudget.start));
        setBudgetExpiration(dayjs(fetchedBudget.expiration));
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
        start: formData.get("start"),
        expiration: formData.get("expiration"),
      });

      const allValues = {
        name: formValues.name,
        amount: formValues.amount,
        start: budgetStart.toDate(),
        expiration: budgetExpiration.toDate(),
      } as PostBudgetPayload;

      let navigateBudgetID;
      if (!budgetID || budgetID === "") {
        const { id: budgetID } = await api.createBudget(formValues);
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
      <h1>{budgetID ? "Edit" : "Add"} Budget</h1>
      <form onSubmit={handleSubmitBudget}>
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
          label="Amount"
          id="amount"
          name="amount"
          min={0}
          step={0.01}
          value={budgetAmount}
          onValueChange={(value) => setBudgetAmount(value ?? 0)}
          required
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start"
            name="start"
            value={budgetStart}
            maxDate={dayjs(budgetExpiration)} 
            onChange={(date) => setBudgetStart(date ?? dayjs())}
            slotProps={{
              textField: { required: true },
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Expiration"
            name="expiration"
            value={budgetExpiration}
            minDate={dayjs(budgetStart)} 
            onChange={(date) => setBudgetExpiration(date ?? dayjs())}
            slotProps={{
              textField: { required: true },
            }}
          />
        </LocalizationProvider>

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </>
  );
}

export default BudgetFormPage;
