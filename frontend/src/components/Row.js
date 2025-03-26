import React from 'react';
import Webpart from './Webpart';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const Row = ({
  row,
  updateRow,
  setLayout,
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
    height: row.height ? `${row.height}px` : '100px', // Use row height or default
    position: 'relative', // Add position relative for absolute positioning of the select button
  };

  const handleRowClick = (e) => {
    // If a webpart is clicked, don't highlight the row
    if (e.target.closest('.webpart')) return;
    highlightRow(); // Highlight the row
  };

  const updateWebpart = (updatedWebpart) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      rows: prevLayout.rows.map((r) => ({
        ...r,
        webparts: r.webparts.map((webpart) =>
          webpart.id === updatedWebpart.id ? updatedWebpart : webpart
        ),
      })),
    }));
  };

  return (
    <Box sx={rowStyle} onClick={handleRowClick}>
      {/* Select Row Button */}
      <IconButton 
        size="small"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click event
          highlightRow();
        }}
        sx={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          zIndex: 10,
          padding: '4px',
          backgroundColor: isHighlighted ? 'rgba(0, 127, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: isHighlighted ? 'rgba(0, 127, 255, 0.2)' : 'rgba(200, 200, 200, 0.7)',
          },
        }}
      >
        <TouchAppIcon fontSize="small" color={isHighlighted ? "primary" : "action"} />
      </IconButton>
      {/* Webparts */}
      {row.webparts.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Webparts Container */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: row.flexWebpartWidth !== false
                ? row.distributionPercentages && row.distributionPercentages.length > 0
                  ? row.distributionPercentages.map(p => `${p}%`).join(' ')
                  : `repeat(${row.webparts.length}, 1fr)`
                : 'repeat(12, 1fr)',
              gap: 2,
              height: '100%',
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
                updateWebpart={updateWebpart}
                selectWebpart={selectWebpart}
                isSelected={webpart.id === selectedWebpartId}
              />
            </Box>
          ))}
          </Box>
        </Box>
      ) : (
        // Button to add webpart to empty row
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
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
