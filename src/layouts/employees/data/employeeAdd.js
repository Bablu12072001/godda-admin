/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  Button,
  Divider,
  MenuItem,
  TextField,
  CardHeader,
  InputLabel,
  Typography,
  CardContent,
  CardActions,
  FormControl,
  Select,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { accessToken } from "services/variables";

// Import react-toastify components
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import BackButton from "components/BackButton";

// Data
// import authorsTableData from "layouts/tables/data/authorsTableData";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function EmployeeAdd() {
  //   const { columns, rows } = authorsTableData();
  //   const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    dateOfBirth: "",
    creator_email: "raushansinghd2003@gmail.com",
    creator_role: "admin",
    role: "staff",
    password: "admin@1234",
    maritalStatus: "No",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    contactNumber: "",
    address: {
      village: "",
      pincode: "",
      city: "",
      state: "",
    },
    qualification: "",
    experience: "",
    emergencyContact: "",
    bankDetails: {
      accountNo: "",
      ifsc: "",
    },
    email: "",
  });

  const handleInputChange = (prop) => (event) => {
    if (prop.includes(".")) {
      const [parentProp, childProp] = prop.split(".");
      setFormData({
        ...formData,
        [parentProp]: {
          ...formData[parentProp],
          [childProp]: event.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [prop]: event.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Set loading to true to show the circular progress

      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhdXNoYW5zaW5naGQyMDAzQGdtYWlsLmNvbSIsIm5hbWUiOiJSYXVzaGFuIEt1bWFyIiwiZ2VuZGVyIjoiTWFsZSIsInJvbGUiOiJhZG1pbiIsImNvbnRhY3ROdW1iZXIiOiI2MjAwMTE3NTc4IiwiZGVzaWduYXRpb24iOiJTb2Z0d2FyZSBkZXZlbG92ZXIiLCJkZXBhcnRtZW50IjoiQkNBIiwiaWF0IjoxNzA3Mjk2Mjc5LCJleHAiOjE3MDk4ODgyNzl9.f43rlVnP5DsXIagjfEiD6P9EtYsNwwL9z-87y8wTQM8"; // Your token here
      // const headers = {
      //   Authorization: token,
      // };
      setLoading(true);

      // Make the POST request using Axios
      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_employee_register", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.data["body-json"].statusCode === 200) {
        toast.success(response.data["body-json"].body);
      } else {
        toast.error(response.data["body-json"].body);
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);

      // You can display a generic error message here
      toast.error("An error occurred. Please try again.");
    } finally {
      // Set loading to false after the API call is complete
      setLoading(false);
    }
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     // TODO: Add validation logic if needed

  //     // Make the POST request using Axios
  //     axios
  //       .post(
  //         "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_employee_register",
  //         formData
  //       )
  //       .then((response) => {
  //         // Handle the response as needed
  //         console.log("Response:", response.data);
  //       })
  //       .catch((error) => {
  //         // Handle errors
  //         console.error("Error:", error);
  //       });
  //   };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Employee Add
                </MDTypography>
                <BackButton />
              </MDBox>

              <Card>
                <CardHeader title="Employee Add" titleTypographyProps={{ variant: "h6" }} />
                <Divider sx={{ margin: 0 }} />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Name" placeholder="Name" value={formData.name} onChange={handleInputChange("name")} required />
                      </Grid>
                      {/* <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Gender</FormLabel>
                          <RadioGroup
                            row
                            defaultValue="male"
                            aria-label="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange("gender")}
                            required
                          >
                            <FormControlLabel value="male" label="Male" control={<Radio />} />
                            <FormControlLabel value="female" label="Female" control={<Radio />} />
                            <FormControlLabel value="other" label="Other" control={<Radio />} />
                          </RadioGroup>
                        </FormControl>
                      </Grid> */}

                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Gender" select value={formData.gender} onChange={handleInputChange("gender")} required>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange("dateOfBirth")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Creator Email"
                          placeholder="Creator Email"
                          value={formData.creator_email}
                          onChange={handleInputChange("creator_email")}
                          required
                        />
                      </Grid>
                      {/* Add other input fields similarly */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Department"
                          placeholder="Department"
                          value={formData.department}
                          onChange={handleInputChange("department")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Designation"
                          placeholder="Designation"
                          value={formData.designation}
                          onChange={handleInputChange("designation")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Salary"
                          placeholder="Salary"
                          type="number"
                          value={formData.salary}
                          onChange={handleInputChange("salary")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Joining Date"
                          type="date"
                          value={formData.joiningDate}
                          onChange={handleInputChange("joiningDate")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Contact Number"
                          placeholder="Contact Number"
                          type="tel"
                          value={formData.contactNumber}
                          onChange={handleInputChange("contactNumber")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Address
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Village"
                          placeholder="Village"
                          value={formData.address.village}
                          onChange={handleInputChange("address.village")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Pincode"
                          placeholder="Pincode"
                          type="number"
                          value={formData.address.pincode}
                          onChange={handleInputChange("address.pincode")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          placeholder="City"
                          value={formData.address.city}
                          onChange={handleInputChange("address.city")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="State"
                          placeholder="State"
                          value={formData.address.state}
                          onChange={handleInputChange("address.state")}
                          required
                        />
                      </Grid>
                      {/* Add other input fields similarly */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Qualification"
                          placeholder="Qualification"
                          value={formData.qualification}
                          onChange={handleInputChange("qualification")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Experience"
                          placeholder="Experience"
                          value={formData.experience}
                          onChange={handleInputChange("experience")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Emergency Contact"
                          placeholder="Emergency Contact"
                          type="tel"
                          value={formData.emergencyContact}
                          onChange={handleInputChange("emergencyContact")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Bank Account No"
                          placeholder="Bank Account No"
                          value={formData.bankDetails.accountNo}
                          onChange={handleInputChange("bankDetails.accountNo")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="IFSC Code"
                          placeholder="IFSC Code"
                          value={formData.bankDetails.ifsc}
                          onChange={handleInputChange("bankDetails.ifsc")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          placeholder="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange("email")}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider sx={{ margin: 0 }} />
                  <CardActions>
                    <Button
                      size="large"
                      type="submit"
                      sx={{
                        mt: 2,
                        width: "100%",
                        color: "white",
                      }}
                      variant="contained"
                      disabled={loading}
                      style={{ color: "white" }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button>

                    {/* <Button
                      size="large"
                      type="submit"
                      sx={{ mr: 2 }}
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button> */}

                    {/* <Button type="submit" variant="contained">
                      Submit
                    </Button> */}
                  </CardActions>
                </form>
              </Card>

              {/* <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox> */}
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmployeeAdd;
