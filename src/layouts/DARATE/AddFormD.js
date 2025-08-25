import React, { useState } from "react";
import { Grid, MenuItem, Select, FormControl, InputLabel, TextField, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import swal from "sweetalert";
import Auth from "Auth";

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  "& > *": {
    marginBottom: "1rem",
  },
});

const AddForm = () => {
  const { token } = Auth();
  let config = {
    headers: {
      Authorization: token,
    },
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    letterNo: "",
    applicablePeriod: "",
    daRate: "",
    type: "",
    date: "",
    remarks: "",
  });

  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChange = (prop) => (event) => {
    let value = event.target.value;

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected PDF File:", file);
    setPdfFile(file);
  };

  const uploadPdfToPresignedUrl = async () => {
    if (!pdfFile) {
      console.error("No PDF file selected.");
      return "";
    }

    try {
      console.log("Requesting presigned URL...");
      const presignResponse = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/prc_presign",
        {
          file_name: pdfFile.name,
        },
        config
      );

      console.log("Full presignResponse:", presignResponse);

      // ✅ Correctly access the URL
      const uploadUrl = presignResponse?.data?.["body-json"]?.body;

      if (!uploadUrl) {
        console.error("Presigned URL not received", presignResponse?.data);
        swal("Error!", "Presigned URL not received from server.", "error");
        return "";
      }

      const fileUrl = uploadUrl.split("?")[0];

      await axios.put(uploadUrl, pdfFile, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      console.log("PDF uploaded successfully to:", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("PDF Upload Error:", error);
      swal("Error!", "Failed to upload PDF.", "error");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedPdfUrl = await uploadPdfToPresignedUrl();
      console.log("Uploaded PDF URL:", uploadedPdfUrl);

      if (!uploadedPdfUrl) {
        swal("Error!", "PDF file upload failed.", "error");
        setLoading(false);
        return;
      }

      const body = {
        letterNo: formData.letterNo,
        applicablePeriod: formData.applicablePeriod,
        daRate: formData.daRate,
        type: formData.type,
        date: formData.date,
        remarks: formData.remarks,
        pdf: uploadedPdfUrl,
      };

      await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/godda_prc", body, config);

      swal({
        title: "Success!",
        text: "Data Added!",
        icon: "success",
        button: "Ok!",
      });

      setFormData({
        letterNo: "",
        applicablePeriod: "",
        daRate: "",
        type: "",
        date: "",
        remarks: "",
      });
      setPdfFile(null);
    } catch (e) {
      console.error("Submit Error:", e);
      swal({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        button: "Ok!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20vh",
          }}
        >
          <CircularProgress />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <br />
      <br />
      <center>
        <h1>Add PRC</h1>
      </center>
      <div style={{ display: "block", margin: "20vh auto" }}>
        <StyledForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="letterNo"
                label="Letter No"
                variant="outlined"
                name="letterNo"
                value={formData.letterNo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="applicablePeriod"
                label="Applicable Period"
                variant="outlined"
                name="applicablePeriod"
                value={formData.applicablePeriod}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="daRate" label="DA Rate" variant="outlined" name="daRate" value={formData.daRate} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                  style={{ height: "45px" }}
                  required
                >
                  <MenuItem value="1st prc">1st PRC</MenuItem>
                  <MenuItem value="2nd prc">2nd PRC</MenuItem>
                  <MenuItem value="3rd prc">3rd PRC</MenuItem>
                  <MenuItem value="4th prc">4th PRC</MenuItem>
                  <MenuItem value="5th prc">5th PRC</MenuItem>
                  <MenuItem value="6th prc">6th PRC</MenuItem>
                  <MenuItem value="7th prc">7th PRC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date" type="date" onChange={handleInputChange("date")} InputLabelProps={{ shrink: true }} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required id="remarks" label="Remarks" variant="outlined" name="remarks" value={formData.remarks} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="application/pdf" onChange={handleFileChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </StyledForm>
      </div>
    </DashboardLayout>
  );
};

export default AddForm;
