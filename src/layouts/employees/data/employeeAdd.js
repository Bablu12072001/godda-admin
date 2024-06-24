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
  Typography,
  CardContent,
  CardActions,
  CircularProgress,
  FormControlLabel,
  Checkbox,
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

function EmployeeAdd() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",

    creator_email: "raushansinghd2003@gmail.com",
    creator_role: "admin",

    password: "admin@1234",

    department: "",
    designation: "",

    joiningDate: "",
    contactNumber: "",
    address: {
      village: "",
      pincode: "",
      city: "",
      state: "",
    },
    email: "",
    officeLevel: "",
    officeName: "",
    subDivision: "",
    block: "",
    lastSixDigitOfAadhar: "",
    parentalUnion: "",
    yearlyMemberFreeRemitted: "",
    district: "",
    employeeType: "",

    declaration: false,
    sign: {
      name: "",
      base64: "",
    },
    image: {
      name: "",
      base64: "",
    },
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

  const handleFileInputChange = (prop) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [prop]: {
            name: file.name,
            base64: reader.result.split(",")[1], // Remove data url prefix
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Make the POST request using Axios
      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_employee_register", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.data["body-json"].statusCode === 200) {
        toast.success(response.data["body-json"].body);
        setFormData({
          name: "",
          creator_email: "raushansinghd2003@gmail.com",
          creator_role: "admin",
          password: "admin@1234",
          department: "",
          designation: "",
          joiningDate: "",
          contactNumber: "",
          address: {
            village: "",
            pincode: "",
            city: "",
            state: "",
          },
          email: "",
          officeLevel: "",
          officeName: "",
          subDivision: "",
          block: "",
          lastSixDigitOfAadhar: "",
          parentalUnion: "",
          yearlyMemberFreeRemitted: "",
          district: "",
          employeeType: "",
          declaration: false,
          sign: {
            name: "",
            base64: "",
          },
          image: {
            name: "",
            base64: "",
          },
        });
      } else {
        toast.error(response.data["body-json"].body);
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // Set loading to false after the API call is complete
      setLoading(false);
    }
  };

  // const handleOfficeLevelChange = (event) => {
  //   const selectedOfficeLevel = event.target.value;
  //   setFormData({
  //     ...formData,
  //     officeLevel: selectedOfficeLevel,
  //     subDivision: "",
  //     block: "",
  //   });
  // };
  const handleOfficeLevelChange = (event) => {
    const selectedOfficeLevel = event.target.value;
    setFormData({
      ...formData,
      officeLevel: selectedOfficeLevel,
      subDivision: "", // Reset subDivision when officeLevel changes
      block: "",
    });
  };
  const handleCheckboxChange = (e, setState) => {
    setState(e.target.checked);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
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
                        <TextField
                          fullWidth
                          label="Creator Email"
                          placeholder="Creator Email"
                          value={formData.creator_email}
                          onChange={handleInputChange("creator_email")}
                          required
                        />
                      </Grid> */}
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Office Level" select value={formData.officeLevel} onChange={handleOfficeLevelChange} required>
                          <MenuItem value="district">District</MenuItem>
                          <MenuItem value="subDivision">Sub-Division</MenuItem>
                          <MenuItem value="block">Block</MenuItem>
                        </TextField>
                      </Grid>

                      {formData.officeLevel === "subDivision" && (
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Sub Division" select value={formData.subDivision} onChange={handleInputChange("subDivision")} required>
                            <MenuItem value="godda sadar">Godda Sadar</MenuItem>
                            <MenuItem value="mahagama">Mahagama</MenuItem>
                          </TextField>
                        </Grid>
                      )}
                      {formData.officeLevel === "block" && (
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Block" select value={formData.block} onChange={handleInputChange("block")} required>
                            <MenuItem value="basantrai">Basantrai</MenuItem>
                            <MenuItem value="boarijore">Boarijore</MenuItem>
                            <MenuItem value="bodda">Godda</MenuItem>
                            <MenuItem value="bahagama">Mahagama</MenuItem>
                            <MenuItem value="beharma">Meharma</MenuItem>
                            <MenuItem value="bathergama">Pathergama</MenuItem>
                            <MenuItem value="boraiyahat">Poraiyahat</MenuItem>
                            <MenuItem value="bunderpahari">Sunderpahari</MenuItem>
                          </TextField>
                        </Grid>
                      )}
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
                          label="District"
                          placeholder="District"
                          value={formData.district}
                          onChange={handleInputChange("district")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Office Name"
                          placeholder="Office Name"
                          value={formData.officeName}
                          onChange={handleInputChange("officeName")}
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

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Six Digits of Aadhar"
                          placeholder="Last Six Digits of Aadhar"
                          value={formData.lastSixDigitOfAadhar}
                          onChange={handleInputChange("lastSixDigitOfAadhar")}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Parental Union"
                          placeholder="Parental Union"
                          value={formData.parentalUnion}
                          onChange={handleInputChange("parentalUnion")}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Employee Type" select value={formData.employeeType} onChange={handleInputChange("employeeType")} required>
                          <MenuItem value="regular">Regular</MenuItem>
                          <MenuItem value="contractual">Contractual</MenuItem>
                          <MenuItem value="outsourced">Outsourced</MenuItem>
                          <MenuItem value="daily waged">Daily Waged</MenuItem>
                        </TextField>
                      </Grid>

                      {/* <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox checked={formData.delcaration} onChange={handleInputChange("declaration")} />}
                          label="Declaration"
                        />
                      </Grid> */}
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

                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Upload Signature
                        </Typography>
                        <input type="file" accept="image/*" onChange={handleFileInputChange("sign")} style={{ marginBottom: "10px" }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                          Upload Image
                        </Typography>
                        <input type="file" accept="image/*" onChange={handleFileInputChange("image")} style={{ marginBottom: "10px" }} />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Yearly Member Fee Remitted"
                        select
                        value={formData.yearlyMemberFreeRemitted}
                        onChange={handleInputChange("yearlyMemberFreeRemitted")}
                        required
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.declaration} onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })} />}
                        label="Declaration"
                      />
                      <Typography>
                        I hereby declare that i will follow the terms and conditions of the federation. i want to be a member of jharkhand state none-gazetted
                        employees federation, godda.
                      </Typography>
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
                  </CardActions>
                </form>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EmployeeAdd;
