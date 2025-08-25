import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

const PresidentData = () => {
  const [presidentData, setPresidentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  useEffect(() => {
    fetchPresidentData();
  }, []);

  const fetchPresidentData = () => {
    axios
      .get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_president_message_all_data")
      .then((response) => {
        setPresidentData(response.data["body-json"].body);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching president data:", error);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setOpenDialog(false);
    Swal.fire({
      title: "Update Confirmation",
      html: updating ? '<div style="z-index: 9999;"><CircularProgress size={20} /></div>' : "Are you sure you want to update the president data?",
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
          name: editedName || presidentData.name,
        };

        if (editedImage && editedImage !== presidentData.imageUrl) {
          updateData.base64 = editedImage.split(",")[1];
        } else {
          updateData.imageUrl = presidentData.imageUrl;
        }

        axios
          .put("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_president_message", updateData, {
            headers: {
              Authorization: accessToken(),
            },
          })
          .then(() => {
            Swal.fire("Success", "President data has been updated!", "success");
            setEditMode(false);
            setOpenDialog(false);
            fetchPresidentData();
            setImageTimestamp(Date.now());
          })
          .catch((error) => {
            console.error("Error updating president data:", error);
            Swal.fire("Error", "Failed to update president data.", "error");
          })
          .finally(() => {
            setUpdating(false);
          });
      }
    });
  };

  const handleDialogOpen = () => {
    setEditedName(presidentData.name);
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
    <div style={{ margin: "20px" }}>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <Card
          sx={{
            maxWidth: 700,
            margin: "auto",
            padding: "20px",
            boxShadow: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CardContent>
            <Avatar
              src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`}
              alt="President"
              sx={{
                width: 120,
                height: 120,
                margin: "auto",
                boxShadow: 2,
                border: "4px solid #1976d2",
              }}
            />
            <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
              {presidentData.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
              {presidentData.message}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
            </Typography>

            <Button variant="contained" color="info" onClick={handleDialogOpen} sx={{ mt: 2 }}>
              Edit President Data
            </Button>
          </CardContent>

          {/* Edit Dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit President Data</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                  <Avatar
                    src={editedImage && editedImage !== presidentData.imageUrl ? editedImage : `${presidentData.imageUrl}?timestamp=${imageTimestamp}`}
                    alt="Preview"
                    sx={{
                      width: 100,
                      height: 100,
                      border: "3px solid #2196f3",
                      marginTop: 1,
                    }}
                  />
                </Grid>
              </Grid>

              <TextField label="Name" fullWidth variant="outlined" margin="dense" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                margin="dense"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
              />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "10px" }} />
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
        </Card>
      )}
    </div>
  );
};

export default PresidentData;
