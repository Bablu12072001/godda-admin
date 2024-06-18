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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Auth from "Auth";
import axios from "axios";
import { apiUrl } from "Constants";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [loading,setLoading]=useState(false);
  const [data, setData] = useState(false);
  const {token}=Auth();
  const config={
    headers:{
      Authorization:token
    }
  }
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/jmoa_dashbord_member_and_visitor_count`,config);
      if (
        res.data["body-json"]["statusCode"] !== 200 ||
        res.data["body-json"]["statusCode"] === undefined
      ) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
      }
      if (
        res.data["body-json"]["body"] === undefined ||
        res.data["body-json"]["body"].length === 0
      ) {
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
      // console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
    fetchData();
  }, []);
  if(loading){
    return <DashboardLayout><div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20vh" }}><CircularProgress /></div></DashboardLayout>

  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {/* <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              /> */}
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Members"
                count={data?.memberCount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Total Members",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Visitors"
                count={data.visitorCount}
                percentage={{
                  color: "success",
                  // amount: "+3%",
                  label: "Total Website  Visitors",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {/* <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              /> */}
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              {/* <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              /> */}
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {/* <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                /> */}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {/* <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                /> */}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {/* <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                /> */}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              {/* <Projects /> */}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {/* <OrdersOverview /> */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
