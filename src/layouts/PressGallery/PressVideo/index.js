import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardMedia,
  Grid,
  Pagination,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { accessToken } from "services/variables"; // Make sure this import is correct and accessToken is properly defined
import Auth from "Auth";
const VideoGallery = () => {
  const navigate = useNavigate();
  const { token } = Auth();
  const [videoData, setVideoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addVideoLoading, setAddVideoLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true before API call
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_press_videos_all_data");
        setVideoData(response.data["body-json"].body);
        console.log("Press video ", response);
        setLoading(false); // Set loading state to false after API call
      } catch (error) {
        console.error("Error fetching video gallery data:", error);
        setLoading(false); // Set loading state to false even if there's an error
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = videoData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    console.log(selectedItemId);
    setDeleteLoading(true);
    try {
      const response = await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_videos_delete", {
        data: { id: selectedItemId },
        headers: { Authorization: token },
      });
      console.log(response.data);
      setVideoData((prevData) => prevData.filter((item) => item.id !== selectedItemId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeleteLoading(false); // Reset delete loading state after delete action
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleAddVideoClick = () => {
    setAddVideoLoading(true); // Set add video loading state to true
    navigate("/video-form");
  };

  return (
    <Container>
      {/* Add Video button with circular progress */}
      <Button variant="outlined" onClick={handleAddVideoClick} style={{ marginBottom: "20px", color: "red", position: "relative" }} disabled={addVideoLoading}>
        {addVideoLoading && (
          <CircularProgress
            size={24}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -12,
              marginLeft: -12,
            }}
          />
        )}
        Add Video
      </Button>
      <Grid container spacing={2}>
        {loading && <CircularProgress />}
        {currentItems.map((video) => (
          <Grid item key={video.id} xs={12} md={4}>
            <Card
              sx={{
                overflow: "hidden",
                transition: "transform 0.2s",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardMedia component="iframe" src={`https://www.youtube.com/embed/${video.youtube_url}`} height="250" title="Video" />
              <IconButton
                aria-label="more"
                aria-controls="menu"
                aria-haspopup="true"
                onClick={(event) => handleMenuOpen(event, video.id)}
                sx={{ position: "absolute", top: 0, right: -10, color: "white" }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    width: 150,
                  },
                }}
              >
                <MenuItem onClick={() => handleDeleteClick(video.id)}>
                  <IconButton aria-label="delete" color="inherit">
                    <DeleteIcon />
                  </IconButton>
                  Remove
                </MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(videoData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this video?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoGallery;
