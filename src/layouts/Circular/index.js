import React from "react";
import AllCircular from "./AllCircular";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
export default function index() {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar/>
        {/* <DashboardNavbar />  */}
        {/* absolute isMini*/ }
        <br />
      <AllCircular />
      </DashboardLayout>
    </>
  );
}
