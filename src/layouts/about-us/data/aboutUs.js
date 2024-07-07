import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

const AboutUsData = () => {
  const [presidentData, setPresidentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  useEffect(() => {
    fetchPresidentData();
  }, []);

  const fetchPresidentData = () => {
    axios
      .get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_about_us_all_data")
      .then((response) => {
        setPresidentData(response.data["body-json"].body);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching about us data:", error);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setOpenDialog(false);
    Swal.fire({
      title: "Update Confirmation",
      html: updating ? '<div style="z-index: 9999;"><CircularProgress size={20} /></div>' : "Are you sure you want to update the about us data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdating(true);

        const updateData = {
          message: editedMessage || presidentData.message,
        };

        if (editedImage && editedImage !== presidentData.imageUrl) {
          updateData.base64 = editedImage.split(",")[1];
        } else {
          updateData.imageUrl = presidentData.imageUrl;
        }

        axios
          .put("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_about_us", updateData, {
            headers: {
              Authorization: accessToken(),
            },
          })
          .then((response) => {
            Swal.fire({
              title: "Update Successful",
              text: "About Us data has been updated successfully!",
              icon: "success",
            });
            setEditMode(false);
            setOpenDialog(false);
            fetchPresidentData();
            setImageTimestamp(Date.now());
          })
          .catch((error) => {
            console.error("Error updating about us data:", error);
            Swal.fire({
              title: "Update Failed",
              text: "Failed to update about us data. Please try again.",
              icon: "error",
            });
          })
          .finally(() => {
            setUpdating(false);
          });
      }
    });
  };

  const handleDialogOpen = () => {
    setEditedMessage(presidentData.message);
    setEditedImage(presidentData.imageUrl);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto mt-8" style={{ margin: "20px" }}>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <img src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`} alt="President" className="rounded-full w-20 h-20" />
          <p className="mt-2">{presidentData.message}</p>
          <p className="mt-2 mb-2">
            Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
          </p>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setEditMode(true);
              handleDialogOpen();
            }}
          >
            Edit About Us Data
          </Button>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Edit About US Data</DialogTitle>
            <DialogContent>
              {editedImage && editedImage !== presidentData.imageUrl ? (
                <img src={editedImage} alt="Preview" className="rounded-full w-20 h-20" />
              ) : (
                <img src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`} alt="Previous" className="rounded-full w-20 h-20" />
              )}
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                sx={{ margin: "5px", marginTop: "10px" }}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: "5px" }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUpdate} color="primary" disabled={updating}>
                {updating ? <CircularProgress size={20} /> : "Update"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AboutUsData;
