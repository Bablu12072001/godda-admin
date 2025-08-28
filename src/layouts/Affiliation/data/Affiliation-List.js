import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";
import MDBox from "components/MDBox";

const AffiliationList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noticeData, setNoticeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_affiliation_all_data", {
        headers: {
          Authorization: `Bearer ${accessToken()}`,
        },
      });
      setNoticeData(response.data["body-json"].body);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to fetch data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = async (noticeId) => {
    handleMenuClose();
    try {
      if (!noticeId) {
        Swal.fire("Error", "The record ID is missing.", "error");
        return;
      }

      await axios.post("https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_delete_affiliations", {
        data: { id: noticeId },
        headers: {
          Authorization: `Bearer ${accessToken()}`,
        },
      });

      setNoticeData((prev) => prev.filter((item) => item.id !== noticeId));
      Swal.fire("Deleted!", "The record has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleEdit = () => {
    setEditData({
      id: selectedItem.id,
      title: selectedItem.title,
      description: selectedItem.description,
      date: selectedItem.date,
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        id: editData.id,
        title: editData.title,
        description: editData.description,
        date: editData.date,
      };

      const response = await axios.post("https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_update_affiliations", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken()}`,
        },
      });

      if (response.status === 200) {
        Swal.fire("Updated!", "The record has been updated.", "success");
        setEditDialogOpen(false);
        fetchData();
      } else {
        Swal.fire("Error", "Server did not accept the update request.", "error");
      }
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire("Error", "Failed to update the record.", "error");
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <MDBox component="thead">
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </MDBox>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              noticeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedItem?.id === item.id} onClose={handleMenuClose}>
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDelete(item.id)}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={noticeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Affiliation</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
          <TextField
            label="Date"
            fullWidth
            margin="dense"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            helperText="Format: DD/MM/YYYY"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AffiliationList;
