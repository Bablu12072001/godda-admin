import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
} from "@mui/material";
import axios from "axios";
import { accessToken } from "services/variables";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllMember = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogun, setOpenDialogun] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/employee_by_verification_status",
        {
          isVerified: false, // Fetch all employees initially
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );
      setNewsData(response.data["body-json"].body || []); // Ensure response.data["body-json"].body is an array or default to empty array
      console.log("Employee data fetched:", response.data["body-json"].body);
    } catch (error) {
      console.error("Error fetching employee data:", error);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVerify = async (email_id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/employee_verify",
        { email: email_id },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      console.log(response.data);

      if (response.data.statusCode === 200) {
        setNewsData((prevData) => prevData.map((data) => (data.email_id === email_id ? { ...data, isVerified: true } : data)));
        toast.success("Employee verified successfully!");
        refreshData();
      } else {
        toast.success("Employee verified successfully!");
        refreshData();
      }
    } catch (error) {
      console.error("Error verifying employee:", error);
      toast.success("Employee verified successfully!");
      refreshData();
    } finally {
      setLoading(false);
    }
  };

  const handleunVerify = async (email_id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/delete_member_request?email=${email_id}`,

        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      if (response.data.statusCode === 200) {
        setNewsData((prevData) => prevData.map((data) => (data.email_id === email_id ? { ...data, isVerified: false } : data)));
        toast.success("Employee unverified successfully!");
        refreshData();
      } else {
        toast.success("Employee unverified  successfully!");
        refreshData();
      }
    } catch (error) {
      console.error("Error unverifying employee:", error);
      toast.success("Employee verified successfully!");
      refreshData();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (email_id) => {
    setSelectedEmail(email_id);
    setOpenDialog(true);
  };
  const handleOpenDialogun = (email_id) => {
    setSelectedEmail(email_id);
    setOpenDialogun(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmail(null);
  };
  const handleCloseDialogun = () => {
    setOpenDialogun(false);
    setSelectedEmail(null);
  };

  const handleConfirmVerify = async () => {
    if (selectedEmail) {
      await handleVerify(selectedEmail);
      handleCloseDialog();
    }
  };
  const handleConfirmunVerify = async () => {
    if (selectedEmail) {
      await handleunVerify(selectedEmail);
      handleCloseDialog();
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <ToastContainer />

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ display: "table-header-group" }}>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Fee Paid This Year?</TableCell>
              {/* <TableCell>Fee Paid This Year?</TableCell>
              <TableCell>Transaction/Ref no</TableCell> */}
              <TableCell>Verification Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(newsData) && newsData.length > 0 ? (
              newsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item.email_id}>
                  <TableCell>{<Avatar alt="Image" src={item.profile_image}></Avatar>}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email_id}</TableCell>
                  <TableCell>{item.district}</TableCell>
                  <TableCell>{item.joiningDate}</TableCell>
                  <TableCell>{item.yearlyMemberFreeRemitted}</TableCell>

                  <TableCell sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" color="success" onClick={() => handleOpenDialog(item.email_id)}>
                      Verified
                    </Button>

                    <Button variant="contained" color="error" onClick={() => handleOpenDialogun(item.email_id)} style={{ marginLeft: 8 }}>
                      Unverified
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => handleView(item)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to verify this member?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "white", bgcolor: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmVerify} disabled={loading} sx={{ color: "white", bgcolor: "blue" }}>
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialogun} onClose={handleCloseDialogun}>
        <DialogTitle>Confirm Verification</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to Unverified this member?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogun} sx={{ color: "white", bgcolor: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmunVerify} disabled={loading} sx={{ color: "white", bgcolor: "blue" }}>
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailsModalOpen} onClose={handleDetailsModalClose} maxWidth="md">
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Grid container spacing={2}>
              <Card sx={{ minWidth: 275, margin: 2 }}>
                <CardHeader title={selectedEmployee.name} />
                <CardContent>
                  <Typography variant="body2">
                    <b>Designation:</b> {selectedEmployee.designation}
                  </Typography>
                  <Typography variant="body2">
                    <b>Department:</b> {selectedEmployee.department}
                  </Typography>
                  <Typography variant="body2">
                    <b>Joining Date:</b> {selectedEmployee.joiningDate}
                  </Typography>
                  <Typography variant="body2">
                    <b>Contact Number:</b> {selectedEmployee.contactNumber}
                  </Typography>
                  <Typography variant="body2">
                    <b>Email:</b> {selectedEmployee.email_id}
                  </Typography>
                  <Typography variant="body2">
                    <b>Address:</b>
                    {selectedEmployee.address?.pincode}, {selectedEmployee.address?.state}, {selectedEmployee.address?.village},{" "}
                    {selectedEmployee.address?.city}
                  </Typography>
                  <Typography variant="body2">
                    <b>District:</b> {selectedEmployee.district}
                  </Typography>
                  <Typography variant="body2">
                    <b>Last Six Digit Of Aadhar Number:</b> {selectedEmployee.lastSixDigitOfAadhar}
                  </Typography>
                  <Typography variant="body2">
                    <b>Office Level:</b> {selectedEmployee.officeLevel}
                  </Typography>
                  <Typography variant="body2">
                    <b>Sub Division:</b> {selectedEmployee.subDivision}
                  </Typography>
                  <Typography variant="body2">
                    <b>Block:</b> {selectedEmployee.block}
                  </Typography>
                  <Typography variant="body2">
                    <b>Office Name:</b> {selectedEmployee.officeName}
                  </Typography>
                  <Typography variant="body2">
                    <b>Yearly Member Fee Remitted:</b> {selectedEmployee.yearlyMemberFreeRemitted}
                  </Typography>
                  <Typography variant="body2">
                    <b>Transaction/Ref no:</b> {selectedEmployee.transactionNo}
                  </Typography>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Images:</Typography>
                    <Chip label="Profile Image" component="a" href={selectedEmployee.profile_image} target="_blank" clickable />
                    <Chip label="Signature Image" component="a" href={selectedEmployee.sign_image} target="_blank" clickable />
                    <Chip label="Upload Form" component="a" href={selectedEmployee.form} target="_blank" clickable />
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
  );
};

export default AllMember;
