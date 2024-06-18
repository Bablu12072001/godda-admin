import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BackButton from "components/BackButton";
import {
  Card,
  Grid,
  Button,
  Divider,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import { accessToken } from "services/variables";

export default function AddScrollImages() {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeSelectedFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      swal("Please select at least one image", { icon: "error" });
      return;
    }

    swal({
      title: "Are you sure?",
      text: "You are about to upload the selected images",
      icon: "question",
      buttons: true,
      dangerMode: true,
    }).then(async (willUpload) => {
      if (willUpload) {
        setLoading(true);

        try {
          const base64Array = await Promise.all(selectedFiles.map((file) => convertImageToBase64(file)));

          const response = await axios.post(
            "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_scroller_images",
            { base64: base64Array },
            {
              headers: {
                Authorization: accessToken(),
              },
            }
          );

          if (response.status === 200) {
            swal("Images uploaded successfully!", { icon: "success" });
            setSelectedFiles([]); // Clear selected files after successful upload
          } else {
            swal("Error uploading images. Please try again.", { icon: "error" });
          }
        } catch (error) {
          console.log("Error uploading images. Please try again.", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
                  Scroller Images Add
                </MDTypography>
                <BackButton />
              </MDBox>

              <Card>
                <CardHeader title="Scroller Images Add" titleTypographyProps={{ variant: "h6" }} />
                <Divider sx={{ margin: 0 }} />
                <form>
                  <CardContent>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      multiple // Allow multiple file selection
                    />
                    <List>
                      {selectedFiles.map((file, index) => (
                        <ListItem key={index}>
                          <Box display="flex" alignItems="center">
                            <img src={URL.createObjectURL(file)} alt={`Selected ${index + 1}`} style={{ maxWidth: 150, maxHeight: 150 }} />
                            <ListItemText primary={file.name} />
                            <IconButton color="error" onClick={() => removeSelectedFile(index)}>
                              <i className="far fa-trash-alt" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <Divider sx={{ margin: 0 }} />
                  <CardActions>
                    <Button
                      size="large"
                      onClick={handleUpload}
                      sx={{
                        mt: 2,
                        width: "100%",
                        color: "white",
                      }}
                      variant="contained"
                      disabled={loading}
                      style={{ color: "white" }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
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
