/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/employees/data/employeeTableList";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useRouter } from "hooks";
import WeeklyNoticeList from "./data/DictionaryList";

function Affiliation() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const router = useRouter();

  const handleAddEmployee = () => {
    router.push("/dictionary-add");
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
                justifyContent="space-between" // Align items horizontally
                alignItems="center" // Align items vertically
              >
                <MDTypography variant="h6" color="white">
                  Dictionary List
                </MDTypography>
                <Button variant="contained" color="white" onClick={handleAddEmployee}>
                  Word Add
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <WeeklyNoticeList table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Affiliation;
