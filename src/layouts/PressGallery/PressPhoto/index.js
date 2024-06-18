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
import { accessToken } from "services/variables";

const Gallery = () => {
  const navigate = useNavigate();
  const [galleryData, setGalleryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 6 items per page
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [deleteLoading, setDeleteLoading] = useState(false); // Loading state for deletion
  const [addImageLoading, setAddImageLoading] = useState(false); // Loading state for navigating to add image

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading when fetching data
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_press_images");
        setGalleryData(response.data["body-json"].body);
        console.error("Press images", response.data["body-json"].body);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, []);

  // Calculate indexes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryData.slice(indexOfFirstItem, indexOfLastItem);

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
    setSelectedItemId(itemId);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true); // Start loading for delete action
    try {
      await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_image_delete", {
        data: {
          id: selectedItemId,
        },
        headers: {
          Authorization: accessToken(),
        },
      });

      setGalleryData((prevData) => prevData.filter((item) => item.id !== selectedItemId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeleteLoading(false); // Stop loading after delete action
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleAddImage = () => {
    setAddImageLoading(true); // Set loading state to true when Add Image button is clicked
    navigate("/photo-upload");
  };

  return (
    <Container>
      <Button
        variant="outlined"
        onClick={handleAddImage}
        style={{ marginBottom: "20px", color: "red", position: "relative" }}
        disabled={addImageLoading} // Disable button when loading
      >
        {addImageLoading && (
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
        Add Image
      </Button>
      {loading ? (
        <CircularProgress /> // Show loading spinner while fetching data
      ) : (
        <Grid container spacing={2}>
          {currentItems.map((item) => (
            <Grid item key={item.id} xs={12} md={4}>
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
                <CardMedia component="img" height="300" image={item.imageUrl} alt="Gallery Image" sx={{ objectFit: "cover" }} />
                <IconButton
                  aria-label="more"
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={(e) => handleMenuOpen(e, item.id)}
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
                  <MenuItem onClick={() => handleDeleteClick(item.id)}>
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
      )}
      <Pagination
        count={Math.ceil(galleryData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Gallery;
