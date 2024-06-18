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
import MDTypography from "components/MDTypography";

const ContactsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_contact_us_all_data", {
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
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (conid) => {
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
        await axios.delete(`https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_contact_us_delete `, {
          data: { id: conid },
          headers: {
            Authorization: accessToken(),
          },
        });

        // Remove the deleted record from the state
        setContactData((prevData) => prevData.filter((contact) => contact.conid !== conid));

        Swal.fire("Deleted!", "The record has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting contact:", error);
        Swal.fire("Error", "An error occurred while deleting the record.", "error");
      }
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          {/* <TableHead> */}
          <MDBox component="thead">
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>District</TableCell>
              <TableCell>subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </MDBox>
          {/* </TableHead> */}
          <TableBody>
            {contactData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact, index) => (
              <TableRow key={contact.conid}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.district}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>{contact.message}</TableCell>
                <TableCell>{contact.Date}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    // color="secondary"
                    onClick={() => handleDelete(contact.conid)}
                  >
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

export default ContactsTable;
