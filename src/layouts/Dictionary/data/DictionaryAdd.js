import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Grid, Button, Divider, TextField, CardHeader, CardContent, CardActions, CircularProgress } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BackButton from "components/BackButton";
import { accessToken } from "services/variables";

function WordDictionaryAdd() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
  });

  const handleInputChange = (prop) => (event) => {
    setFormData({
      ...formData,
      [prop]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/add_word_in_dictionary", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      // Check if the response status is 200 and display the success message
      if (response.status === 200) {
        Swal.fire("Success", response.data.message, "success");
        // Clear the form data after successful submission
        setFormData({
          word: "",
          meaning: "",
        });
      } else {
        Swal.fire("Error", "Failed to add the word. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "An error occurred while adding the word. Please try again.", "error");
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
                  Add Word to Dictionary
                </MDTypography>
                <BackButton />
              </MDBox>

              <Card>
                <CardHeader title="Word Dictionary Add" titleTypographyProps={{ variant: "h6" }} />
                <Divider sx={{ margin: 0 }} />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <TextField fullWidth label="Word" placeholder="Enter word" value={formData.word} onChange={handleInputChange("word")} required />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          label="Meaning"
                          placeholder="Enter meaning"
                          multiline
                          rows={4}
                          value={formData.meaning}
                          onChange={handleInputChange("meaning")}
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

export default WordDictionaryAdd;
