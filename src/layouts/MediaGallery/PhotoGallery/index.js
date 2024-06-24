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
import Auth from "Auth";

const Gallery = () => {
  const navigate = useNavigate();
  const { token } = Auth();
  const [galleryData, setGalleryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addImageLoading, setAddImageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_galery_images_all_data");
        setGalleryData(response.data.body);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_image_delete", {
        data: { id: selectedItemId },
        headers: { Authorization: token },
      });
      setGalleryData((prevData) => prevData.filter((item) => item.id !== selectedItemId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete the image. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleImageUpload = () => {
    setAddImageLoading(true);
    navigate("/photo-upload");
  };

  return (
    <Container>
      <Button variant="outlined" onClick={handleImageUpload} style={{ marginBottom: "20px", color: "red" }} disabled={addImageLoading}>
        {addImageLoading ? <CircularProgress size={20} /> : "Add Image"}
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {currentItems.map((item) => (
            <Grid item key={item.id} xs={12} md={4}>
              <Card
                sx={{
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  position: "relative",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={item.imageUrl}
                  alt="Gallery Image"
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300?text=Image+Not+Available";
                  }}
                />
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
                  PaperProps={{ sx: { width: 150 } }}
                >
                  <MenuItem onClick={handleDeleteClick}>
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
