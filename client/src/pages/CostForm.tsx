import { useState, useEffect, type SubmitEvent, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
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
  type Cost,
  type Vendor,
  type PaymentMethod,
  type PostCostPayload,
  type PostVendorPayload,
  type PostPaymentMethodPayload,
} from "../utils/dataTypes.tsx";
import { PostCostPayload as ZodPostCostPayload } from "../utils/zodSchema.tsx";

function CostFormPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [budgetID] = useState<string>(params.budgetId || "");
  const [costID] = useState<string>(params.costId || "");

  const [costDescription, setCostDescription] = useState<string>("");
  const [costAmount, setCostAmount] = useState<number>(0);

  const [checkedVendor, setCheckedVendor] = useState<string>("");
  const [vendorEntry, setVendorEntry] = useState<string>("");
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  const [checkedPaymentMethod, setCheckedPaymentMethod] = useState<string>("");
  const [paymentMethodEntry, setPaymentMethodEntry] = useState<string>("");
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>(
    [],
  );

  useEffect(() => {
    const fetchCost = async () => {
      try {
        const fetchedCost: Cost = await api.readCost(budgetID, costID);
        setCostDescription(fetchedCost.description);
        setCostAmount(fetchedCost.amount);
        setCheckedVendor(fetchedCost.vendor.id);
        setCheckedPaymentMethod(fetchedCost.payment_method.id);
        console.log("---------- COST SET ----------");
        console.log(budgetID);
        console.log(costID);
        console.log(fetchedCost.description);
        console.log(fetchedCost.amount);
      } catch (error) {
        console.error("Cost Fetch Error:", error);
      }
    };

    if (budgetID && budgetID !== "" && costID && costID !== "") fetchCost();
  }, [refreshTrigger, budgetID, costID]);

  useEffect(() => {
    const fetchAllVendors = async () => {
      try {
        const fetchedVendors: Vendor[] = await api.getAllVendors();
        setVendorList(fetchedVendors as Vendor[]);
      } catch (error) {
        console.error("All Vendors Fetch Error:", error);
      }
    };
    const fetchAllPaymentMethods = async () => {
      try {
        const fetchedPaymentMethods: PaymentMethod[] =
          await api.getAllPaymentMethods();
        setPaymentMethodList(fetchedPaymentMethods as PaymentMethod[]);
      } catch (error) {
        console.error("All Payment Methods Fetch Error:", error);
      }
    };

    fetchAllVendors();
    fetchAllPaymentMethods();
  }, [refreshTrigger]);

  const handleSubmitCost = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event?.preventDefault();

    try {
      const formData = new FormData(event.target);
      const formValues = ZodPostCostPayload.parse({
        description: formData.get("description"),
        amount: formData.get("amount"),
      });

      const allValues = {
        description: formValues.description,
        amount: formValues.amount,
        vendor: checkedVendor || undefined,
        payment_method: checkedPaymentMethod || undefined,
      } as PostCostPayload;

      if (!budgetID || budgetID === "") throw new Error("No Budget ID Found");

      if (!costID || costID === "") {
        console.log("Create Cost:", await api.createCost(budgetID, allValues));
      } else {
        console.log(
          "Update Cost:",
          await api.updateCost(budgetID, costID, allValues),
        );
      }
      navigate(`/budgets/${budgetID}/`);
    } catch (error) {
      console.error("Cost Form Submit Error:", error);
    }
  };

  const refreshPaymentMethods = (): void => {
    setPaymentMethodEntry("");
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleCheckPaymentMethod = (id: string): void => {
    if (checkedPaymentMethod === id) {
      setCheckedPaymentMethod("");
      return;
    }
    setCheckedPaymentMethod(id);
  };
  const handleCreatePaymentMethod = async (
    event: MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event?.preventDefault();

    if (!paymentMethodEntry) {
      console.log("Empty Payment Method");
      return;
    }

    const foundPaymentMethod: PaymentMethod | undefined =
      paymentMethodList.find(
        (paymentMethod) => paymentMethod.name === paymentMethodEntry,
      );
    if (foundPaymentMethod) {
      setCheckedPaymentMethod(foundPaymentMethod.id);
      refreshPaymentMethods();
      return;
    }

    console.log(
      await api.createPaymentMethod({
        name: paymentMethodEntry,
      } as PostPaymentMethodPayload),
    );

    refreshPaymentMethods();
  };

  const refreshVendors = (): void => {
    setVendorEntry("");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCheckVendor = (id: string): void => {
    if (checkedVendor === id) {
      setCheckedVendor("");
      return;
    }
    setCheckedVendor(id);
  };
  const handleCreateVendor = async (
    event: MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event?.preventDefault();

    if (!vendorEntry) {
      console.log("Empty Vendor");
      return;
    }

    const foundVendor: Vendor | undefined = vendorList.find(
      (vendor) => vendor.name === vendorEntry,
    );
    if (foundVendor) {
      setCheckedVendor(foundVendor.id);
      refreshVendors();
      return;
    }

    const { id: vendorID } = await api.createVendor({
      name: vendorEntry,
    } as PostVendorPayload);
    refreshVendors();
    console.log("Create Vendor ID", vendorID);
    setCheckedVendor(vendorID);
  };

  return (
    <>
      <h1>{costID ? "Edit" : "Add"} Cost</h1>
      <form onSubmit={handleSubmitCost}>
        <TextField
          variant="outlined"
          label="Description"
          id="description"
          name="description"
          type="text"
          value={costDescription}
          onChange={(event) => setCostDescription(event.target.value)}
          required
        />

        <NumberField
          label="Amount"
          id="amount"
          name="amount"
          min={0}
          step={0.01}
          value={costAmount}
          onValueChange={(value) => setCostAmount(value ?? 0)}
          required
        />

        {/* Payment Method List */}
        <Box>
          <List>
            {paymentMethodList.map((paymentMethod: PaymentMethod) => (
              <ListItem key={paymentMethod.id} disablePadding>
                <ListItemButton
                  onClick={() => handleCheckPaymentMethod(paymentMethod.id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedPaymentMethod === paymentMethod.id}
                      tabIndex={-1}
                      disableRipple
                      slotProps={{
                        input: {
                          "aria-labelledby": `checkbox-list-label-${paymentMethod.name}`,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={paymentMethod.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {
              <ListItem disablePadding>
                <IconButton
                  onClick={(event) => handleCreatePaymentMethod(event)}
                >
                  <Add />
                </IconButton>
                <TextField
                  variant="outlined"
                  label="New Payment Method"
                  id="paymentMethod"
                  name="paymentMethod"
                  type="text"
                  value={paymentMethodEntry}
                  onChange={(event) =>
                    setPaymentMethodEntry(event.target.value)
                  }
                />
              </ListItem>
            }
          </List>
        </Box>

        {/* Vendor List */}
        <Box>
          <List>
            {vendorList.map((vendor: Vendor) => (
              <ListItem key={vendor.id} disablePadding>
                <ListItemButton onClick={() => handleCheckVendor(vendor.id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedVendor === vendor.id}
                      tabIndex={-1}
                      disableRipple
                      slotProps={{
                        input: {
                          "aria-labelledby": `checkbox-list-label-${vendor.name}`,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={vendor.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {
              <ListItem disablePadding>
                <IconButton onClick={(event) => handleCreateVendor(event)}>
                  <Add />
                </IconButton>
                <TextField
                  variant="outlined"
                  label="New Vendor"
                  id="vendor"
                  name="vendor"
                  type="text"
                  value={vendorEntry}
                  onChange={(event) => setVendorEntry(event.target.value)}
                />
              </ListItem>
            }
          </List>
        </Box>

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </>
  );
}

export default CostFormPage;
