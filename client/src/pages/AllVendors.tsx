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
import type { Vendor } from "../utils/dataTypes.tsx";
import { Edit, Clear } from "@mui/icons-material";

function ShowVendorPage() {
  const navigate = useNavigate();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const fetchedVendors: Vendor[] = await api.getAllVendors();
        setVendorList(fetchedVendors);
      } catch (error) {
        console.error("Vendor Page Fetch Error:", error);
      }
    };
    fetchVendors();
  }, [refreshTrigger]);

  function handleVendorNavigate(id: string) {
    navigate(`${id}`);
  }

  const handleDeleteVendor = async (
    event: MouseEvent<HTMLButtonElement>,
    vendorId: string,
  ): Promise<void> => {
    event?.preventDefault();

    console.log(vendorId);
    if (!vendorId || vendorId === "") {
      throw new Error("Vendor ID Not Found");
    }

    try {
      await api.deleteVendor(vendorId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete Vendor Error:", error);
    }
  };

  return (
    <>
      <PageHeader title="Vendors" />
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="vendor table">
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendorList.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell>
                  <Button
                    variant="text"
                    sx={{ fontWeight: 600 }}
                    type="button"
                    onClick={() => handleVendorNavigate(vendor.id)}
                  >
                    {vendor.name}
                  </Button>
                </TableCell>
                <TableCell>
                  <ButtonGroup>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/vendors/${vendor.id}/edit`)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(event) => handleDeleteVendor(event, vendor.id)}
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

export default ShowVendorPage;
