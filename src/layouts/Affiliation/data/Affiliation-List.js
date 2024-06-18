import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const AffiliationList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [noticeData, setNoticeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_affiliation_all_data", {
          headers: {
            Authorization: accessToken(),
          },
        });
        console.log("Affilation data", response);
        setNoticeData(response.data["body-json"].body);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching weekly notice data:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (noticeId) => {
    try {
      if (!noticeId) {
        Swal.fire("Error", "The record ID is missing. Please try again.", "error");
        return;
      }

      // Delete record using delete API
      await axios.delete(`https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_affiliations_delete`, {
        data: { id: noticeId },
        headers: {
          Authorization: accessToken(),
        },
      });

      // Remove the deleted record from the state
      setNoticeData((prevData) => prevData.filter((notice) => notice.id !== noticeId));

      Swal.fire("Deleted!", "The record has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting weekly notice:", error);
      Swal.fire("Error", "An error occurred while deleting the record.", "error");
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <MDBox component="thead">
            <TableRow>
              <TableCell>S.N</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </MDBox>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              noticeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((notice, index) => (
                <TableRow key={notice.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{notice.title}</TableCell>
                  <TableCell>{notice.description}</TableCell>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="info" onClick={() => handleDelete(notice.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={noticeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AffiliationList;
