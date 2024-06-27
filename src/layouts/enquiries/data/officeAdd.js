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
import { apiUrl } from "../../../Constants";
import axios from "axios";
import {
  Card,
  Grid,
  Button,
  Divider,
  MenuItem,
  TextField,
  CardHeader,
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
import BackButton from "components/BackButton";

function OfficeAdd() {
  const [officeName, setOfficeName] = useState("");
  const [email, setEmail] = useState("");
  const [block, setBlock] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    setState(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!officeName) newErrors.officeName = "District Office Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!block) newErrors.block = "Block is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      officeName,
      email,
      block,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/add_office`, formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      console.log(response);
      if (response.data["body-json"].statusCode === 200) {
        toast.success("Form submitted successfully!");
        setOfficeName("");
        setEmail("");
        setBlock("");
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <BackButton />

        <MDBox pt={6} pb={3}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card>
                <CardHeader title="Add District Office" />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <TextField
                      fullWidth
                      label="District Office Name"
                      margin="normal"
                      value={officeName}
                      onChange={(e) => handleInputChange(e, setOfficeName)}
                      error={!!errors.setOfficeName}
                      helperText={errors.setOfficeName}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      margin="normal"
                      type="email"
                      value={email}
                      onChange={(e) => handleInputChange(e, setEmail)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <TextField
                      fullWidth
                      label="Block"
                      margin="normal"
                      value={block}
                      onChange={(e) => handleInputChange(e, setBlock)}
                      error={!!errors.block}
                      helperText={errors.block}
                    />
                  </CardContent>
                  <CardActions>
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                  </CardActions>
                </form>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        <ToastContainer />
      </DashboardLayout>
    </>
  );
}

export default OfficeAdd;
