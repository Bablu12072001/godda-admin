import React, { useState } from "react";
import { Button, Typography, Container, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { accessToken } from "services/variables";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ImageUploadForm = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageType, setImageType] = useState("gallery");
  const [loading, setLoading] = useState(false); // Added loading state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const containerStyle = {
    marginTop: "20px",
  };

  const paperStyle = {
    padding: "20px",
  };

  const formControlStyle = {
    width: "100%",
    marginBottom: "16px",
  };

  const fileInputStyle = {
    marginBottom: "16px",
  };

  const uploadButtonStyle = {
    marginTop: "16px",
    color: "black",
  };

  const getPresignedUrls = async () => {
    const response = await axios.post(
      "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_image_presigned",
      {
        type: imageType,
        file_name: galleryImages.map((file) => file.name),
      },
      {
        headers: {
          Authorization: accessToken(),
        },
      }
    );

    return response.data["body-json"].body;
  };

  const callPutApi = async (url, file) => {
    try {
      const res = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      return res;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  };

  const handleGalleryUpload = async () => {
    setLoading(true); // Set loading to true when the upload starts
    try {
      const presignedUrlsData = await getPresignedUrls();
      const cleanUrls = [];

      for (let i = 0; i < presignedUrlsData.length; i++) {
        await callPutApi(presignedUrlsData[i], galleryImages[i]);
        cleanUrls[i] = presignedUrlsData[i].split("?")[0];
      }

      const uploadResponse = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_images",
        {
          type: imageType,
          imageUrl: cleanUrls,
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      setSnackbarMessage("Images uploaded successfully!");
      setOpenSnackbar(true);
      setGalleryImages([]);
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      setSnackbarMessage("Error uploading images. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Set loading to false after the upload is complete
    }
  };

  const handleGalleryImageChange = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setGalleryImages(filesArray);
  };

  const handleTypeChange = (event) => {
    setImageType(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DashboardLayout>
      <Container style={containerStyle}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={paperStyle}>
              <Typography variant="h5" gutterBottom>
                Upload Images
              </Typography>
              <FormControl style={formControlStyle}>
                <InputLabel>Type</InputLabel>
                <Select value={imageType} onChange={handleTypeChange}>
                  <MenuItem value="gallery">Gallery</MenuItem>
                  <MenuItem value="press">Press</MenuItem>
                  <MenuItem value="Glorious Moments">Glorious Moments</MenuItem>
                </Select>
              </FormControl>
              <input
                type="file"
                multiple
                onChange={handleGalleryImageChange}
                style={fileInputStyle}
                key={galleryImages.length} // Reset the input field by changing the key
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGalleryUpload}
                style={uploadButtonStyle}
                disabled={galleryImages.length === 0 || loading} // Disable if no files selected or loading
              >
                {loading ? <CircularProgress size={24} /> : "Upload"}
              </Button>
              <Box mt={2}>
                {galleryImages.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={file.name} style={{ width: "100px", height: "100px", margin: "5px" }} />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("success") ? "success" : "error"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default ImageUploadForm;
