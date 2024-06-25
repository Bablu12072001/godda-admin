import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Button,
  Skeleton,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  TablePagination,
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "Constants";
import swal from "sweetalert";
import Auth from "Auth";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Circular() {
  const navigate = useNavigate();
  const { token } = Auth();
  let config = {
    headers: {
      Authorization: token,
    },
  };

  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const skeletonArray = Array.from({ length: 5 }, (_, index) => (
    <>
      <Skeleton key={index} variant="wave" width={"100%"} height={40} />
      <br />
    </>
  ));

  const fetchFilteredData = async (teamType) => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/jmoa_leadership_filter_all_data`, { team: teamType }, config);
      if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
      }
      if (res.data["body-json"]["body"] === undefined || res.data["body-json"]["body"].length === 0) {
        setData([]);
      } else {
        setData(res.data["body-json"]["body"]);
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "Error fetching data!! " + error,
        icon: "error",
        button: "Aww No!",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, text) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });
    if (result.isConfirmed) {
      const url = "jmoa_leadership_delete";
      try {
        setLoading(true);
        const res = await axios.delete(`${apiUrl}/${url}`, {
          data: { id: id },
          headers: {
            Authorization: token,
          },
        });
        if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
          swal({
            title: "Error!",
            text: "Error deleting data!!",
            icon: "error",
            button: "Ok!",
          });
        } else {
          swal({
            title: "Success!",
            text: "Data deleted!!",
            icon: "success",
            button: "Ok!",
          });
          fetchFilteredData(text);
        }
      } catch (error) {
        swal({
          title: "Error!",
          text: "Error deleting data!! " + error,
          icon: "error",
          button: "Ok!",
        });
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMenuOpen = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // const handleEdit = (item) => {
  //   setSelectedItem(item);
  //   setDialogOpen(true);
  //   setMenuAnchor(null);
  // };
  const handleEdit = (item) => {
    setSelectedItem(item); // Set the selected item when editing
    setImageFile(null); // Reset image file state when opening dialog
    setDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null); // Reset selected item when closing dialog
  };

  const handleSave = async () => {
    const url = "jmoa_leadership_update"; // Assuming you have an update endpoint
    try {
      setLoading(true);
      let imageUrl = selectedItem.imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await axios.post(`${apiUrl}/upload_image`, formData, config);
        imageUrl = uploadRes.data.url;
      }
      const updatedItem = { ...selectedItem, imageUrl };
      const res = await axios.put(`${apiUrl}/${url}`, updatedItem, config);
      if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
        swal({
          title: "Error!",
          text: "Error updating data!!",
          icon: "error",
          button: "Ok!",
        });
      } else {
        swal({
          title: "Success!",
          text: "Data updated!!",
          icon: "success",
          button: "Ok!",
        });
        fetchFilteredData(text);
        handleDialogClose();
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "Error updating data!! " + error,
        icon: "error",
        button: "Ok!",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (text) {
      fetchFilteredData(text);
    }
  }, [page, rowsPerPage]);

  return (
    <>
      <div className="">
        <Stack direction="row" spacing={5}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchFilteredData("State Leadership Team");
              setText("State Leadership Team");
            }}
          >
            State Leadership Team
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchFilteredData("District Leadership Team");
              setText("District Leadership Team");
            }}
          >
            District Leadership Team
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchFilteredData("Block Leadership Team");
              setText("Block Leadership Team");
            }}
          >
            Block Leadership Team
          </Button>
          <Button
            variant="contained"
            color="warning"
            style={{ marginLeft: "auto", marginRight: "5vw" }}
            onClick={() => {
              navigate("/add-Leadrship");
            }}
          >
            Add
          </Button>
        </Stack>
        <br />
        <div>
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: "blue" }}>
              {text}
            </h2>
            {loading ? (
              skeletonArray
            ) : (
              <>
                {text !== "" ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead style={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Serial No.</TableCell>
                          <TableCell>Name </TableCell>
                          <TableCell>District.</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Image</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.district}</TableCell>
                            <TableCell>{item.message}</TableCell>
                            <TableCell>{item.position}</TableCell>
                            <TableCell>
                              <Avatar alt={item.name} src={item.imageUrl} />
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={(event) => handleMenuOpen(event, item)}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                                <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                                <MenuItem onClick={() => handleDelete(item.id, text)}>Delete</MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={rowsPerPageOptions}
                      component="div"
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Leadership Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={selectedItem?.name || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="District"
            fullWidth
            value={selectedItem?.district || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, district: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            value={selectedItem?.message || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, message: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Position"
            fullWidth
            value={selectedItem?.position || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, position: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {selectedItem?.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem?.name} style={{ width: "250px", marginTop: "10px" }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
