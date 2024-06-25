import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography, CircularProgress, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { accessToken } from "services/variables";

const LeadershipForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    district: "",
    position: "",
    team: "",
    image: {
      name: "",
      base64: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: {
          name: file.name,
          base64: reader.result.split(",")[1],
        },
      });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_leadership", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.status === 200) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          message: "",
          district: "",
          position: "",
          team: "",
          image: {
            name: "",
            base64: "",
          },
        });
        setImagePreview("");
      } else {
        toast.error("Form submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Form submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", color: "red" }}
        disabled={loading} // Disable button when loading
      >
        Back
      </Button>
      <Paper style={{ padding: 16, maxWidth: 600, margin: "auto" }}>
        <ToastContainer />
        <Typography sx={{ justifyContent: "center", display: "flex", alignItems: "center" }} variant="h6" gutterBottom>
          Leadership Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required id="name" name="name" label="Name" fullWidth value={formData.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required id="message" name="message" label="Message" fullWidth multiline rows={4} value={formData.message} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required id="position" name="position" label="Position" fullWidth value={formData.position} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField required id="district" name="district" label="district" fullWidth value={formData.district} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField select required id="team" name="team" label="Team" fullWidth value={formData.team} onChange={handleChange}>
                <MenuItem value="state leadership team">State Leadership Team</MenuItem>
                <MenuItem value="district leadership team">District Leadership Team</MenuItem>
                <MenuItem value="block leadership team">Block Leadership Team</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" style={{ display: "none" }} id="raised-button-file" type="file" onChange={handleImageChange} />
              <label htmlFor="raised-button-file">
                <Typography>Upload Image</Typography>
                <Button variant="contained" color="primary" component="span">
                  Upload Image
                </Button>
              </label>
            </Grid>
            {imagePreview && (
              <Grid item xs={12}>
                <img src={imagePreview} alt="Selected" style={{ maxWidth: "200px" }} />
              </Grid>
            )}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  style={{
                    boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, 0.3)", // Adding shadow to the button
                    backgroundColor: "#3f51b5", // Optional: Change the background color to match the default MUI primary color
                    color: "white", // Optional: Ensure text color is readable
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </DashboardLayout>
  );
};

export default LeadershipForm;
