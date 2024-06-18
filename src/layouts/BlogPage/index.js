// NewsEventTable.js

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Divider,
  Chip,
  TablePagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { accessToken } from "services/variables";
import { useNavigate } from "react-router-dom";

const NewBlogTable = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemdata, setSelectedItemdata] = useState(null);
  const [selectedItemDeletedata, setSelectedItemDeletedata] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //edit function

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editid, setEditid] = useState("");

  //edit function

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleEdit = () => {
    setEditid(selectedItem.id);
    setEditTitle(selectedItem.title);
    setEditAuthor(selectedItem.author);
    setEditContent(selectedItem.content);
    setEditDialogOpen(true);
    handleClose();
  };

  const handleEditSave = async () => {
    console.log(editid);
    try {
      setLoading(true);
      const response = await axios.put(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/_blog_edit",
        {
          id: editid,
          title: editTitle,
          author: editAuthor,
          content: editContent,
          base64: [],
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      console.log(response.data);

      if (response.data["body-json"].statusCode === 200) {
        // Update the data in the state
        setNewsData((prevData) =>
          prevData.map((data) => (data.id === editid ? { ...data, title: editTitle, author: editAuthor, content: editContent } : data))
        );
        console.log("Blog edited successfully!");
        setEditDialogOpen(false);
      } else {
        console.log("Failed to edit blog.");
      }
    } catch (error) {
      console.error("Error editing blog:", error);
      console.log("Failed to edit blog.");
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleClick = (event, item) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedItem(item);
  // };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  // const handleEdit = () => {
  //   console.log(selectedItem);
  //   handleClose();
  // };

  const handleDelete = (id) => {
    setSelectedItemDeletedata(id);
    setOpenConfirmation(true);
    handleClose();
  };

  const handleCancel = () => {
    setSelectedItemDeletedata(null);
    setOpenConfirmation(false);
  };

  // delete api

  const handleDeleteConfirmed = async () => {
    setOpenConfirmation(false);
    try {
      setLoading(true);
      const response = await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_blog_delete", {
        data: { id: selectedItemDeletedata },
        headers: {
          Authorization: accessToken(),
        },
      });

      console.log(response.data);

      // Check if the delete operation was successful
      if (response.data["body-json"].statusCode === 200) {
        // Update the state to reflect the deletion
        setNewsData((prevData) => prevData.filter((data) => data.id !== selectedItemDeletedata));
        console.log("Blog deleted successfully!");
      } else {
        console.log("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      console.log("Failed to delete blog.");
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  };

  const handleView = (item) => {
    setSelectedItemdata(item);
    setDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setSelectedItemdata(null);
    setDetailsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_blog_all_data", {
          headers: {
            Authorization: accessToken(),
          },
        });
        setNewsData(response.data["body-json"].body);
      } catch (error) {
        console.error("Error fetching news event data:", error);
      } finally {
        setLoading(false); // Set loading state to false after API call
      }
    };

    fetchData();
  }, []);

  const truncateString = (str, numWords) => {
    const words = str.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    } else {
      return str;
    }
  };

  return (
    <DashboardLayout>
      <Button
        variant="outlined"
        onClick={() => {
          navigate("/new-blog");
        }}
        style={{ marginBottom: "20px", color: "red" }}
        disabled={loading} // Disable button when loading
      >
        Add Blog
      </Button>
      {loading && <CircularProgress size={24} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ display: "table-header-group" }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.imageUrl.length > 0 && <Avatar alt="Image" src={item.imageUrl[0]} />}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.content}</TableCell>

                  <TableCell>
                    <IconButton color="inherit" onClick={(e) => handleClick(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedItem?.id === item.id} onClose={handleClose} elevation={1}>
                      <MenuItem onClick={handleEdit}>
                        <EditIcon /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(item.id)}>
                        <DeleteIcon /> Delete
                      </MenuItem>
                      <MenuItem onClick={() => handleView(item)}>
                        <VisibilityIcon /> View
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={newsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={detailsModalOpen} onClose={handleDetailsModalClose} maxWidth="md">
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          {selectedItemdata && (
            <>
              <Typography variant="subtitle1">{selectedItemdata.title}</Typography>
              <Divider style={{ margin: "10px 0" }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DialogContentText>
                    <strong>Date:</strong> {selectedItemdata.date}
                  </DialogContentText>
                </Grid>
                <Grid item xs={6}>
                  <DialogContentText>
                    <strong>Time:</strong> {selectedItemdata.time}
                  </DialogContentText>
                </Grid>
                <Grid item xs={12}>
                  <DialogContentText>
                    <strong>Content:</strong> {selectedItemdata.content}
                  </DialogContentText>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Images:</Typography>
                  {selectedItemdata.imageUrl.map((image, index) => (
                    <Chip key={index} label={`Image ${index + 1}`} component="a" href={image} target="_blank" clickable />
                  ))}
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmation} onClose={handleCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this data?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={() => handleDeleteConfirmed()} color="error">
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="md">
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <TextField label="Author" fullWidth margin="normal" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
          <TextField label="Content" fullWidth multiline rows={4} margin="normal" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default NewBlogTable;
