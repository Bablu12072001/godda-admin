import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import swal from "sweetalert";

export default function MemberUploadDialog({ open, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      swal("Error", "Please select a file to upload.", "error");
      return;
    }

    try {
      // 1. Get signed URL from backend
      const response = await axios.post("https://kxu5bktpoi.execute-api.ap-south-1.amazonaws.com/JMOA/jmoa_member_add", {
        fileName: [selectedFile.name],
      });

      // ✅ Extract deeply nested signed URL
      const uploadDetails = response?.data?.["body-json"]?.body?.uploadDetails?.[0];

      const signedUrl = uploadDetails?.signedUrl;
      const fileKey = uploadDetails?.key;

      if (!signedUrl || !fileKey) {
        swal("Error", "Failed to retrieve upload URL from the server.", "error");
        return;
      }

      // 2. Upload file to S3 using signed URL
      await axios.put(signedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      });

      // 3. Show success popup with file URL
      swal("Success", `File uploaded successfully!\n${fileKey}`, "success");
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      swal("Error", "Upload failed. Please try again.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Member Form</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Choose a file to upload (PDF/image):</Typography>
        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} style={{ marginTop: 12 }}>
          Select File
          <input
            type="file"
            hidden
            accept="application/pdf,image/*"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
        </Button>

        {selectedFile && (
          <Typography variant="body2" style={{ marginTop: 10 }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MemberUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
