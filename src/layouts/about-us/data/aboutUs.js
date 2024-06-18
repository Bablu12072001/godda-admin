// import React from "react"

// export default function PresidentData() {
//   return (
//     <div>
//         presidentData
//     </div>
//   )
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Swal from "sweetalert2";
// import { accessToken } from "services/variables";

// const PresidentData = () => {
//   const [presidentData, setPresidentData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch President Data on component mount
//     axios
//       .get(
//         "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_president_message_all_data",
//         {
//           headers: {
//             Authorization: accessToken(),
//           },
//         }
//       )
//       .then((response) => {
//         setPresidentData(response.data["body-json"].body);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching president data:", error);
//         setLoading(false);
//       });
//   }, []);

//   const handleUpdate = () => {
//     // Display SweetAlert2 for confirmation
//     Swal.fire({
//       title: "Update Confirmation",
//       text: "Are you sure you want to update the president data?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, update it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // If confirmed, make the PUT request to update president data
//         const updateData = {
//           name: "By President Name",
//           message: "Updated message...",
//           base64: "Updated base64...",
//         };

//         axios
//           .put(
//             "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_president_message",
//             updateData,
//             {
//               headers: {
//                 Authorization: accessToken(),
//               },
//             }
//           )
//           .then((response) => {
//             // Show success message using SweetAlert2
//             Swal.fire({
//               title: "Update Successful",
//               text: "President data has been updated successfully!",
//               icon: "success",
//             });
//           })
//           .catch((error) => {
//             console.error("Error updating president data:", error);
//             // Show error message using SweetAlert2
//             Swal.fire({
//               title: "Update Failed",
//               text: "Failed to update president data. Please try again.",
//               icon: "error",
//             });
//           });
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       {loading ? (
//         // Display CircularProgress while loading
//         <div className="flex justify-center">
//           <CircularProgress />
//         </div>
//       ) : (
//         // Display president data when not loading
//         <div>
//           <img src={presidentData.imageUrl} alt="President" className="rounded-full w-20 h-20" />
//           <h1 className="text-2xl font-bold mt-4">{presidentData.name}</h1>
//           <p className="mt-2">{presidentData.message}</p>
//           <p className="mt-2">
//             Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
//           </p>

//           {/* Button to trigger update */}
//           <button
//             className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
//             onClick={handleUpdate}
//           >
//             Update President Data
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PresidentData;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import TextField from "@mui/material/TextField";
// import Swal from "sweetalert2";
// import { accessToken } from "services/variables";

// const PresidentData = () => {
//   const [presidentData, setPresidentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [editedName, setEditedName] = useState("");
//   const [editedMessage, setEditedMessage] = useState("");
//   const [editedImage, setEditedImage] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     // Fetch President Data on component mount
//     axios
//       .get(
//         "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_president_message_all_data"
//       )
//       .then((response) => {
//         setPresidentData(response.data["body-json"].body);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching president data:", error);
//         setLoading(false);
//       });
//   }, []);

//   const handleUpdate = () => {
//     // Display SweetAlert2 for confirmation
//     Swal.fire({
//       title: "Update Confirmation",
//       text: "Are you sure you want to update the president data?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, update it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // If confirmed, set updating state to true
//         setUpdating(true);

//         // If confirmed, make the PUT request to update president data
//         const updateData = {
//           name: editedName || presidentData.name,
//           message: editedMessage || presidentData.message,
//           imageUrl: editedImage || presidentData.imageUrl,
//           base64: "Updated base64...",
//         };

//         axios
//           .put(
//             "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_president_message",
//             updateData, {
//                 headers: {
//                     Authorization: accessToken(),
//                   },
//             }
//           )
//           .then((response) => {
//             // Show success message using SweetAlert2
//             Swal.fire({
//               title: "Update Successful",
//               text: "President data has been updated successfully!",
//               icon: "success",
//             });
//             setEditMode(false);
//             setOpenDialog(false);
//           })
//           .catch((error) => {
//             console.error("Error updating president data:", error);
//             // Show error message using SweetAlert2
//             Swal.fire({
//               title: "Update Failed",
//               text: "Failed to update president data. Please try again.",
//               icon: "error",
//             });
//           })
//           .finally(() => {
//             // Set updating state to false after the update process
//             setUpdating(false);
//           });
//       }
//     });
//   };

//   //   const handleDialogOpen = () => {
//   //     setOpenDialog(true);
//   //   };

//   const handleDialogOpen = () => {
//     // Set the edited name and message when opening the dialog in edit mode
//     setEditedName(presidentData.name);
//     setEditedMessage(presidentData.message);
//     setEditedImage(presidentData.imageUrl);

//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEditedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       {loading ? (
//         // Display CircularProgress while loading
//         <div className="flex justify-center">
//           <CircularProgress />
//         </div>
//       ) : (
//         // Display president data when not loading
//         <div>
//           <img src={presidentData.imageUrl} alt="President" className="rounded-full w-20 h-20" />
//           <h1 className="text-2xl font-bold mt-4">{presidentData.name}</h1>
//           <p className="mt-2">{presidentData.message}</p>
//           <p className="mt-2">
//             Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
//           </p>

//           {/* Button to toggle edit mode */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => {
//               setEditMode(true);
//               handleDialogOpen();
//             }}
//           >
//             Edit President Data
//           </Button>

//           {/* Material-UI Dialog for editing */}
//           <Dialog open={openDialog} onClose={handleDialogClose}>
//             <DialogTitle>Edit President Data</DialogTitle>
//             <DialogContent>
//               {/* Image Preview */}
//               {editedImage ? (
//                 <img src={editedImage} alt="Preview" className="rounded-full w-20 h-20" />
//               ) : (
//                 <img
//                   src={presidentData.imageUrl}
//                   alt="Previous"
//                   className="rounded-full w-20 h-20"
//                 />
//               )}

//               {/* Input fields */}
//               <TextField
//                 label="Name"
//                 variant="outlined"
//                 fullWidth
//                 value={editedName}
//                 onChange={(e) => setEditedName(e.target.value)}
//               />
//               <TextField
//                 label="Message"
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={editedMessage}
//                 onChange={(e) => setEditedMessage(e.target.value)}
//               />
//               {/* Input field for selecting a new image */}
//               <input type="file" accept="image/*" onChange={handleImageChange} />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleDialogClose} color="secondary">
//                 Cancel
//               </Button>
//               {/* Display CircularProgress while updating */}
//               <Button onClick={handleUpdate} color="primary" disabled={updating}>
//                 {updating ? <CircularProgress size={20} /> : "Update"}
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PresidentData;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import TextField from "@mui/material/TextField";
// import Swal from "sweetalert2";
// import { accessToken } from "services/variables";

// const AboutUsData = () => {
//   const [presidentData, setPresidentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [editedMessage, setEditedMessage] = useState("");
//   const [editedImage, setEditedImage] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [imageTimestamp, setImageTimestamp] = useState(Date.now()); // New state to track image updates

//   useEffect(() => {
//     // Fetch President Data on component mount
//     fetchPresidentData();
//   }, []);

//   const fetchPresidentData = () => {
//     axios
//       .get(
//         "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_about_us_all_data"
//       )
//       .then((response) => {
//         setPresidentData(response.data["body-json"].body);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching about us data:", error);
//         setLoading(false);
//       });
//   };

//   const handleUpdate = () => {
//     setOpenDialog(false);
//     // Display SweetAlert2 for confirmation with circular loading
//     Swal.fire({
//       title: "Update Confirmation",
//       html: updating
//         ? '<div style="z-index: 9999;"><CircularProgress size={20} /></div>'
//         : "Are you sure you want to update the about us data?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, update it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // If confirmed, set updating state to true
//         setUpdating(true);

//         // If confirmed, make the PUT request to update president data
//         const updateData = {
//           message: editedMessage || presidentData.message,
//           // base64: editedImage || presidentData.base64,
//             base64: editedImage ? editedImage.split(",")[1] : presidentData.base64,
//         };

//         axios
//           .put(
//             "https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_about_us",
//             updateData,
//             {
//               headers: {
//                 Authorization: accessToken(),
//               },
//             }
//           )
//           .then((response) => {
//             // Show success message using SweetAlert2
//             Swal.fire({
//               title: "Update Successful",
//               text: "About Us data has been updated successfully!",
//               icon: "success",
//             });
//             setEditMode(false);
//             setOpenDialog(false);
//             // Refresh data after successful update
//             fetchPresidentData();
//           })
//           .catch((error) => {
//             console.error("Error updating about us data:", error);
//             // Show error message using SweetAlert2
//             Swal.fire({
//               title: "Update Failed",
//               text: "Failed to update about us data. Please try again.",
//               icon: "error",
//             });
//           })
//           .finally(() => {
//             // Set updating state to false after the update process
//             setUpdating(false);
//           });
//       }
//     });
//   };

//   const handleDialogOpen = () => {
//     // Set the edited name and message when opening the dialog in edit mode
//     // setEditedName(presidentData.name);
//     setEditedMessage(presidentData.message);
//     setEditedImage(presidentData.imageUrl);

//     // Open the Material-UI Dialog
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     // Close the Material-UI Dialog
//     setOpenDialog(false);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEditedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="container mx-auto mt-8" style={{margin: "20px"}}>
//       {loading ? (
//         // Display CircularProgress while loading
//         <div className="flex justify-center">
//           <CircularProgress />
//         </div>
//       ) : (
//         // Display president data when not loading
//         <div>
//           {/* <img src={presidentData.imageUrl} alt="President" className="rounded-full w-20 h-20" /> */}
//           <img src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`} alt="President" className="rounded-full w-20 h-20" />
//           {/* <h1 className="text-2xl font-bold mt-4">{presidentData.name}</h1> */}
//           <p className="mt-2, mr-8">{presidentData.message}</p>
//           <p className="mt-2, mb-2">
//             Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
//           </p>

//           {/* Button to toggle edit mode */}
//           <Button
//             variant="contained"
//             color="info"
//             // color="primary"
//             onClick={() => {
//               setEditMode(true);
//               handleDialogOpen();
//             }}
//           >
//             Edit About Us Data
//           </Button>

//           {/* Material-UI Dialog for editing */}
//           <Dialog open={openDialog} onClose={handleDialogClose}>
//             <DialogTitle>Edit About US Data</DialogTitle>
//             <DialogContent>
//               {/* Image Preview */}
//               {editedImage ? (
//                 <img src={editedImage} alt="Preview" className="rounded-full w-20 h-20" />
//               ) : (
//                 <img
//                   src={presidentData.imageUrl}
//                   alt="Previous"
//                   className="rounded-full w-20 h-20"
//                 />
//               )}
//               <TextField
//                 label="Message"
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={editedMessage}
//                 onChange={(e) => setEditedMessage(e.target.value)}
//                 sx={{margin: "5px", marginTop: "10px"}}
//               />
//               {/* Input field for selecting a new image */}
//               <input type="file" accept="image/*" onChange={handleImageChange} style={{margin: "5px"}} />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleDialogClose} color="secondary">
//                 Cancel
//               </Button>
//               {/* Display CircularProgress while updating */}
//               <Button onClick={handleUpdate} color="primary" disabled={updating}>
//                 {updating ? <CircularProgress size={20} /> : "Update"}
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AboutUsData;

import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

const AboutUsData = () => {
  const [presidentData, setPresidentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now()); // New state to track image updates

  useEffect(() => {
    // Fetch President Data on component mount
    fetchPresidentData();
  }, []);

  const fetchPresidentData = () => {
    axios
      .get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_about_us_all_data")
      .then((response) => {
        setPresidentData(response.data["body-json"].body);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching about us data:", error);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setOpenDialog(false);
    // Display SweetAlert2 for confirmation with circular loading
    Swal.fire({
      title: "Update Confirmation",
      html: updating ? '<div style="z-index: 9999;"><CircularProgress size={20} /></div>' : "Are you sure you want to update the about us data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, set updating state to true
        setUpdating(true);

        // If confirmed, make the PUT request to update president data
        const updateData = {
          message: editedMessage || presidentData.message,
          base64: editedImage ? editedImage.split(",")[1] : presidentData.base64,
        };

        axios
          .put("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_about_us", updateData, {
            headers: {
              Authorization: accessToken(),
            },
          })
          .then((response) => {
            // Show success message using SweetAlert2
            Swal.fire({
              title: "Update Successful",
              text: "About Us data has been updated successfully!",
              icon: "success",
            });
            setEditMode(false);
            setOpenDialog(false);
            // Refresh data after successful update
            fetchPresidentData();
            // Generate new timestamp to force image update
            setImageTimestamp(Date.now());
          })
          .catch((error) => {
            console.error("Error updating about us data:", error);
            // Show error message using SweetAlert2
            Swal.fire({
              title: "Update Failed",
              text: "Failed to update about us data. Please try again.",
              icon: "error",
            });
          })
          .finally(() => {
            // Set updating state to false after the update process
            setUpdating(false);
          });
      }
    });
  };

  const handleDialogOpen = () => {
    // Set the edited name and message when opening the dialog in edit mode
    setEditedMessage(presidentData.message);
    setEditedImage(presidentData.imageUrl);

    // Open the Material-UI Dialog
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    // Close the Material-UI Dialog
    setOpenDialog(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto mt-8" style={{ margin: "20px" }}>
      {loading ? (
        // Display CircularProgress while loading
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        // Display president data when not loading
        <div>
          <img
            src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`} // Append timestamp to the URL
            alt="President"
            className="rounded-full w-20 h-20"
          />
          <p className="mt-2, mr-8">{presidentData.message}</p>
          <p className="mt-2, mb-2">
            Last Update: {presidentData.lastUpdate} {presidentData.lastUpdateTime}
          </p>

          {/* Button to toggle edit mode */}
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setEditMode(true);
              handleDialogOpen();
            }}
          >
            Edit About Us Data
          </Button>

          {/* Material-UI Dialog for editing */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Edit About US Data</DialogTitle>
            <DialogContent>
              {/* Image Preview */}
              {editedImage ? (
                <img src={editedImage} alt="Preview" className="rounded-full w-20 h-20" />
              ) : (
                <img
                  src={`${presidentData.imageUrl}?timestamp=${imageTimestamp}`} // Append timestamp to the URL
                  alt="Previous"
                  className="rounded-full w-20 h-20"
                />
              )}
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                sx={{ margin: "5px", marginTop: "10px" }}
              />
              {/* Input field for selecting a new image */}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: "5px" }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              {/* Display CircularProgress while updating */}
              <Button onClick={handleUpdate} color="primary" disabled={updating}>
                {updating ? <CircularProgress size={20} /> : "Update"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AboutUsData;
