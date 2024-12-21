import React from 'react';
import { Box, TextField } from '@mui/material';

const Webpart = ({ webpart, updateWebpart, selectWebpart, isSelected }) => {
  const handleLabelChange = (e) => {
    updateWebpart({ ...webpart, label: e.target.value });
  };

  return (
    <Box
      onClick={() => selectWebpart(webpart.id)}
      sx={{
        position: 'relative',
        border: isSelected ? '2px solid blue' : '1px solid #ccc',
        borderRadius: '8px',
        padding: 2,
        backgroundColor: isSelected ? '#e3f2fd' : '#f9f9f9',
        margin: 1,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      }}
    >
      <TextField
        label="Label"
        variant="outlined"
        size="small"
        value={webpart.label || ''}
        onChange={handleLabelChange}
        sx={{ marginBottom: 1, width: '100%' }}
      />
    </Box>
  );
};

export default Webpart;
