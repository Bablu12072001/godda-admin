import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

const EnquiriesTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contactData, setContactData] = useState([]);
  const [pageReload, setPageRelaod] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/get_all_office", {
          headers: {
            Authorization: accessToken(),
          },
        });
        setContactData(response.data["body-json"].body);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchData();
  }, [pageReload]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (officeName) => {
    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete record using delete API
        const temp = await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/delete_office", {
          headers: {
            Authorization: accessToken(),
          },
          data: { officeName },
        });
        console.log("Delete", temp);

        // Trigger reload to update the table
        setPageRelaod(!pageReload);
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        Swal.fire("Error", "An error occurred while deleting the record.", "error");
      }
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <MDBox component="thead">
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>District Office Name</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </MDBox>
          <TableBody>
            {contactData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact, index) => (
              <TableRow key={contact.officeName}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contact.officeName}</TableCell>
                <TableCell>{contact.block}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  <Button variant="contained" color="info" onClick={() => handleDelete(contact.officeName)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contactData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default EnquiriesTable;
