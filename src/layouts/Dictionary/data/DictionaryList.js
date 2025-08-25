import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { accessToken } from "services/variables";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

const WordDictionaryList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dictionaryData, setDictionaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [editRowId, setEditRowId] = useState(null);
  const [editWord, setEditWord] = useState({ word: "", meaning: "" });
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/get_all_words_from_dictionary?sortKey=word`, {
          headers: {
            Authorization: accessToken(),
          },
        });
        setDictionaryData(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dictionary data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchKeyChange = (event) => {
    setSearchKey(event.target.value);
  };

  const handleOpenEditPopup = (word) => {
    setEditRowId(word.id);
    setEditWord({ word: word.word, meaning: word.meaning });
    setOpen(true);
  };

  const handleCloseEditPopup = () => {
    setEditRowId(null);
    setEditWord({ word: "", meaning: "" });
    setOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      const { word, meaning } = editWord;

      await axios.put(
        `https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/godda_edit_dictionary_word`,
        {
          id: editRowId,
          word,
          meaning,
        },
        {
          headers: {
            Authorization: accessToken(),
          },
        }
      );

      setDictionaryData((prevData) => prevData.map((item) => (item.id === editRowId ? { ...item, word, meaning } : item)));
      Swal.fire("Success", "Word updated successfully.", "success");
      handleCloseEditPopup();
    } catch (error) {
      console.error("Error updating word:", error);
      Swal.fire("Error", "An error occurred while updating the word.", "error");
    }
  };

  const handleDelete = async (wordId) => {
    try {
      if (!wordId) {
        Swal.fire("Error", "The record ID is missing. Please try again.", "error");
        return;
      }

      const response = await axios.delete(`https://vkfpe87plb.execute-api.ap-south-1.amazonaws.com/production/delete_word_from_dictionary?id=${wordId}`, {
        headers: {
          Authorization: accessToken(),
        },
      });

      if (response.status === 200) {
        setDictionaryData((prevData) => prevData.filter((word) => word.id !== wordId));
        Swal.fire("Deleted!", "The word has been deleted.", "success");
      } else {
        Swal.fire("Error", response.data.message || "Failed to delete the word.", "error");
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      Swal.fire("Error", "An error occurred while deleting the word.", "error");
    }
  };

  const handleMenuOpen = (event, word) => {
    setAnchorEl(event.currentTarget);
    setEditRowId(word.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredData = dictionaryData.filter((word) => word.word.toLowerCase().includes(searchKey.toLowerCase()));

  return (
    <div>
      <MDBox mb={2}>
        <TextField label="Search by Word" variant="outlined" fullWidth value={searchKey} onChange={handleSearchKeyChange} placeholder="Search for a word" />
      </MDBox>
      <TableContainer component={Paper}>
        <Table>
          <Box component="thead">
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: 20 }}>S.N</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 20 }}>Word</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 20 }}>Meaning(Hindi/English/Urdu)</TableCell>

              <TableCell sx={{ fontWeight: "bold", fontSize: 20 }}>Actions</TableCell>
            </TableRow>
          </Box>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((word, index) => (
                <TableRow key={word.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{word.word}</TableCell>
                  <TableCell>{word.meaning}</TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, word)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && editRowId === word.id} onClose={handleMenuClose}>
                      <MenuItem
                        onClick={() => {
                          handleOpenEditPopup(word);
                          handleMenuClose();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDelete(word.id);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Popup Dialog */}
      <Dialog open={open} onClose={handleCloseEditPopup}>
        <DialogTitle>Edit Word</DialogTitle>
        <DialogContent>
          <TextField
            label="Word"
            variant="outlined"
            fullWidth
            value={editWord.word}
            onChange={(e) => setEditWord((prev) => ({ ...prev, word: e.target.value }))}
            margin="dense"
          />
          <TextField
            label="Meaning"
            variant="outlined"
            fullWidth
            value={editWord.meaning}
            onChange={(e) => setEditWord((prev) => ({ ...prev, meaning: e.target.value }))}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditPopup} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordDictionaryList;
