/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { accessToken } from "services/variables";

// Material UI components
// import CircularProgress from "@mui/material/CircularProgress";
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

export default function data() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log("Hello!");

  const fetchData = async () => {
    console.log("Fetch Method");
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhdXNoYW5zaW5naGQyMDAzQGdtYWlsLmNvbSIsIm5hbWUiOiJSYXVzaGFuIEt1bWFyIiwiZ2VuZGVyIjoiTWFsZSIsInJvbGUiOiJhZG1pbiIsImNvbnRhY3ROdW1iZXIiOiI2MjAwMTE3NTc4IiwiZGVzaWduYXRpb24iOiJTb2Z0d2FyZSBkZXZlbG92ZXIiLCJkZXBhcnRtZW50IjoiQkNBIiwiaWF0IjoxNzA3Mjk2Mjc5LCJleHAiOjE3MDk4ODgyNzl9.f43rlVnP5DsXIagjfEiD6P9EtYsNwwL9z-87y8wTQM8"; // Your token here
      const headers = {
        Authorization: token,
      };

      const response = await axios.get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_employee_all_data", {
        headers: {
          Authorization: accessToken(),
        },
      });

      console.log("Response Data: ", response.data["body-json"].body);
      setData(response.data["body-json"].body);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run only once on component mount

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  //   return (
  //     <div>
  //       {/* {loading ? (
  //         <CircularProgress />
  //       ) : ( */}
  //       <TableContainer component={Paper}>
  //         <Table>
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Name</TableCell>
  //               <TableCell>Designation</TableCell>
  //               <TableCell>Department</TableCell>
  //               <TableCell>Joining Date</TableCell>
  //               <TableCell>Action</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
  //               <TableRow key={employee.pk}>
  //                 <TableCell>
  //                   <Author
  //                     image={employee.profile_image}
  //                     name={employee.name}
  //                     email={employee.email_id}
  //                   />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Job title={employee.role} description={employee.designation} />
  //                 </TableCell>
  //                 <TableCell>{employee.department}</TableCell>
  //                 <TableCell>
  //                   <MDTypography variant="caption" color="text" fontWeight="medium">
  //                     {employee.joiningDate}
  //                   </MDTypography>
  //                 </TableCell>
  //                 <TableCell>
  //                   <MDTypography
  //                     component="a"
  //                     href={`#edit/${employee.pk}`} // Provide a proper link or action
  //                     variant="caption"
  //                     color="text"
  //                     fontWeight="medium"
  //                   >
  //                     Edit
  //                   </MDTypography>
  //                 </TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //         <TablePagination
  //           rowsPerPageOptions={[10, 25, 50]}
  //           component="div"
  //           count={data.length}
  //           rowsPerPage={rowsPerPage}
  //           page={page}
  //           onPageChange={handleChangePage}
  //           onRowsPerPageChange={handleChangeRowsPerPage}
  //         />
  //       </TableContainer>
  //       {/* )} */}
  //     </div>
  //   );
  // }

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Designation", accessor: "designation", width: "20%", align: "left" },
      { Header: "Department", accessor: "department", width: "20%", align: "left" },
      { Header: "Joining Date", accessor: "joiningDate", width: "20%", align: "center" },
      { Header: "Action", accessor: "action", width: "20%", align: "center" },
    ],
    rows: data.map((employee) => ({
      name: <Author image={employee.profile_image} name={employee.name} email={employee.email_id} />,
      designation: <Job title={employee.role} description={employee.designation} />,
      department: employee.department,
      joiningDate: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {employee.joiningDate}
        </MDTypography>
      ),
      action: (
        <MDTypography
          component="a"
          href={`#edit/${employee.pk}`} // Provide a proper link or action
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          Edit
        </MDTypography>
      ),
    })),
    //   columns: [
    //     { Header: "author", accessor: "author", width: "45%", align: "left" },
    //     { Header: "function", accessor: "function", align: "left" },
    //     { Header: "status", accessor: "status", align: "center" },
    //     { Header: "employed", accessor: "employed", align: "center" },
    //     { Header: "action", accessor: "action", align: "center" },
    //   ],

    //   rows: [
    //     {
    //       author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //       function: <Job title="Manager" description="Organization" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           23/04/18
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //     {
    //       author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //       function: <Job title="Programator" description="Developer" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           11/01/19
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //     {
    //       author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //       function: <Job title="Executive" description="Projects" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           19/09/17
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //     {
    //       author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
    //       function: <Job title="Programator" description="Developer" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           24/12/08
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //     {
    //       author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
    //       function: <Job title="Manager" description="Executive" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           04/10/21
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //     {
    //       author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
    //       function: <Job title="Programator" description="Developer" />,
    //       status: (
    //         <MDBox ml={-1}>
    //           <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //         </MDBox>
    //       ),
    //       employed: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           14/09/20
    //         </MDTypography>
    //       ),
    //       action: (
    //         <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //           Edit
    //         </MDTypography>
    //       ),
    //     },
    //   ],
  };
}
