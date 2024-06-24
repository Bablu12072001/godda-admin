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
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const [dateOfJoining, setDateOfJoining] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLevel, setOfficeLevel] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [block, setBlock] = useState("");
  const [aadharLastSix, setAadharLastSix] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [parentalUnion, setParentalUnion] = useState("");
  const [address, setAddress] = useState("");
  const [yearlyFeeRemitted, setYearlyFeeRemitted] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [declaration, setDeclaration] = useState(false);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e, setState) => {
    const value = e.target.value;
    setState(value);
  };

  const handleCheckboxChange = (e, setState) => {
    setState(e.target.checked);
  };

  const handleFileChange = (e, setState) => {
    setState(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";

    if (!email) newErrors.email = "Email is required";
    if (!contact) newErrors.contact = "Contact is required";

    if (!dateOfJoining) newErrors.dateOfJoining = "Date of Joining is required";
    if (!officeName) newErrors.officeName = "Office Name is required";
    if (!department) newErrors.department = "Department is required";
    if (!officeLevel) newErrors.officeLevel = "Office Level is required";
    if (officeLevel === "subdivision" && !subdivision) newErrors.subdivision = "Subdivision is required";
    if (officeLevel === "block" && !block) newErrors.block = "Block is required";
    if (!aadharLastSix) newErrors.aadharLastSix = "Aadhar last six digits are required";
    if (!employeeType) newErrors.employeeType = "Employee Type is required";
    if (!parentalUnion) newErrors.parentalUnion = "Parental Union  is required";
    if (!address) newErrors.address = "Other Address is required";
    if (!photo) newErrors.photo = "Photo is required";
    if (!signature) newErrors.signature = "Signature is required";
    if (!declaration) newErrors.declaration = "You must agree to the declaration";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnquiry = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    formData.append("contact", contact);

    formData.append("date_of_joining", dateOfJoining);
    formData.append("office_name", officeName);
    formData.append("department", department);
    formData.append("office_level", officeLevel);
    if (officeLevel === "subdivision") formData.append("subdivision", subdivision);
    if (officeLevel === "block") formData.append("block", block);
    formData.append("aadhar_last_six", aadharLastSix);
    formData.append("employee_type", employeeType);
    formData.append("parental_union", parentalUnion);
    formData.append("address", address);
    formData.append("yearly_fee_remitted", yearlyFeeRemitted);
    formData.append("photo", photo);
    formData.append("signature", signature);

    try {
      const response = await axios.post(`${apiUrl}/jmoa_enquiry`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      if (response.data["body-json"].statusCode === 200) {
        setName("");
        setEmail("");

        setContact("");

        setDateOfJoining("");
        setOfficeName("");
        setDepartment("");
        setOfficeLevel("");
        setSubdivision("");
        setBlock("");
        setAadharLastSix("");
        setEmployeeType("");
        setParentalUnion("");
        setAddress("");
        setYearlyFeeRemitted(false);
        setPhoto(null);
        setSignature(null);
        setDeclaration(false);
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDTypography>Coming Soon.....</MDTypography>
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default OfficeAdd;
