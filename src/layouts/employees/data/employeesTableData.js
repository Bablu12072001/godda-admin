// /* eslint-disable react/prop-types */
// /* eslint-disable react/function-component-definition */
// /**
// =========================================================
// * Material Dashboard 2 React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import MDBadge from "components/MDBadge";

// // Images
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { accessToken } from "services/variables";

// // Material UI components
// import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

// export default function Data() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_employee_all_data", {
//         headers: {
//           Authorization: accessToken(),
//         },
//       });

//       setData(response.data["body-json"].body);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []); // Run only once on component mount

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const Author = ({ image, name, email }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDAvatar src={image} name={name} size="sm" />
//       <MDBox ml={2} lineHeight={1}>
//         <MDTypography display="block" variant="button" fontWeight="medium">
//           {name}
//         </MDTypography>
//         <MDTypography variant="caption">{email}</MDTypography>
//       </MDBox>
//     </MDBox>
//   );

//   const Job = ({ title, description }) => (
//     <MDBox lineHeight={1} textAlign="left">
//       <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
//         {title}
//       </MDTypography>
//       <MDTypography variant="caption">{description}</MDTypography>
//     </MDBox>
//   );

//   return {
//     columns: [
//       { Header: "Name", accessor: "name", width: "10%", align: "left" },
//       { Header: "Designation", accessor: "designation", width: "10%", align: "left" },
//       { Header: "Department", accessor: "department", width: "10%", align: "left" },
//       { Header: "Joining Date", accessor: "joiningDate", width: "10%", align: "center" },
//       { Header: "Gender", accessor: "gender", width: "10%", align: "center" },
//       { Header: "Qualification", accessor: "qualification", width: "10%", align: "center" },
//       { Header: "Bank Details", accessor: "bankDetails", width: "10%", align: "center" },

//       { Header: "Action", accessor: "action", width: "10%", align: "center" },
//     ],
//     rows: data.map((employee) => ({
//       name: <Author image={employee.profile_image} name={employee.name} email={employee.email_id} />,
//       designation: <Job title={employee.role} description={employee.designation} />,
//       department: employee.department,
//       joiningDate: (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {employee.joiningDate}
//         </MDTypography>
//       ),
//       gender: employee.gender,
//       qualification: employee.qualification,
//       bankDetails: (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           IFSC: {employee.bankDetails.ifsc}, <br /> Account No: {employee.bankDetails.accountNo}
//         </MDTypography>
//       ),
//       // address: (
//       //   <MDTypography variant="caption" color="text" fontWeight="medium">
//       //     Village: {employee.address.village} ,<br /> City:{employee.address.city},<br /> State:{employee.address.state},<br /> Pincode:
//       //     {employee.address.pincode}
//       //   </MDTypography>
//       // ),
//       action: (
//         <MDTypography
//           component="a"
//           href={`#edit/${employee.pk}`} // Provide a proper link or action
//           variant="caption"
//           color="text"
//           fontWeight="medium"
//         >
//           Edit
//         </MDTypography>
//       ),
//     })),
//   };
// }

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

const employeeTableList = () => {
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

export default employeeTableList;
