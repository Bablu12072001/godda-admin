import React, { useState } from "react";
import { Grid, MenuItem, Select, FormControl, InputLabel, TextField, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { apiUrl } from "Constants";
import swal from "sweetalert";
import Auth from "Auth";
const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  "& > *": {
    marginBottom: "1rem",
  },
});

const FileInputWrapper = styled("label")({
  display: "inline-block",
  position: "relative",
  overflow: "hidden",
  borderRadius: "4px",
  background: "#fff",
  color: "black",
  padding: "4px 6px",
  cursor: "pointer",
  "& input[type=file]": {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 0,
    padding: 0,
    fontSize: "10px",
    cursor: "pointer",
    opacity: 0,
  },
  "&:hover": {
    background: "#fff",
  },
});

const FileName = styled("p")({
  margin: "5px 0 0 0",
  fontSize: "10px",
});

const AddForm = () => {
  const { token } = Auth();
  let config = {
    headers: {
      Authorization: token,
    },
  };

  const [pdfUrl, setPdfUrl] = useState(null);

  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issueNo: "",
    type: "",
    date: "",
  });

  const [pdfName, setPdfName] = useState("");
  const [pdf, setPdf] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };
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
  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    setPdf(selectedFile);
    setPdfName(selectedFile?.name);
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20vh" }}>
          <CircularProgress />
        </div>
      </DashboardLayout>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // console.log("under handle submit");
    try {
      setloading(true);
      var response = await axios.post(
        `${apiUrl}/jmoa_circular_resolution_notice_presigned`,
        {
          folder_name: formData.type,
          file_name: pdfName,
        },
        config
      );
      if (response.data["body-json"]["statusCode"] !== 200) {
        swal({
          title: "Error!",
          text: "Error uploading file!! " + response.data["body-json"]["body"],
          icon: "error",
          button: "Ok!",
        });
        setloading(false);
        return;
      } else {
        setPdfUrl(response.data["body-json"]["body"]);
        await fetch(response.data["body-json"]["body"], {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
          body: pdf,
          mode: "cors",
          // mode: 'no-cors'
        }).then((response) => {
          if (response.status === 200) {
            // console.log("brochure & video: ", fileUrl.split("?")[0]);
            // setMainUrl(pdfUrl.split("?")[0]);
            // console.log("success put");
            // console.log(pdfUrl.split("?"),[0]);
            // console.log("mainUrl",mainUrl);
          } else {
            swal({
              title: "Error!",
              text: "Error uploading file!! " + response.data["body-json"]["body"],
              icon: "error",
              button: "Ok!",
            });
            setloading(false);
            return;
          }
        });
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      swal({
        title: "Error!",
        text: "Error!! " + error,
        icon: "error",
        button: "Ok!",
      });
      setloading(false);
      return;
    }

    ///posting data
    let body = formData;
    body.link = response.data["body-json"]["body"].split("?")[0];
    // console.log(body);

    try {
      const response = await axios.post(`${apiUrl}/jmoa_circular_resolution_notice`, body, config);
      if (response.data["body-json"]["statusCode"] !== 200) {
        swal({
          title: "Error!",
          text: "Error posting file!! " + response.data["body-json"]["body"],
          icon: "error",
          button: "Ok!",
        });
        setloading(false);
        return;
      } else {
        swal({
          title: "Success!",
          text: "Data Added!! ",
          icon: "success",
          button: "Ok!",
        });
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      swal({
        title: "Error!",
        text: "Error!! " + error,
        icon: "error",
        button: "Ok!",
      });
      setloading(false);
      return;
    }
    setloading(false);
    setFormData({
      title: "",
      issueNo: "",
      type: "",
      date: "",
    });
    setPdfName("");
  };

  return (
    <DashboardLayout>
      <br />
      <br />
      <center>
        <h1>Add Circular</h1>
      </center>
      <div style={{ display: "block", margin: "20vh auto" }}>
        <StyledForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField required id="title" label="Title" variant="outlined" name="title" value={formData.title} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="issueNo"
                type="number"
                label="Issue No"
                variant="outlined"
                name="issueNo"
                value={formData.issueNo}
                onChange={handleChange}
                fullWidth
              />
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
                  <MenuItem value="documents">JSNGEF Documents</MenuItem>
                  <MenuItem value="resolution">Acts & Rules</MenuItem>
                  <MenuItem value="circular">Circular</MenuItem>
                  <MenuItem value="notice">Notice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"

                placeholderText="Select Date"
                className="form-control"
                fullWidth
                required
              />
            </Grid> */}
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
            <Grid item xs={12}>
              <FileInputWrapper>
                <input required type="file" accept=".pdf" onChange={handlePdfChange} />
                Upload PDF File
              </FileInputWrapper>
              <FileName>{pdfName}</FileName>
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
