import React from 'react';
import Webpart from './Webpart';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Row = ({
  row,
  updateRow,
  addWebpartToRow, // Function to add webpart to empty row
  selectWebpart,
  selectedWebpartId,
  isHighlighted,
  highlightRow,
}) => {
  const rowStyle = {
    border: isHighlighted ? '2px solid #007FFF' : '2px dotted lightgray',
    backgroundColor: isHighlighted ? '#E3F2FD' : '#fefefe',
    borderRadius: '8px',
    padding: 0.5,
    marginBottom: 0, 
    transition: 'background-color 0.3s, border-color 0.3s',
  };

  return (
    <Box
      sx={rowStyle}
      onClick={(e) => {
        // Avoid highlighting if a webpart is clicked
        if (e.target.closest('.webpart')) return;
        highlightRow(); // Highlight the row
      }}
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
    </Box>
  );
};

export default Row;
