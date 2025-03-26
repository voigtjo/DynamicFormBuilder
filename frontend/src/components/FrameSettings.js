import React from 'react';
import { Box, Typography, Switch, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import LineWeightIcon from '@mui/icons-material/LineWeight';

const FrameSettings = ({ rowId, frame, onFrameChange }) => {
  // Initialize frame with defaults if not provided
  const frameSettings = frame || { enabled: false, style: 'solid', thickness: 'thin' };
  
  const handleEnableChange = (event) => {
    onFrameChange(rowId, {
      ...frameSettings,
      enabled: event.target.checked
    });
  };
  
  const handleStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      onFrameChange(rowId, {
        ...frameSettings,
        style: newStyle
      });
    }
  };
  
  const handleThicknessChange = (event, newThickness) => {
    if (newThickness !== null) {
      onFrameChange(rowId, {
        ...frameSettings,
        thickness: newThickness
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>Frame:</Typography>
        <Switch
          checked={frameSettings.enabled}
          onChange={handleEnableChange}
          size="small"
        />
      </Box>
      
      {frameSettings.enabled && (
        <>
          <Tooltip title="Line Style">
            <ToggleButtonGroup
              value={frameSettings.style}
              exclusive
              onChange={handleStyleChange}
              size="small"
            >
              <ToggleButton value="solid">
                <BorderAllIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="dotted">
                <BorderStyleIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Tooltip>
          
          <Tooltip title="Line Thickness">
            <ToggleButtonGroup
              value={frameSettings.thickness}
              exclusive
              onChange={handleThicknessChange}
              size="small"
            >
              <ToggleButton value="thin">
                <LineWeightIcon fontSize="small" sx={{ transform: 'scale(0.8)' }} />
              </ToggleButton>
              <ToggleButton value="thick">
                <LineWeightIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default FrameSettings;
