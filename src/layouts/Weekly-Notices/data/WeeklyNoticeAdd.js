import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Grid, Button, Divider, MenuItem, TextField, CardHeader, Typography, CardContent, CardActions, CircularProgress } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BackButton from "components/BackButton";
import { accessToken } from "services/variables";

function WeeklyNoticeAdd() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    title: "",
  });

  const handleInputChange = (prop) => (event) => {
    let value = event.target.value;

    // Check if the input is a date and adjust the formatting
    if (event.target.type === "date") {
      const selectedDate = new Date(event.target.value);
      const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}-${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${selectedDate.getFullYear()}`;
      value = formattedDate;
    }

    setFormData({
      ...formData,
      [prop]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_weekly_notice", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.data["body-json"].statusCode === 200) {
        Swal.fire("Success", response.data["body-json"].body, "success");
        // Clear the form data after successful submission
        setFormData({
          date: "",
          title: "",
        });
      } else {
        Swal.fire("Error", response["body-json"].data.body, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

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
                  Weekly Notice Add
                </MDTypography>
                <BackButton />
              </MDBox>

              <Card>
                <CardHeader title="Weekly Notice Add" titleTypographyProps={{ variant: "h6" }} />
                <Divider sx={{ margin: 0 }} />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          value={formData.formattedDate}
                          onChange={handleInputChange("date")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputProps: { style: { textTransform: "uppercase" } }, // Display input in uppercase
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          label="Title"
                          placeholder="Title"
                          multiline
                          rows={4}
                          value={formData.title}
                          onChange={handleInputChange("title")}
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

export default WeeklyNoticeAdd;
