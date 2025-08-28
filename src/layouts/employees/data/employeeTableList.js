import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TablePagination,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { accessToken } from "services/variables";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const leadrshipTableList = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDeletedata, setSelectedItemDeletedata] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit function
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email_id: "",
    employeeId: "",
    officeLevel: "",
    officeName: "",
    subDivision: "",
    block: "",

    department: "",
    designation: "",
    joiningDate: "",
    lastSixDigitOfAadhar: "",
    parentalUnion: "",
    yearlyMemberFreeRemitted: "",
    contactNumber: "",
    district: "",
    employeeType: "",
    transactionNo: "",

    declaration: true,
    sign: {
      name: "l.jpg",
      base64: "",
    },
    image: {
      name: "l.jpg",
      base64: "",
    },
    address: {
      village: "",
      pincode: "",
      city: "",
      state: "",
    },
  });

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleEdit = () => {
    setEditData({
      name: selectedItem.name,
      email_id: selectedItem.email_id,
      employeeId: selectedItem.employeeId,

      officeLevel: selectedItem.officeLevel,
      officeName: selectedItem.officeName,
      subDivision: selectedItem.subDivision,
      block: selectedItem.block,

      department: selectedItem.department,
      designation: selectedItem.designation,
      joiningDate: selectedItem.joiningDate,
      lastSixDigitOfAadhar: selectedItem.lastSixDigitOfAadhar,
      parentalUnion: selectedItem.parentalUnion,
      yearlyMemberFreeRemitted: selectedItem.yearlyMemberFreeRemitted,
      contactNumber: selectedItem.contactNumber,
      district: selectedItem.district,
      employeeType: selectedItem.employeeType,
      transactionNo: selectedItem.transactionNo,

      declaration: true,
      sign: {
        name: "l.jpg",
        base64: "",
      },
      image: {
        name: "l.jpg",
        base64: "",
      },
      address: {
        village: selectedItem.address?.village,
        pincode: selectedItem.address?.pincode,
        city: selectedItem.address?.city,
        state: selectedItem.address?.state,
      },
    });
    setEditDialogOpen(true);
    handleClose();
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/employee_edit", editData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.data["body-json"].statusCode === 200) {
        setNewsData((prevData) => prevData.map((data) => (data?.email_id === selectedItem?.email_id ? { ...data, ...editData } : data)));
        toast.success("Employee edited successfully!");
        setEditDialogOpen(false);
        refreshData();
      } else {
        toast.error("Failed to edit employee.");
      }
    } catch (error) {
      console.error("Error editing employee:", error);
      toast.error("Failed to edit employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = (email_id) => {
    setSelectedItemDeletedata(email_id);
    setOpenConfirmation(true);
    handleClose();
  };

  const handleCancel = () => {
    setSelectedItemDeletedata(null);
    setOpenConfirmation(false);
  };

  const handleDeleteConfirmed = async () => {
    setOpenConfirmation(false);
    try {
      setLoading(true);
      const response = await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/employee_delete", {
        data: { email: selectedItemDeletedata },
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.data && response.data.statusCode === 200) {
        setNewsData((prevData) => prevData.filter((data) => data.email_id !== selectedItemDeletedata));
        console.log("Employee deleted successfully!");
        toast.success("Employee deleted successfully!");
        refreshData();
      } else {
        toast.success("Employee deleted successfully!");
        refreshData();
      }
    } catch (error) {
      toast.error("Please Try Again ", error);
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/employee_by_verification_status",
        {
          isVerified: true, // Fetch all employees initially
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );
      setNewsData(response.data["body-json"].body);
      console.log("This is the employee data ", response);
    } catch (error) {
      console.error("Error fetching news event data:", error);
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  const truncateString = (str, numWords) => {
    const words = str.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    } else {
      return str;
    }
  };
  const capitalizeFirstLetter = (text) => {
    return text?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  };

  return (
    <div>
      {loading && <CircularProgress size={24} sx={{ position: "absolute", left: "50%", top: "50%", marginLeft: "-12px", marginTop: "-12px" }} />}
      <ToastContainer />

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ display: "table-header-group" }}>
            <TableRow>
              <TableCell>Member Id</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Employee Type</TableCell>
              <TableCell>Last Six Digit Aadhar</TableCell>

              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <React.Fragment key={item.email_id}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.employeeId}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Avatar alt="Image" src={item.profile_image} />
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {capitalizeFirstLetter(item.name)}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {capitalizeFirstLetter(item.designation)}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {capitalizeFirstLetter(item.department)}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.joiningDate}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {capitalizeFirstLetter(item.employeeType)}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.lastSixDigitOfAadhar}
                  </TableCell>

                  <TableCell sx={{ fontSize: 12 }}>
                    <IconButton color="inherit" onClick={(e) => handleClick(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedItem?.email_id === item.email_id} onClose={handleClose} elevation={1}>
                      <MenuItem onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(item.email_id)}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                      <MenuItem onClick={() => handleView(item)}>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={newsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <div>
        <Dialog open={detailsModalOpen} onClose={handleDetailsModalClose} maxWidth="md">
          <DialogTitle>Details</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Grid container spacing={2}>
                <Card sx={{ minWidth: 275, margin: 2 }}>
                  <CardHeader title={selectedItem.name} />
                  <CardContent>
                    <Typography variant="body2">
                      <b>Designation:</b> {selectedItem.designation}
                    </Typography>
                    <Typography variant="body2">
                      <b>Department:</b> {selectedItem.department}
                    </Typography>
                    <Typography variant="body2">
                      <b>Joining Date:</b> {selectedItem.joiningDate}
                    </Typography>

                    <Typography variant="body2">
                      <b>Contact Number:</b> {selectedItem.contactNumber}
                    </Typography>
                    <Typography variant="body2">
                      <b>Email ID:</b> {selectedItem.email_id}
                    </Typography>

                    <Typography variant="body2">
                      <b>Address:</b>
                      {selectedItem.address?.pincode}, {selectedItem.address?.state}, {selectedItem.address?.village}, {selectedItem.address?.city}
                    </Typography>
                    <Typography variant="body2">
                      <b>District:</b> {selectedItem.district}
                    </Typography>
                    <Typography variant="body2">
                      <b>Last Six Digit Of Aadhar Number:</b> {selectedItem.lastSixDigitOfAadhar}
                    </Typography>
                    <Typography variant="body2">
                      <b>Office Level:</b> {selectedItem.officeLevel}
                    </Typography>
                    <Typography variant="body2">
                      <b>Sub Division:</b> {selectedItem.subDivision}
                    </Typography>
                    <Typography variant="body2">
                      <b>Block:</b> {selectedItem.block}
                    </Typography>
                    <Typography variant="body2">
                      <b>Office Name:</b> {selectedItem.officeName}
                    </Typography>
                    <Typography variant="body2">
                      <b>Yearly Member Fee Remitted:</b> {selectedItem.yearlyMemberFreeRemitted}
                    </Typography>
                    <Typography variant="body2">
                      <b>Transaction/Ref no:</b> {selectedItem.transactionNo}
                    </Typography>
                    {/* <Typography variant="body2">
                      <b>Password:</b> {selectedItem.password}
                    </Typography> */}
                    {/* <Typography variant="body2">
                    <b>About:</b> {selectedItem.aboutUs}
                  </Typography> */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Images:</Typography>

                      <Chip label="Profile Image" component="a" href={selectedItem.profile_image} target="_blank" clickable />
                      <Chip label="Signature Image" component="a" href={selectedItem.sign_image} target="_blank" clickable />
                      <Chip label="Upload Form" component="a" href={selectedItem.form_file} target="_blank" clickable />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog open={openConfirmation} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this data?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={() => handleDeleteConfirmed()} color="error">
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="md">
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <TextField label="Author" fullWidth margin="normal" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
          <TextField label="Content" fullWidth multiline rows={4} margin="normal" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} aria-labelledby="form-dialog-title">
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>Update details for employee: {editData.name}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <TextField
            margin="dense"
            id="email_id"
            label="Email Address"
            type="email"
            fullWidth
            value={editData.email_id}
            onChange={(e) => setEditData({ ...editData, email_id: e.target.value })}
          />

          <TextField
            margin="dense"
            id="department"
            label="Department"
            type="text"
            fullWidth
            value={editData.department}
            onChange={(e) => setEditData({ ...editData, department: e.target.value })}
          />

          <TextField
            margin="dense"
            id="designation"
            label="Designation"
            type="text"
            fullWidth
            value={editData.designation}
            onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
          />

          <TextField
            margin="dense"
            id="joiningDate"
            label="Joining Date"
            type="date"
            fullWidth
            value={editData.joiningDate}
            onChange={(e) => setEditData({ ...editData, joiningDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            id="lastSixDigitOfAadhar"
            label="Last Six Digits of Aadhar"
            type="text"
            fullWidth
            value={editData.lastSixDigitOfAadhar}
            onChange={(e) => setEditData({ ...editData, lastSixDigitOfAadhar: e.target.value })}
          />

          <TextField
            margin="dense"
            id="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            value={editData.contactNumber}
            onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            id="employeeType"
            label="Employee Type"
            type="text"
            fullWidth
            value={editData.employeeType}
            onChange={(e) => setEditData({ ...editData, employeeType: e.target.value })}
          />
          <TextField
            margin="dense"
            id="district"
            label="District"
            type="text"
            fullWidth
            value={editData.district}
            onChange={(e) => setEditData({ ...editData, district: e.target.value })}
          />
          <TextField
            margin="dense"
            id="officeLevel"
            label="Office Levele"
            type="text"
            fullWidth
            value={editData.officeLevel}
            onChange={(e) => setEditData({ ...editData, officeLevel: e.target.value })}
          />
          <TextField
            margin="dense"
            id="subDivision"
            label="Sub Division"
            type="text"
            fullWidth
            value={editData.subDivision}
            onChange={(e) => setEditData({ ...editData, subDivision: e.target.value })}
          />
          <TextField
            margin="dense"
            id="block"
            label="Block"
            type="text"
            fullWidth
            value={editData.block}
            onChange={(e) => setEditData({ ...editData, block: e.target.value })}
          />
          <TextField
            margin="dense"
            id="parentalUnion"
            label="Parental Union"
            type="text"
            fullWidth
            value={editData.parentalUnion}
            onChange={(e) => setEditData({ ...editData, parentalUnion: e.target.value })}
          />

          <TextField
            fullWidth
            label="Yearly Member Fee Remitted"
            select
            value={editData.yearlyMemberFreeRemitted ? "yes" : "no"}
            onChange={(e) =>
              setEditData({
                ...editData,
                yearlyMemberFreeRemitted: e.target.value === "yes",
              })
            }
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            value={editData.address?.village}
            onChange={(e) =>
              setEditData({
                ...editData,
                address: { ...editData.address, village: e.target.value },
              })
            }
          />

          <TextField
            margin="dense"
            id="pincode"
            label="Pincode"
            type="text"
            fullWidth
            value={editData.address?.pincode}
            onChange={(e) =>
              setEditData({
                ...editData,
                address: { ...editData.address, pincode: e.target.value },
              })
            }
          />

          <TextField
            margin="dense"
            id="city"
            label="City"
            type="text"
            fullWidth
            value={editData.address?.city}
            onChange={(e) =>
              setEditData({
                ...editData,
                address: { ...editData.address, city: e.target.value },
              })
            }
          />

          <TextField
            margin="dense"
            id="state"
            label="State"
            type="text"
            fullWidth
            value={editData.address?.state}
            onChange={(e) =>
              setEditData({
                ...editData,
                address: { ...editData.address, state: e.target.value },
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="primary">
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

export default leadrshipTableList;
