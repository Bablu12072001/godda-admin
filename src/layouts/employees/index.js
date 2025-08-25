// @mui material components
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Data
import EmployeeTablesList from "layouts/employees/data/employeeTableList";

// Hooks
import { useRouter } from "hooks";

// Custom upload dialog component
import MemberUploadDialog from "./MemberUploadDialog";

function EmployeeTables() {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleAddEmployee = () => {
    router.push("/memberAdd");
  };

  const handleOpenUploadForm = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadForm = () => {
    setUploadDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Members Table
                </MDTypography>
                <Stack direction="row" spacing={1}>
                  {/* <Button variant="contained" color="white" onClick={() => router.push("/uploadFormList")}>
                    Upload Form List
                  </Button> */}
                  <Button variant="contained" color="white" onClick={handleOpenUploadForm}>
                    Members Upload Form
                  </Button>
                  <Button variant="contained" color="white" onClick={handleAddEmployee}>
                    Members Add
                  </Button>
                </Stack>
              </MDBox>

              {/* Members table data component */}
              <EmployeeTablesList />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Upload dialog component */}
      <MemberUploadDialog open={uploadDialogOpen} onClose={handleCloseUploadForm} />

      <Footer />
    </DashboardLayout>
  );
}

export default EmployeeTables;
