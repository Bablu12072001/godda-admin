import axios from "axios";
import React, { useState } from "react";
import {
  Button,
  Skeleton,
  Stack,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  TablePagination,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "Constants";
import swal from "sweetalert";
import Auth from "Auth";

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

  // Responsive hook
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // For menu in each row
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  // For Edit Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    link: "",
    date: "",
    issueNo: "",
  });

  // Menu handlers
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // View PDF
  // const handleViewPDF = async (pdfLink) => {
  //   window.open(pdfLink, "_blank");
  // };
  // const handleViewPDF = (link) => {
  //   if (link) {
  //     window.open(link, "_blank", "noopener,noreferrer");
  //   } else {
  //     alert("PDF link not available.");
  //   }
  // };
  const handleViewPDF = (pdfLink) => {
    const viewerLink = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfLink)}`;
    const newTab = window.open(viewerLink, "_blank");
    if (!newTab) {
      alert("Please allow pop-ups for this site to view PDF.");
    }
  };

  const skeletonArray = Array.from({ length: 5 }, (_, index) => (
    <React.Fragment key={index}>
      <Skeleton variant="wave" width={"100%"} height={40} />
      <br />
    </React.Fragment>
  ));

  // Fetch data function
  const fetchData = async (url, fetchFunc) => {
    try {
      setLoading(true);
      const res = await axios.get(url, config);
      // Defensive check for response
      const statusCode = res.data?.["body-json"]?.statusCode;
      const body = res.data?.["body-json"]?.body;
      if (statusCode !== 200 || statusCode === undefined) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
        setData([]);
      } else if (!body || body.length === 0) {
        setData([]);
      } else {
        setData(body);
      }
      fetchFunc();
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

  // Different fetch functions
  const fetchCircular = async () => fetchData(`${apiUrl}/jmoa_circular_all_data`, setText.bind(null, "Circular"));
  const fetchResolution = async () => fetchData(`${apiUrl}/jmoa_resolution_all_data`, setText.bind(null, "Acts & Rules"));
  const fetchNotice = async () => fetchData(`${apiUrl}/jmoa_notice_all_data`, setText.bind(null, "Publication"));
  const fetchActs = async () => fetchData(`${apiUrl}/get_all_documents`, setText.bind(null, "JSNGEF Documents"));

  // Delete handler
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
      let url = "";
      if (text === "Acts & Rules") url = "jmoa_resolution_delete";
      else if (text === "Notice") url = "jmoa_notice_delete";
      else if (text === "JSNGEF Documents") url = "documents_delete";
      else if (text === "Circular") url = "jmoa_circular_delete";

      try {
        setLoading(true);
        const res = await axios.delete(`${apiUrl}/${url}`, {
          data: { id: id },
          headers: { Authorization: token },
        });
        if (res.data["body-json"]?.statusCode !== 200 || res.data["body-json"]?.statusCode === undefined) {
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
        }

        if (text === "Acts & Rules") fetchResolution();
        else if (text === "Notice") fetchNotice();
        else if (text === "JSNGEF Documents") fetchActs();
        else if (text === "Circular") fetchCircular();
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

  // Open Edit dialog and fill data
  const handleEditOpen = (item) => {
    setEditData({
      id: item.id,
      title: item.title,
      link: item.link,
      date: item.date,
      issueNo: item.issueNo,
      base64: "", // no change needed here
    });
    setEditOpen(true);
    handleMenuClose();
  };

  // Close Edit dialog
  const handleEditClose = () => {
    setEditOpen(false);
  };

  // Handle form changes in edit dialog
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Submit Edit form
  const handleEditSubmit = async () => {
    try {
      setLoading(true);

      console.log("Sending update payload:", editData);

      const res = await axios.post(
        "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_circular_update",
        {
          id: editData.id,
          title: editData.title,
          link: editData.link,
          date: editData.date,
          issueNo: editData.issueNo,
          base64: "", // as per API example
        },
        config
      );

      console.log("Update response:", res.data);

      if (res.data["body-json"]?.statusCode === 200) {
        swal("Success", "Circular updated successfully!", "success");
        fetchCircular();
        handleEditClose();
      } else if (res.data["body-json"]?.statusCode === 404) {
        swal("Error", res.data["body-json"]?.body || "Circular not found.", "error");
      } else {
        swal("Error", "Failed to update circular.", "error");
      }
    } catch (error) {
      console.error("Edit error:", error);
      swal("Error", "Failed to update circular: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const capitalizeFirstLetter = (text) => {
    return text?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  };

  return (
    <>
      <div className="p-4">
        <Stack direction={isSmallScreen ? "column" : "row"} spacing={2} alignItems={isSmallScreen ? "stretch" : "center"}>
          <Button variant="contained" color="success" onClick={() => fetchResolution()}>
            Acts & Rules
          </Button>
          <Button variant="contained" color="success" onClick={() => fetchCircular()}>
            Circular
          </Button>
          <Button variant="contained" color="success" onClick={() => fetchActs()}>
            JSNGEF Documents
          </Button>
          <Button variant="contained" color="success" onClick={() => fetchNotice()}>
            Publication
          </Button>
          <Button variant="contained" color="warning" onClick={() => navigate("/add")} style={{ marginLeft: "auto" }}>
            Add
          </Button>
        </Stack>

        <h2 className="text-xl font-bold my-4" style={{ color: "blue" }}>
          {text}
        </h2>

        {loading ? (
          skeletonArray
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ display: "table-header-group" }}>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Issue No.</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={item.id || index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.issueNo}</TableCell>
                    <TableCell>{capitalizeFirstLetter(item.title)}</TableCell>
                    <TableCell>
                      <VisibilityIcon style={{ color: "green", cursor: "pointer" }} onClick={() => handleViewPDF(item.link)} />
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={(e) => handleMenuOpen(e, item.id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuRowId === item.id}
                        onClose={handleMenuClose}
                        PaperProps={{
                          style: {
                            maxHeight: 48 * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleEditOpen(item)}>Edit</MenuItem>
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
        )}

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Circular</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Title" name="title" value={editData.title} onChange={handleEditChange} fullWidth />
              <TextField label="Link" name="link" value={editData.link} onChange={handleEditChange} fullWidth />
              <TextField label="Date" name="date" value={editData.date} onChange={handleEditChange} fullWidth placeholder="DD/MM/YYYY" />
              <TextField label="Issue No." name="issueNo" value={editData.issueNo} onChange={handleEditChange} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSubmit} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
