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
} from "@mui/material";
import PageHeader from "../components/PageHeader.tsx";
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
      <PageHeader title="Payment Methods" />
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="payment table">
          <TableHead>
            <TableRow>
              <TableCell>Payment</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentList.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Button
                    variant="text"
                    sx={{ fontWeight: 600 }}
                    type="button"
                    onClick={() => handlePaymentNavigate(payment.id)}
                  >
                    {payment.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <ButtonGroup>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/payments/${payment.id}/edit`)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
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
      </TableContainer>
    </>
  );
}

export default ShowPaymentPage;
