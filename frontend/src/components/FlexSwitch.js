import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

const FlexSwitch = ({ isFlexMode, onSwitchChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
    <Typography variant="body2" sx={{ marginRight: 2 }}>
      Flex Webpart Width
    </Typography>
    <Switch checked={isFlexMode} onChange={onSwitchChange} />
  </Box>
);

export default FlexSwitch;
