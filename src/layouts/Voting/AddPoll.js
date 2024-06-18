import { Button, CircularProgress, TextField } from '@mui/material'
import React, { useState } from 'react'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import swal from 'sweetalert';
import Auth from 'Auth';
import axios from 'axios';
import { apiUrl } from 'Constants';
export default function () {
    const [description,setDescription]=useState("");
    const {token,decoded}=Auth();
    const [loading,setLoading]=useState(false);
    const handleSubmit=async()=>{
        if(description===""){
            swal({
                title: "Warning!",
                text: "Field should not be empty!!",
                icon: "warning",
                button: "Ok!",
            });
        }
        else{
            try {
                setLoading(true);
                let body={
                    description:description,
                    createdBy:decoded.email,
                    creatorRole: decoded.role,

                }
                const res = await axios.post(`${apiUrl}/jmoa_voting_create`,body, {
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
                        text: "Error uploading data!!" + res.data['body-json']['body'],
                        icon: "error",
                        button: "Ok!",
                    });
                } else {
                    swal({
                        title: "Success!",
                        text: "Data Added!!",
                        icon: "success",
                        button: "Ok!",
                    });
                    setDescription("");
                }
      
            } catch (error) {
                swal({
                    title: "Error!",
                    text: "Error uploading data!! " + error,
                    icon: "error",
                    button: "Ok!",
                });
                console.error("Error:", error);
            } finally {

                setLoading(false);
            }
        }
    }
    if(loading){
        return <div style={{display:"flex",alignItems:"center",justifyContent:'center',marginTop:"40vh"}}><CircularProgress/></div>
    }
  return (
    <DashboardLayout>
<DashboardNavbar/>
<br/><br/>
          <TextField label="Description" variant="outlined" name="description" value={description} onChange={(e)=>{setDescription(e.target.value)}} fullWidth sx={{backgroundColor:"#fff"}}/>
  <br/><br/>
   <center>
              <Button variant='contained' color='warning' onClick={handleSubmit}>Submit</Button>
      </center>
      </DashboardLayout>
  )
}
