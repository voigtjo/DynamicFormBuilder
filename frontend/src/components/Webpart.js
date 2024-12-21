import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Webpart = ({
  webpart,
  updateWebpart,
  deleteWebpart,
  moveWebpart,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canMoveDown,
}) => {
  const handleLabelChange = (e) => {
    updateWebpart({ ...webpart, label: e.target.value });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: 2,
        backgroundColor: '#f9f9f9',
        margin: 1,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Editable Label */}
      <TextField
        label="Label"
        variant="outlined"
        size="small"
        value={webpart.label || ''}
        onChange={handleLabelChange}
        sx={{
          marginBottom: 1,
          width: '100%',
          backgroundColor: '#fff',
        }}
      />

      {/* Movement Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
        <Box>
          <IconButton
            size="small"
            onClick={() => moveWebpart('left')}
            disabled={!canMoveLeft}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => moveWebpart('right')}
            disabled={!canMoveRight}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => moveWebpart('up')}
            disabled={!canMoveUp}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => moveWebpart('down')}
            disabled={!canMoveDown}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Delete Webpart Button */}
      <IconButton
        onClick={() => deleteWebpart(webpart.id)}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
        }}
        size="small"
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default Webpart;
