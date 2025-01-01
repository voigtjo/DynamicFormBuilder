import React from 'react';
import { Box, Slider } from '@mui/material';

const WidthSlider = ({ webpartId, width, onWidthChange }) => (
  <Box sx={{ position: 'relative', marginTop: 1 }}>
    <Slider
      value={width || 1}
      onChange={(e, value) => onWidthChange(webpartId, value)}
      min={1}
      max={12}
      step={1}
      marks
      valueLabelDisplay="auto"
    />
  </Box>
);

export default WidthSlider;
