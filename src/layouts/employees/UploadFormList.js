import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function UploadFormList() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_get_member");

      // Extract URLs from the actual API structure
      const urls = response.data["body-json"]["body"]["urls"] || [];
      console.log("Thisis the urls", response.data["body-json"]["body"]["urls"]);

      setUploads(urls);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" p={3} mb={2}>
                <MDTypography variant="h6" color="white">
                  Uploaded Members Form List
                </MDTypography>
              </MDBox>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ display: "table-header-group" }}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Preview</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : uploads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No uploaded forms found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      uploads.map((url, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Button variant="outlined" color="primary" href={url} target="_blank">
                              Preview
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" color="success" href={url} target="_blank" download>
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default UploadFormList;
