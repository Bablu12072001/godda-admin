// Basic.js

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import swal from "sweetalert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_login", { email, password });
      // const {
      //   statusCode,
      //   body: { message, tokens },
      // } = response.data;
      console.log(response.data);
      console.log(response.data.statusCode);
      console.log(response.data.body.tokens);
      if (response.data.statusCode === 200) {
        console.log("under if");
        localStorage.setItem("loginToken", response.data.body.tokens);
        swal({
          title: "Success!",
          text: response.data.body.message,
          icon: "success",
          button: "Ok!",
        });
        // navigate("/dashboard"); // Use navigate to go to dashboard
        window.location.href = "/dashboard";
      } else {
        swal({
          title: "Warning!",
          text: "An error occurred while logging in. under else",
          icon: "warning",
          button: "Ok!",
        });
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "An error occurred while logging in.under catch",
        icon: "error",
        button: "Ok!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      swal({
        title: "Warning!",
        text: "Email and password cannot be empty!!",
        icon: "warning",
        button: "Ok!",
      });
      return;
    } else {
      handleLogin();
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" mx={2} mt={-3} p={2} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput type="email" label="Email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" type="submit" fullWidth disabled={loading}>
                Sign in
                {loading && <CircularProgress size={20} style={{ marginLeft: "10px" }} />}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
