import React from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const BuilderHeader = ({ title, showActions, onSave, onCreateNew, onCopy, headerColor }) => (
  <Box
    sx={{
      backgroundColor: headerColor || '#e0e0e0', // Dynamically set background color
      padding: 2,
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    }}
  >
    {/* Navigation Buttons (Left-Aligned) */}
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        component="a"
        href="/test"
        color="error"
        variant="outlined"
        target="_blank"
        rel="noopener noreferrer"
      >
        Test
      </Button>
      <Button
        component="a"
        href="/build"
        color="warning"
        variant="outlined"
        target="_blank"
        rel="noopener noreferrer"
      >
        Build
      </Button>
      <Button
        component="a"
        href="/prod"
        color="success"
        variant="outlined"
        target="_blank"
        rel="noopener noreferrer"
      >
        Prod
      </Button>
    </Box>

    {/* Header Title (Centered) */}
    <Typography variant="h5" sx={{ textAlign: 'center', flexGrow: 1 }}>
      {title}
    </Typography>

    {/* Action Buttons (Right-Aligned) */}
    {showActions && (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="primary" onClick={onSave}>
          <SaveIcon />
        </IconButton>
        <IconButton color="secondary" onClick={onCreateNew}>
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton color="info" onClick={onCopy}>
          <ContentCopyIcon />
        </IconButton>
      </Box>
    )}
  </Box>
);

export default BuilderHeader;
