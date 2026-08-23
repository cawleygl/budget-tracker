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
import type { PaymentMethod } from "../utils/dataTypes.tsx";
import { Edit, Clear } from "@mui/icons-material";

function ShowPaymentPage() {
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [paymentList, setPaymentList] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const fetchedPayments: PaymentMethod[] = await api.getAllPaymentMethods();
        setPaymentList(fetchedPayments);
      } catch (error) {
        console.error("Payment Page Fetch Error:", error);
      }
    };
    fetchPayments();
  }, [refreshTrigger]);

  function handlePaymentNavigate(id: string) {
    navigate(`${id}`);
  }

  const handleDeletePayment = async (
    event: MouseEvent<HTMLButtonElement>,
    paymentId: string,
  ): Promise<void> => {
    event?.preventDefault();

    console.log(paymentId);
    if (!paymentId || paymentId === "") {
      throw new Error("Payment ID Not Found");
    }

    try {
      await api.deletePaymentMethod(paymentId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete Payment Error:", error);
    }
  };

  return (
    <>
      <h1>Payment Methods</h1>
      <Table sx={{ minWidth: 650 }} aria-label="payment table">
        <TableHead>
          <TableRow>
            <TableCell>Payment</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentList.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => handlePaymentNavigate(payment.id)}
                >
                  {payment.name}
                </Button>
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <IconButton
                    onClick={() =>
                      navigate(`/payments/${payment.id}/edit`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={(event) => handleDeletePayment(event, payment.id)}
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

export default ShowPaymentPage;
