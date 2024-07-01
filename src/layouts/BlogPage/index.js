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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState("");

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleEdit = () => {
    setEditId(selectedItem.id);
    setEditTitle(selectedItem.title);
    setEditAuthor(selectedItem.author);
    setEditContent(selectedItem.content);
    setEditDialogOpen(true);
    handleClose();
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_blog_edit",
        {
          id: editId,
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

      if (response.data["body-json"].statusCode === 200) {
        setNewsData((prevData) =>
          prevData.map((data) => (data.id === editId ? { ...data, title: editTitle, author: editAuthor, content: editContent } : data))
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
      setLoading(false);
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

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = (id) => {
    setSelectedItemDeletedata(id);
    setOpenConfirmation(true);
    handleClose();
  };

  const handleCancel = () => {
    setSelectedItemDeletedata(null);
    setOpenConfirmation(false);
  };

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

      if (response.data["body-json"].statusCode === 200) {
        setNewsData((prevData) => prevData.filter((data) => data.id !== selectedItemDeletedata));
        console.log("Blog deleted successfully!");
      } else {
        console.log("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      console.log("Failed to delete blog.");
    } finally {
      setLoading(false);
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
        setLoading(false);
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
        disabled={loading}
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
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.imageUrl.length > 0 && <Avatar alt="Image" src={item.imageUrl[0]} />}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>{truncateString(item.content, 20)}</TableCell>
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Author: {selectedItemdata.author}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date: {selectedItemdata.date}</Typography>
                </Grid>
              </Grid>
              <Divider style={{ margin: "10px 0" }} />
              {selectedItemdata.imageUrl.length > 0 && (
                <>
                  <Typography variant="subtitle2">Image:</Typography>
                  <Avatar alt="Image" src={selectedItemdata.imageUrl[0]} style={{ width: "100%", height: "auto" }} />
                </>
              )}
              <Divider style={{ margin: "10px 0" }} />
              <Typography variant="subtitle2">Content:</Typography>
              <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                {selectedItemdata.content}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsModalClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="md">
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the details of the blog.</DialogContentText>
          <TextField autoFocus margin="dense" label="Title" type="text" fullWidth value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <TextField margin="dense" label="Author" type="text" fullWidth value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmation} onClose={handleCancel}>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this blog? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default NewBlogTable;
