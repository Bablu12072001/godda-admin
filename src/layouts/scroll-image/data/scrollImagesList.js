import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { accessToken } from "services/variables";

const ScrollImagesList = () => {
  const [images, setImages] = useState([]);
  const [deletingImageUrl, setDeletingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Fetch images from API
    axios
      .get("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_scroller_image_all_data")
      .then((response) => {
        const imageUrls = response.data["body-json"].body;
        setImages(imageUrls);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  }, [snackbarOpen]);

  const handleDeleteImage = (imageUrl) => {
    setDeletingImageUrl(imageUrl);

    // Use SweetAlert2 for delete confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this image!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call handleConfirmDelete only if the user confirms deletion
        handleConfirmDelete(imageUrl);
      } else {
        // Reset state if the user cancels deletion
        setDeletingImageUrl("");
      }
    });
  };

  const handleConfirmDelete = async (imageUrlToDelete) => {
    try {
      // Check if imageUrlToDelete is not empty before sending the request
      if (!imageUrlToDelete) {
        throw new Error("Image URL is empty");
      }

      // Show loading indicator
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      // Delete image using API
      const response = await axios.delete("https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/jmoa_scroller_image_delete", {
        data: { url: [imageUrlToDelete] },
        headers: {
          Authorization: accessToken(),
        },
      });

      // If deletion is successful, update the state and show success message
      if (response.status === 200) {
        setImages((prevImages) => prevImages.filter((img) => img !== imageUrlToDelete));
        setSnackbarOpen(true);
      }

      // Close the SweetAlert loading indicator
      Swal.close();
      setDeletingImageUrl("");
    } catch (error) {
      console.error("Error deleting image:", error);

      // Close the SweetAlert loading indicator and show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete image",
      });
    }
  };

  // const handleDeleteImage = (imageUrl) => {
  //   setDeletingImageUrl(imageUrl);

  //   // Use SweetAlert2 for delete confirmation
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Once deleted, you will not be able to recover this image!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       handleConfirmDelete();
  //     } else {
  //       setDeletingImageUrl('');
  //     }
  //   });
  // };

  // const handleConfirmDelete = async () => {
  //   try {
  //     // Check if deletingImageUrl is not empty before sending the request
  //     if (!deletingImageUrl) {
  //       throw new Error('Image URL is empty');
  //     }

  //     // Show loading indicator
  //     Swal.fire({
  //       title: 'Deleting...',
  //       text: 'Please wait',
  //       allowOutsideClick: false,
  //       onBeforeOpen: () => {
  //         Swal.showLoading();
  //       },
  //     });

  //     // Delete image using API
  //     const response = await axios.delete('https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_scroller_image_delete', {
  //       data: { url: [deletingImageUrl] },
  //       headers: {
  //         Authorization: accessToken(),
  //       }
  //     });

  //     // If deletion is successful, update the state and show success message
  //     if (response.status === 200) {
  //       setImages(prevImages => prevImages.filter(img => img !== deletingImageUrl));
  //       setSnackbarOpen(true);
  //     }

  //     // Close the SweetAlert loading indicator
  //     Swal.close();
  //     setDeletingImageUrl('');

  //   } catch (error) {
  //     console.error('Error deleting image:', error);

  //     // Close the SweetAlert loading indicator and show error message
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Failed to delete image',
  //     });
  //   }
  // };

  return (
    <div className="flex flex-wrap justify-around">
      {loading ? (
        <CircularProgress />
      ) : (
        images.map((imageUrl) => (
          <div key={imageUrl} className="w-full md:w-1/4 p-2">
            <img src={imageUrl} alt="Gallery" className="w-full h-auto" />
            <Button onClick={() => handleDeleteImage(imageUrl)} variant="contained" color="info" className="mt-2">
              Delete
            </Button>
          </div>
        ))
      )}

      {/* Snackbar for Success Message */}
      {snackbarOpen &&
        setTimeout(() => {
          setSnackbarOpen(false);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Image deleted successfully!",
          });
        }, 100)}
    </div>
  );
};

export default ScrollImagesList;
