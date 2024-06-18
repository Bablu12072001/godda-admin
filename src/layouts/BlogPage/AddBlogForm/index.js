import React, { useState } from "react";
import { TextField, Button, Container, Typography, Grid, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { accessToken } from "services/variables";

const NewsEventUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const [base64Images, setBase64Images] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleImageChange = async (e) => {
  //   const selectedImages = Array.from(e.target.files);

  //   const promises = selectedImages.map(async (image) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const base64 = reader.result.split(",")[1];
  //         resolve(base64);
  //       };
  //       reader.onerror = reject;
  //       reader.readAsDataURL(image);
  //     });
  //   });

  //   try {
  //     const base64Results = await Promise.all(promises);

  //     setBase64Images((prevImages) => [...prevImages, ...base64Results]);
  //     setImages((prevImages) => [...prevImages, ...selectedImages]);
  //   } catch (error) {
  //     console.error("Error converting images to base64:", error);
  //   }
  // };

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
      setBase64Images([]);
      setImages([]);
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <Button
            style={{ color: "black" }}
            variant="outlined"
            color="primary"
            onClick={handleSubmit}
            // disabled={!formData.title || !formData.content || base64Images.length === 0}
          >
            Submit
          </Button>
        </form>
      </Container>
    </DashboardLayout>
  );
};

export default NewsEventUploadForm;
