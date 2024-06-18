import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Skeleton, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TableCell, TableBody, TableRow, TableContainer, Paper, Table, TableHead, TablePagination } from "@mui/material";
import { apiUrl } from "Constants";
import swal from "sweetalert";
import Auth from "Auth";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Circular() {
  // console.log("under circular");
  const navigate = useNavigate();
  // const { token } = Auth();
  // console.log(token);
  const { token } = Auth();
  let config = {
    headers: {
      Authorization: token,
    },
  };

  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangePage1 = (event, newPage) => {
  //   setPage1(newPage);
  // };

  // const handleChangeRowsPerPage1 = (event) => {
  //   setRowsPerPage1(parseInt(event.target.value, 10));
  //   setPage1(0);
  // };
  // const handleChangePage2 = (event, newPage) => {
  //   setPage2(newPage);
  // };

  // const handleChangeRowsPerPage2 = (event) => {
  //   setRowsPerPage2(parseInt(event.target.value, 10));
  //   setPage2(0);
  // };
  // Assuming you have state variables `page` and `rowsPerPage`
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleViewPDF = async (pdfLink) => {
    window.open(pdfLink, "_blank");
  };

  // const [showAll, setShowAll] = useState(false);

  // useEffect(() => {
  //   fetchNotices();
  // }, []);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const skeletonArray = Array.from({ length: 5 }, (_, index) => (
    <>
      <Skeleton key={index} variant="wave" width={"100%"} height={40} />
      <br />
    </>
  ));
  // useEffect(() => {
  const fetchResolution = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/jmoa_resolution_all_data`, config);
      if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
      }
      if (res.data["body-json"]["body"] === undefined || res.data["body-json"]["body"].length === 0) {
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
  //   fetchData();
  // }, []);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/jmoa_notice_all_data`, config);
      if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
      }
      if (res.data["body-json"]["body"] === undefined || res.data["body-json"]["body"].length === 0) {
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
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCircular = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/jmoa_circular_all_data`, config);
      if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
        swal({
          title: "Error!",
          text: "Error fetching data!!",
          icon: "error",
          button: "Ok!",
        });
      }
      if (res.data["body-json"]["body"] === undefined || res.data["body-json"]["body"].length === 0) {
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
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id, text) => {
    // alert(text);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: " You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });
    if (result.isConfirmed) {
      let url = "";
      if (text === "Resolution") {
        url = "jmoa_resolution_delete";
      } else if (text === "Notice") {
        url = "jmoa_notice_delete";
      } else if (text === "Circular") {
        url = "jmoa_circular_delete";
      }
      try {
        setLoading(true);
        const res = await axios.delete(`${apiUrl}/${url}`, {
          data: { id: id },
          headers: {
            Authorization: token,
          },
        });
        if (res.data["body-json"]["statusCode"] !== 200 || res.data["body-json"]["statusCode"] === undefined) {
          swal({
            title: "Error!",
            text: "Error deleting data!!",
            icon: "error",
            button: "Ok!",
          });
        } else {
          swal({
            title: "Success!",
            text: "Data deleted!!",
            icon: "success",
            button: "Ok!",
          });
        }
        // if (
        //   res.data["body-json"]["body"] === undefined ||
        //   res.data["body-json"]["body"].length === 0
        // ) {
        //   setData([]);
        // } else {
        if (text === "Resolution") {
          fetchResolution();
        } else if (text === "Notice") {
          fetchNotice();
        } else if (text === "Circular") {
          fetchCircular();
        }
        // }
      } catch (error) {
        swal({
          title: "Error!",
          text: "Error deleting data!! " + error,
          icon: "error",
          button: "Ok!",
        });
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div className="">
        <Stack direction="row" spacing={5}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchResolution(), setText("Resolution");
            }}
          >
            Resolution
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchNotice(), setText("Notice");
            }}
          >
            Notice
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              fetchCircular(), setText("Circular");
            }}
          >
            Circular
          </Button>
          <Button
            variant="contained"
            color="warning"
            style={{ marginLeft: "auto", marginRight: "5vw" }}
            onClick={() => {
              navigate("/add");
            }}
          >
            Add
          </Button>
        </Stack>
        <br />
        <div>
          <div
          // className=" mt-8 p-4 bg-teal-400 rounded-lg shadow-lg"
          // style={{ maxHeight: "auto", overflowY: "auto" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "blue" }}>
              {text}
            </h2>
            {loading ? (
              // <Skeleton variant="wave" width={400} height={300} />
              skeletonArray
            ) : (
              <>
                {text !== "" ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead style={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Date </TableCell>
                          <TableCell>Issue No.</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>PDF</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.issueNo}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>
                              <VisibilityIcon
                                style={{
                                  color: "green",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleViewPDF(item.link)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                color="warning"
                                variant="contained"
                                onClick={() => {
                                  handleDelete(item.id, text);
                                }}
                              >
                                Delete
                              </Button>
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
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
