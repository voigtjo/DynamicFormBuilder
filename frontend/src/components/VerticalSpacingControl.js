import React from 'react';
import { Box, Typography, Slider, Tooltip } from '@mui/material';
import HeightIcon from '@mui/icons-material/Height';

const VerticalSpacingControl = ({ rowId, verticalSpacing, onSpacingChange }) => {
  // Initialize spacing with default if not provided
  const spacing = verticalSpacing !== undefined ? verticalSpacing : 1;
  
  const handleSpacingChange = (event, newValue) => {
    onSpacingChange(rowId, newValue);
  };

  const getSpacingLabel = (value) => {
    switch (value) {
      case 0: return 'None';
      case 1: return 'Small';
      case 2: return 'Medium';
      case 3: return 'Large';
      default: return 'Small';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <Tooltip title="Adjust vertical spacing between controls">
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', minWidth: '60px' }}>
          Spacing:
        </Typography>
      </Tooltip>
      <Slider
        value={spacing}
        onChange={handleSpacingChange}
        min={0}
        max={3}
        step={1}
        marks
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => getSpacingLabel(value)}
        sx={{ mx: 1 }}
      />
      <Typography variant="caption" sx={{ minWidth: '50px' }}>
        {getSpacingLabel(spacing)}
      </Typography>
    </Box>
  );
};

export default VerticalSpacingControl;
