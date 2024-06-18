// // VideoGallery.js

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   CardMedia,
//   Grid,
//   Pagination,
//   Menu,
//   MenuItem,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogActions,
//   Button,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { accessToken } from "services/variables";

// const VideoGallery = () => {
//   const navigate = useNavigate();
//   const [videoData, setVideoData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedItemId, setSelectedItemId] = useState("");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_gallery_videos_all_data"
//         );
//         setVideoData(response.data["body-json"].body);
//       } catch (error) {
//         console.error("Error fetching video gallery data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = videoData.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDeleteClick = (itemId) => {
//     setDeleteDialogOpen(true);
//     setSelectedItemId(itemId);
//     handleMenuClose();
//   };

//   const handleDeleteConfirm = async () => {
//     console.log(selectedItemId);
//     try {
//       const response = await axios.delete(
//         "_delete",
//         { id: selectedItemId },
//         {
//           headers: {
//             Authorization: accessToken(),
//           },
//         }
//       );
//       console.log(response.data);
//       setVideoData((prevData) => prevData.filter((item) => item.id !== selectedItemId));
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       console.error("Error deleting video:", error);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setSelectedItemId(null);
//   };

//   return (
//     <Container>
//       <Button
//         variant="outlined"
//         onClick={() => {
//           navigate("/video-form");
//         }}
//         style={{ marginBottom: "20px", color: "red" }}
//       >
//         Add Video
//       </Button>
//       <Grid container spacing={2}>
//         {currentItems.map((video) => (
//           <Grid item key={video.id} xs={12} md={4}>
//             <Card
//               sx={{
//                 overflow: "hidden",
//                 transition: "transform 0.2s",
//                 position: "relative",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                 },
//               }}
//             >
//               <CardMedia
//                 component="iframe"
//                 src={`https://www.youtube.com/embed/${video.youtube_url}`}
//                 height="250"
//                 title="Video"
//               />
//               <IconButton
//                 onClick={handleMenuOpen}
//                 sx={{ position: "absolute", top: 0, right: -10, color: "white" }}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 transformOrigin={{ vertical: "top", horizontal: "right" }}
//                 PaperProps={{
//                   sx: {
//                     width: 150,
//                   },
//                 }}
//               >
//                 <MenuItem onClick={() => handleDeleteClick(video.id)}>
//                   <IconButton aria-label="delete" color="inherit">
//                     <DeleteIcon />
//                   </IconButton>
//                   Remove
//                 </MenuItem>
//               </Menu>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Pagination
//         count={Math.ceil(videoData.length / itemsPerPage)}
//         page={currentPage}
//         onChange={handlePageChange}
//         color="primary"
//         style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
//       />

//       <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
//         <DialogTitle>Are you sure you want to delete this video?</DialogTitle>
//         <DialogActions>
//           <Button onClick={handleDeleteCancel} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="primary">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default VideoGallery;

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

const VideoGallery = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true); // State for API loading
  const [addVideoLoading, setAddVideoLoading] = useState(false); // State for add video loading
  const [deleteLoading, setDeleteLoading] = useState(false); // State for delete loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true before API call
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_gallery_videos_all_data");
        setVideoData(response.data["body-json"].body);
      } catch (error) {
        console.error("Error fetching video gallery data:", error);
      } finally {
        setLoading(false); // Set loading state to false after API call
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
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
    setDeleteLoading(true); // Set delete loading state to true
    const toekn = accessToken();

    try {
      await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_videos_delete", {
        headers: {
          Authorization: accessToken(),
        },
        data: { id: selectedItemId },
      });
      console.log("Access token is ", toekn);
      setVideoData((prevData) => prevData.filter((item) => item.id !== selectedItemId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeleteLoading(false); // Set delete loading state to false
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleAddVideo = () => {
    setAddVideoLoading(true); // Set add video loading state to true
    navigate("/video-form"); // Navigate to the video form page
  };

  return (
    <Container>
      <Button
        variant="outlined"
        onClick={handleAddVideo}
        style={{ marginBottom: "20px", color: "red" }}
        disabled={addVideoLoading || loading} // Disable button if adding video or API call is loading
      >
        {addVideoLoading ? (
          <CircularProgress size={20} /> // Show circular progress if adding video
        ) : (
          "Add Video"
        )}
      </Button>
      <Grid container spacing={2}>
        {loading ? (
          <CircularProgress /> // Show loading indicator if data is being fetched
        ) : (
          currentItems.map((video) => (
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
                <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", top: 0, right: -10, color: "white" }}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
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
          ))
        )}
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
            {deleteLoading ? (
              <CircularProgress size={20} /> // Show circular progress if deleting
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VideoGallery;
