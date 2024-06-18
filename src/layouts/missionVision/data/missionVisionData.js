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

const MissionVisionData = () => {
  const [missionVisionData, setMissionVisionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedMission, setEditedMission] = useState("");
  const [editedVision, setEditedVision] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Fetch Mission and Vision Data on component mount
    fetchMissionVisionData();
  }, []);

  const fetchMissionVisionData = () => {
    axios
      .get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_mission_and_vission_all_data")
      .then((response) => {
        setMissionVisionData(response.data["body-json"].body);
        console.log("Mission Vision Data 1: ", response.data.body);
        console.log("Mission Vision Data 2: ", response.data.body.mission);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mission and vision data:", error);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setOpenDialog(false);

    // Display SweetAlert2 for confirmation with circular loading
    Swal.fire({
      title: "Update Confirmation",
      html: updating ? '<div style="z-index: 9999;"><CircularProgress size={20} /></div>' : "Are you sure you want to update the mission and vision data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, set updating state to true
        setUpdating(true);

        // If confirmed, make the PUT request to update mission and vision data
        const updateData = {
          mission: editedMission || missionVisionData.mission,
          vision: editedVision || missionVisionData.vision,
        };

        axios
          .put("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_mission_and_vission", updateData, {
            headers: {
              Authorization: accessToken(),
            },
          })
          .then((response) => {
            // Show success message using SweetAlert2
            Swal.fire({
              title: "Update Successful",
              text: "Mission and vision data has been updated successfully!",
              icon: "success",
            });
            setEditMode(false);
            setOpenDialog(false);
            // Refresh data after successful update
            fetchMissionVisionData();
          })
          .catch((error) => {
            console.error("Error updating mission and vision data:", error);
            // Show error message using SweetAlert2
            Swal.fire({
              title: "Update Failed",
              text: "Failed to update mission and vision data. Please try again.",
              icon: "error",
            });
          })
          .finally(() => {
            // Set updating state to false after the update process
            setUpdating(false);
          });
      }
    });
  };

  const handleDialogOpen = () => {
    // Set the edited mission and vision when opening the dialog in edit mode
    setEditedMission(missionVisionData.mission);
    setEditedVision(missionVisionData.vision);

    // Open the Material-UI Dialog
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    // Close the Material-UI Dialog
    setOpenDialog(false);
  };

  return (
    <div className="container mx-auto mt-8" style={{ margin: "20px" }}>
      {loading ? (
        // Display CircularProgress while loading
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        // Display mission and vision data when not loading
        <div>
          <h1 className="text-2xl font-bold mt-4">Mission</h1>
          <p className="mt-2 mr-8">{missionVisionData.mission}</p>
          <h1 className="text-2xl font-bold mt-4">Vision</h1>
          <p className="mt-2 mr-8">{missionVisionData.vision}</p>
          <p className="mt-2 mb-2">Last Update: {missionVisionData.date}</p>

          {/* Button to toggle edit mode */}
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setEditMode(true);
              handleDialogOpen();
            }}
          >
            Edit Mission and Vision Data
          </Button>

          {/* Material-UI Dialog for editing */}
          <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Mission and Vision Data</DialogTitle>
            <DialogContent>
              {/* Input fields */}
              <TextField
                label="Mission"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={editedMission}
                onChange={(e) => setEditedMission(e.target.value)}
                style={{ marginTop: "10px" }}
              />
              <TextField
                label="Vision"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={editedVision}
                onChange={(e) => setEditedVision(e.target.value)}
                style={{ marginTop: "10px" }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              {/* Display CircularProgress while updating */}
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

export default MissionVisionData;
