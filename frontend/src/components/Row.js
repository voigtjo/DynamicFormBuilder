import React from 'react';
import Webpart from './Webpart';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Row = ({
  row,
  updateRow,
  addWebpartToRow,
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

  const handleRowClick = (e) => {
    // If a webpart is clicked, don't highlight the row
    if (e.target.closest('.webpart')) return;
    highlightRow(); // Highlight the row
  };

  return (
    <Box sx={rowStyle} onClick={handleRowClick}>
      {/* Webparts */}
      {row.webparts.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: row.flexWebpartWidth !== false
              ? `repeat(${row.webparts.length}, 1fr)`
              : 'repeat(12, 1fr)',
            gap: 2,
          }}
        >
          {row.webparts.map((webpart) => (
            <Box
              key={webpart.id}
              sx={{
                gridColumn: row.flexWebpartWidth !== false
                  ? undefined
                  : `span ${webpart.width || 1}`,
              }}
              className="webpart" // Add class for webpart identification
            >
              <Webpart
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
            </Box>
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
            onClick={() => addWebpartToRow(row.rowId)}
          >
            Add Webpart
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Row;
