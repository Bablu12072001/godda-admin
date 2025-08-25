import axios from "axios";
import React, { useState } from "react";
import {
  Button,
  Skeleton,
  Stack,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TablePagination,
  useMediaQuery,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "Constants";
import swal from "sweetalert";
import Auth from "Auth";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Circular() {
  const navigate = useNavigate();
  const { token } = Auth();

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const skeletonArray = Array.from({ length: 5 }, (_, index) => (
    <React.Fragment key={index}>
      <Skeleton variant="wave" width={"100%"} height={40} />
      <br />
    </React.Fragment>
  ));

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/godda_get_prc_by_type?type=${type}`, config);
      setData(res.data.data);
      setText(type.replace(" prc", " PRC"));
    } catch (error) {
      swal("Error!", "Error fetching data!! " + error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, typeText) => {
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
      try {
        setLoading(true);
        await axios.delete(`${apiUrl}/delete_prc?id=${id}`, {
          headers: { Authorization: token },
        });
        swal("Success!", "Data deleted!!", "success");
        fetchData(typeText.toLowerCase());
      } catch (error) {
        swal("Error!", "Error deleting data!! " + error, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
    setAnchorEl(null);
    setPdfFile(null); // reset
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setPdfFile(null);
  };

  // ✅ Presigned URL PDF Upload
  const uploadPdfToPresignedUrl = async () => {
    if (!pdfFile) {
      console.error("No PDF file selected.");
      return "";
    }

    try {
      const presignResponse = await axios.post(
        "https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/prc_presign",
        {
          file_name: pdfFile.name,
        },
        config
      );

      const uploadUrl = presignResponse?.data?.["body-json"]?.body;
      if (!uploadUrl) {
        console.error("Presigned URL not received", presignResponse?.data);
        swal("Error!", "Presigned URL not received from server.", "error");
        return "";
      }

      const fileUrl = uploadUrl.split("?")[0];

      await axios.put(uploadUrl, pdfFile, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      return fileUrl;
    } catch (error) {
      console.error("PDF Upload Error:", error);
      swal("Error!", "Failed to upload PDF.", "error");
      return "";
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let finalPdfUrl = selectedItem?.pdf || "";

      if (pdfFile) {
        const uploadedUrl = await uploadPdfToPresignedUrl();
        if (uploadedUrl) {
          finalPdfUrl = uploadedUrl;
        } else {
          return;
        }
      }

      const payload = {
        ...selectedItem,
        pdf: finalPdfUrl,
      };

      await axios.put(`${apiUrl}/godda_update_prc`, payload, config);

      swal("Success!", "PRC updated successfully!", "success");
      setDialogOpen(false);
      fetchData(selectedItem.type.toLowerCase());
    } catch (error) {
      swal("Error!", "Failed to update PRC. " + error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <>
      <Stack direction={isSmallScreen ? "column" : "row"} spacing={2} alignItems={isSmallScreen ? "stretch" : "center"}>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"].map((label) => (
          <Button key={label} variant="contained" color="success" onClick={() => fetchData(`${label.toLowerCase()} prc`)}>
            {label} PRC
          </Button>
        ))}
        <Button variant="contained" color="warning" style={{ marginLeft: "auto", marginRight: "5vw" }} onClick={() => navigate("/addp")}>
          ADD PRC
        </Button>
      </Stack>

      <br />
      <Typography variant="h6" style={{ color: "blue" }}>
        {text}
      </Typography>

      {loading ? (
        skeletonArray
      ) : text ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ display: "table-header-group" }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Letter No.</TableCell>
                <TableCell>Applicable Period</TableCell>
                <TableCell>DA Rate</TableCell>
                <TableCell>PDF</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.letterNo}</TableCell>
                  <TableCell>{item.applicablePeriod}</TableCell>
                  <TableCell>{item.daRate}</TableCell>
                  <TableCell>
                    {item.pdf ? (
                      <Button variant="text" size="small" href={item.pdf} target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
                        View PDF
                      </Button>
                    ) : (
                      <Button variant="text" size="small" disabled style={{ color: "black" }}>
                        No PDF
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{item.remarks}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
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
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      ) : null}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(selectedRow)}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(selectedRow.id, text);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit PRC</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Letter No"
            margin="dense"
            value={selectedItem?.letterNo || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, letterNo: e.target.value })}
          />
          <TextField
            fullWidth
            label="Applicable Period"
            margin="dense"
            value={selectedItem?.applicablePeriod || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, applicablePeriod: e.target.value })}
          />
          <TextField
            fullWidth
            label="DA Rate"
            margin="dense"
            value={selectedItem?.daRate || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, daRate: e.target.value })}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={selectedItem?.date || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, date: e.target.value })}
          />
          <TextField
            fullWidth
            label="Remarks"
            margin="dense"
            value={selectedItem?.remarks || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, remarks: e.target.value })}
          />
          <TextField
            fullWidth
            label="Current PDF URL"
            margin="dense"
            value={selectedItem?.pdf || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, pdf: e.target.value })}
          />

          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} style={{ marginTop: 10 }}>
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setPdfFile(e.target.files[0]);
                }
              }}
            />
          </Button>

          <TextField
            fullWidth
            label="Type (e.g. 1st-prc)"
            margin="dense"
            value={selectedItem?.type || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}
          />
          <TextField fullWidth label="ID" margin="dense" disabled value={selectedItem?.id || ""} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
