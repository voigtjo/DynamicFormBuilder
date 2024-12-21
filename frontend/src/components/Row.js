import React from 'react';
import Webpart from './Webpart';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

const Row = ({
  row,
  updateRow,
  deleteRow,
  addRowBelow,
  moveRow,
  addWebpartToRow, // Function to add webpart to empty row
  selectWebpart,
  selectedWebpartId,
  isHighlighted,
  highlightRow,
  unhighlightRow,
}) => {
  const rowStyle = {
    border: isHighlighted ? '2px solid #007FFF' : '2px dotted lightgray',
    backgroundColor: isHighlighted ? '#E3F2FD' : '#fefefe',
    borderRadius: '8px',
    padding: 2,
    marginBottom: 2,
    transition: 'background-color 0.3s, border-color 0.3s',
  };

  return (
    <Box
      sx={rowStyle}
      onMouseEnter={highlightRow} // Highlight row on hover
      onMouseLeave={unhighlightRow} // Remove highlight on mouse leave
    >
      {/* Webparts */}
      {row.webparts.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${row.webparts.length}, 1fr)`,
            gap: 2,
          }}
        >
          {row.webparts.map((webpart) => (
            <Webpart
              key={webpart.id}
              webpart={webpart}
              updateWebpart={(updatedWebpart) => {
                const updatedWebparts = row.webparts.map((wp) =>
                  wp.id === updatedWebpart.id ? updatedWebpart : wp
                );
                updateRow({ ...row, webparts: updatedWebparts });
              }}
              selectWebpart={selectWebpart}
              isSelected={webpart.id === selectedWebpartId}
            />
          ))}
        </Box>
      ) : (
        // Button to add webpart to empty row
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addWebpartToRow(row.rowId)} // Call function to add webpart
          >
            Add Webpart
          </Button>
        </Box>
      )}

      {/* Row Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 2,
          gap: 2,
        }}
      >
        <IconButton onClick={() => moveRow(row.rowId, 'up')} color="primary">
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={() => moveRow(row.rowId, 'down')} color="primary">
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton onClick={() => addRowBelow(row.rowId)} color="success">
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => deleteRow(row.rowId)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Row;
