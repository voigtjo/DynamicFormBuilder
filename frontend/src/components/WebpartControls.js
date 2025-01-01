import React from 'react';
import { IconButton, Box, Select, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

const WebpartControls = ({
  selectedWebpartId,
  moveWebpart,
  deleteSelectedWebpart,
  addWebpartToRow,
  updateWebpartWidth,
  setSelectedWebpartId,
  highlightedRowId,
  layout,
}) => {
  const selectedWebpart = layout.rows
    .flatMap((row) => row.webparts)
    .find((webpart) => webpart.id === selectedWebpartId);

  const isManualWidthMode = layout.rows.some(
    (row) => row.webparts.some((webpart) => webpart.id === selectedWebpartId) && row.flexWebpartWidth === false
  );

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginBottom: 2 }}>
      {/* Navigation Buttons */}
      <IconButton
        onClick={() => moveWebpart('left')}
        disabled={!selectedWebpartId}
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton
        onClick={() => moveWebpart('right')}
        disabled={!selectedWebpartId}
        color="primary"
      >
        <ArrowForwardIcon />
      </IconButton>
      <IconButton
        onClick={() => moveWebpart('up')}
        disabled={!selectedWebpartId}
        color="primary"
      >
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        onClick={() => moveWebpart('down')}
        disabled={!selectedWebpartId}
        color="primary"
      >
        <ArrowDownwardIcon />
      </IconButton>

      {/* Delete Button */}
      <IconButton
        onClick={deleteSelectedWebpart}
        disabled={!selectedWebpartId}
        color="error"
      >
        <DeleteIcon />
      </IconButton>

      {/* Add Webpart Button */}
      {highlightedRowId && (
        <IconButton
          onClick={() => addWebpartToRow(highlightedRowId)}
          color="success"
        >
          <AddIcon />
        </IconButton>
      )}

      {/* Width Selector */}
      {selectedWebpartId && selectedWebpart && isManualWidthMode && (
        <Select
          value={selectedWebpart.width || 1}
          onChange={(e) =>
            updateWebpartWidth(selectedWebpartId, parseInt(e.target.value, 10))
          }
          size="small"
          sx={{ width: 60, backgroundColor: '#fff' }}
        >
          {[...Array(12).keys()].map((value) => (
            <MenuItem key={value + 1} value={value + 1}>
              {value + 1}
            </MenuItem>
          ))}
        </Select>
      )}

      {/* Clear Selection Button */}
      <IconButton
        onClick={() => setSelectedWebpartId(null)}
        disabled={!selectedWebpartId}
        color="secondary"
      >
        <ClearIcon />
      </IconButton>
    </Box>
  );
};

export default WebpartControls;
