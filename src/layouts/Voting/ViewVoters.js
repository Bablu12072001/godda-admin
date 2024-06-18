import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import {
  Button,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import swal from "sweetalert";
import Auth from "Auth";
import {
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TablePagination,
} from "@mui/material";
import { apiUrl } from "Constants";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import BackButton from "components/BackButton";

export default function ViewVoters() {
  const { token } = Auth();
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const { id, poll } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [countData, setCountData] = useState({
    yes: 0,
    no: 0,
    other: 0,
    total: 0,
  });

  const skeletonArray = Array.from({ length: 8 }, (_, index) => (
    <>
      <Skeleton key={index} variant="wave" width={"100%"} height={40} />
      <br />
    </>
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${apiUrl}//jmoa_voting_particular_all_data`,
          { id: id },
          {
            headers: {
              Authorization: token,
            },
          }
        );

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
          // Calculate counts
          const counts = res.data["body-json"]["body"].reduce(
            (acc, item) => {
              if (item.vote === "yes") acc.yes++;
              else if (item.vote === "no") acc.no++;
              else acc.other++;
              acc.total++;
              return acc;
            },
            { yes: 0, no: 0, other: 0, total: 0 }
          );
          setCountData(counts);
        }
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
    fetchData();
  }, [id, token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <br />
      <BackButton />
      <center>
        <h3>{poll}</h3>
      </center>
      <br />
      <Stack direction="row" spacing={2} sx={{mb: '10px'}}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Yes
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {countData.yes}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              No
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {countData.no}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Other
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {countData.other}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Total
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {countData.total}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {loading ? (
        skeletonArray
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ display: "table-header-group" }}>
                <TableRow>
                  <TableCell>Voted On</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Vote</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? data.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data
                ).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email_id}</TableCell>
                    <TableCell>{item.district}</TableCell>
                    {/* <Button>
                      {" "}
                      <TableCell>{item.vote}</TableCell>
                    </Button> */}
                    <TableCell>
                      <Button>{item.vote}</Button>
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
        </>
      )}
    </DashboardLayout>
  );
}
