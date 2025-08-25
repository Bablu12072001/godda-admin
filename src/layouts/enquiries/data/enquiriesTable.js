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
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { accessToken } from "services/variables";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

const EnquiriesTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contactData, setContactData] = useState([]);
  const [pageReload, setPageReload] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editedContact, setEditedContact] = useState({
    oldOfficeName: "",
    newOfficeName: "",
    block: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/get_all_office", {
          headers: {
            Authorization: accessToken(),
          },
        });
        // console.log("office data", response.data["body-json"].body);
        setContactData(JSON.parse(response.data["body-json"].body));
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
        await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/delete_office", {
          headers: {
            Authorization: accessToken(),
          },
          data: { officeName },
        });
        setPageReload(!pageReload);
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        Swal.fire("Error", "An error occurred while deleting the record.", "error");
      }
    }
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setEditedContact({
      oldOfficeName: contact.officeName,
      newOfficeName: contact.officeName,
      block: contact.block,
      email: contact.email,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    const { oldOfficeName, newOfficeName, email, block } = editedContact;
    try {
      await axios.put(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/eidt_office",
        {
          oldOfficeName,
          newOfficeName,
          email,
          block,
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );
      setEditDialogOpen(false);
      setPageReload(!pageReload);
      Swal.fire("Updated!", "The record has been updated.", "success");
    } catch (error) {
      console.error("Error updating enquiry:", error);
      Swal.fire("Error", "An error occurred while updating the record.", "error");
    }
  };

  const handleMenuOpen = (event, contact) => {
    setSelectedContact(contact);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
                  <IconButton onClick={(event) => handleMenuOpen(event, contact)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedContact?.officeName === contact.officeName} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleEditClick(contact)}>Edit</MenuItem>
                    <MenuItem onClick={() => handleDelete(contact.officeName)}>Delete</MenuItem>
                  </Menu>
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
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="District Office Name"
            type="text"
            fullWidth
            name="newOfficeName"
            value={editedContact.newOfficeName}
            onChange={handleEditChange}
          />
          <TextField margin="dense" label="Block" type="text" fullWidth name="block" value={editedContact.block} onChange={handleEditChange} />
          <TextField margin="dense" label="Email" type="email" fullWidth name="email" value={editedContact.email} onChange={handleEditChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnquiriesTable;
