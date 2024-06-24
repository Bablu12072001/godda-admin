// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Box,
// } from "@mui/material";
// import axios from "axios";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { accessToken } from "services/variables";

// const VideoUploadForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     youtube_url: "",
//     type: "Select",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(
//         "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_videos",
//         formData,
//         {
//           headers: {
//             Authorization: accessToken(),
//           },
//         }
//       );

//       console.log("Response:", response.data);

//       setFormData({
//         title: "",
//         youtube_url: "",
//         type: "Select",
//       });
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <Container maxWidth="sm">
//         <Box
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           height="100%"
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Video Upload Form
//           </Typography>
//           <form>
//             <TextField
//               label="Title"
//               fullWidth
//               margin="normal"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//             />
//             <TextField
//               label="YouTube URL"
//               fullWidth
//               margin="normal"
//               name="youtube_url"
//               value={formData.youtube_url}
//               onChange={handleChange}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Type</InputLabel>
//               <Select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 label="Type"
//                 style={{ height: "3rem" }}
//               >
//                 <MenuItem value="gallery">Gallery</MenuItem>
//                 <MenuItem value="Press">Press</MenuItem>
//                 <MenuItem value="training">Training</MenuItem>
//               </Select>
//             </FormControl>
//             <Button variant="contained" color="primary" onClick={handleSubmit}>
//               Submit
//             </Button>
//           </form>
//         </Box>
//       </Container>
//     </DashboardLayout>
//   );
// };

// export default VideoUploadForm;
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { accessToken } from "services/variables";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    youtube_url: "",
    type: "Select",
  });
  const [uploading, setUploading] = useState(false); // State for upload operation loading

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true); // Set uploading state to true before upload
      const response = await axios.post("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_leadership_filter_all_data", formData, {
        headers: {
          Authorization: accessToken(),
        },
      });

      console.log("Response ledership:", response.data);

      setFormData({
        title: "",
        youtube_url: "",
        type: "Select",
      });
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error uploading video. Please try again.");
    } finally {
      setUploading(false); // Set uploading state to false after upload (success or failure)
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <Typography>Comming Soon.....</Typography>
        </Box>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </DashboardLayout>
  );
};

export default AddForm;
