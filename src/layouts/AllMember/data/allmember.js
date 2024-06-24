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
  const [selectedEmail, setSelectedEmail] = useState(null);

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

  const handleUnverify = async (email_id) => {
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

      if (response.data.statusCode === 200) {
        setNewsData((prevData) => prevData.map((data) => (data.email_id === email_id ? { ...data, isVerified: false } : data)));
        toast.success("Employee unverified successfully!");
        refreshData();
      } else {
        toast.success("Employee verified successfully!");
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmail(null);
  };

  const handleConfirmVerify = async () => {
    if (selectedEmail) {
      await handleVerify(selectedEmail);
      handleCloseDialog();
    }
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
              <TableCell>Employee Type</TableCell>
              {/* <TableCell>Last Six Digit Aadhar</TableCell> */}
              <TableCell>Yearly Member Fee Remitted?</TableCell>
              <TableCell>Verification Status</TableCell>
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
                  <TableCell>{item.employeeType}</TableCell>

                  {/* <TableCell>{item.lastSixDigitOfAadhar}</TableCell> */}
                  <TableCell>{item.yearlyMemberFreeRemitted}</TableCell>
                  <TableCell>
                    {item.isVerified ? (
                      <Button variant="contained" color="success" onClick={() => handleVerify(item.email_id)}>
                        Verified
                      </Button>
                    ) : (
                      <Button variant="contained" color="error" onClick={() => handleOpenDialog(item.email_id)}>
                        Unverified
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
    </div>
  );
};

export default AllMember;
