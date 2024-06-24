import React, { useState } from "react";
import { TextField, Button, Container, Typography, List, ListItem, ListItemText, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { accessToken } from "services/variables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsEventUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [base64Images, setBase64Images] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false); // State for upload operation loading

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);

    const promises = selectedImages.map(async (image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });

    try {
      const base64Results = await Promise.all(promises);

      setBase64Images((prevImages) => [...prevImages, ...base64Results]);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    } catch (error) {
      console.error("Error converting images to base64:", error);
    }
  };

  const handleSubmit = async () => {
    setUploading(true); // Set uploading state to true before upload
    console.log(base64Images);
    try {
      const response = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_news_events",
        {
          title: formData.title,
          content: formData.content,
          base64: base64Images,
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      console.log("Response:", response.data);

      toast.success("News and Event submitted successfully!");

      setFormData({
        title: "",
        content: "",
      });
      setBase64Images([]);
      setImages([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit News and Event!");
    } finally {
      setUploading(false); // Set uploading state to false after upload (success or failure)
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          News and Event Upload Form
        </Typography>
        <form>
          <TextField label="Title" fullWidth margin="normal" name="title" value={formData.title} onChange={handleInputChange} />
          <TextField label="Content" fullWidth multiline rows={4} margin="normal" name="content" value={formData.content} onChange={handleInputChange} />
          <input type="file" accept="image/*" onChange={handleImageChange} multiple />
          {base64Images.length > 0 && (
            <div>
              <Typography variant="subtitle2">Selected Images:</Typography>
              <List>
                {base64Images.map((base64, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`Image ${index + 1}`} />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.content || base64Images.length === 0 || uploading}
            >
              {uploading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </form>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </DashboardLayout>
  );
};

export default NewsEventUploadForm;
