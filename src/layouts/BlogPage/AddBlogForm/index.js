import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid, List, ListItem, ListItemText, IconButton, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { accessToken } from "services/variables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsEventUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false); // State for upload operation loading

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeSelectedFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleSubmit = async () => {
    setUploading(true); // Set uploading state to true before upload
    const base64Array = await Promise.all(selectedFiles.map((file) => convertImageToBase64(file)));
    console.log(base64Array);
    try {
      const response = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_blog",
        {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          base64: base64Array,
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );
      console.log("Response:", response.data);

      setFormData({
        title: "",
        content: "",
        author: "",
      });
      setSelectedFiles([]);
      toast.success("Blog submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit blog!");
    } finally {
      setUploading(false); // Set uploading state to false after upload (success or failure)
    }
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
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Blog Upload Form
        </Typography>
        <form>
          <TextField label="Title" fullWidth margin="normal" name="title" value={formData.title} onChange={handleInputChange} />
          <TextField label="Author" fullWidth margin="normal" name="author" value={formData.author} onChange={handleInputChange} />
          <TextField label="Content" fullWidth multiline rows={4} margin="normal" name="content" value={formData.content} onChange={handleInputChange} />
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
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              style={{ color: "black" }}
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={uploading} // Disable button if uploading
            >
              {uploading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </Container>
    </DashboardLayout>
  );
};

export default NewsEventUploadForm;
