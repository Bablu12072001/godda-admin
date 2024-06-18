import axios from "axios";
import React from "react";
import { useState,useEffect } from "react";
import { Button, Skeleton, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
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
import swal from "sweetalert";
import Auth from "Auth";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function PollList() {
    // console.log("under circular");
    const navigate = useNavigate();
    const { token } = Auth();
    // console.log(token);

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
const [reload,setReload]=useState(false);

    // const [showAll, setShowAll] = useState(false);

    // useEffect(() => {
    //   fetchNotices();
    // }, []);
    const [loading, setLoading] = useState(false);

    const [text, setText] = useState("");
    const [data, setData] = useState([]);
    const skeletonArray = Array.from({ length: 8 }, (_, index) => (
        <>
            <Skeleton key={index} variant="wave" width={"100%"} height={40} />
            <br />
        </>
    ));
  
  

    useEffect(() => {
    const fetchAllPoll = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/jmoa_created_vote_all_data`, {
          
                headers: {
                    Authorization: token
                }
            });
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
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
          fetchAllPoll();
        }, [reload]);


  
    const handleDelete = async (id) => {
        // alert(text);
        const result = await Swal.fire({
            title: "Are you sure?",
            text: " You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        });
        if (result.isConfirmed) {
         
            try {
                setLoading(true);
                const res = await axios.delete(`${apiUrl}/jmoa_created_vote_delete`, {
                    data: { id: id },
                    headers: {
                        Authorization: token
                    }
                });
                if (
                    res.data["body-json"]["statusCode"] !== 200 ||
                    res.data["body-json"]["statusCode"] === undefined
                ) {
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
               
                   setReload(!reload);
                
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

    }
    const handleViewVoters=async(id,poll)=>{
        navigate(`/voting/view/${id}/${poll}`);
    }



    return (
        <>
        <DashboardLayout>
            <DashboardNavbar/><br/>
                <div className="">
                <Stack direction="row" spacing={5}>

                 
                    <Button variant="contained" color="warning"  onClick={() => { navigate("/voting/add-poll") }}>Create New</Button>
                </Stack>
                <br />
                <div>
                    <div
                    // className=" mt-8 p-4 bg-teal-400 rounded-lg shadow-lg"
                    // style={{ maxHeight: "auto", overflowY: "auto" }}
                    >
                        <h2 className="text-xl font-bold mb-4" style={{ color: "blue" }}>
                            {"All Polls"}
                        </h2>
                        {loading ? (
                            // <Skeleton variant="wave" width={400} height={300} />
                            skeletonArray
                        ) :

                            <>
                         
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead style={{ display: "table-header-group" }}>
                                                <TableRow>
                                                    <TableCell>Date & Time</TableCell>
                                                   
                                                    <TableCell>Description</TableCell>
                                                  
                                                 <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(rowsPerPage > 0
                                                    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : data
                                                ).map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.date} {item.time}</TableCell>
                                                        <TableCell>{item.description}</TableCell>
                                                       
                         <TableCell><Button color="warning" variant="contained" onClick={() => { handleDelete(item.id) }}>Delete</Button></TableCell>
                         <TableCell><Button color="warning" variant="contained" onClick={() => { handleViewVoters(item.id,item.description) }}>View Voters</Button></TableCell>
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
                        }

                    </div>
                </div>


            </div>
            </DashboardLayout>     
        </>
    );
}
