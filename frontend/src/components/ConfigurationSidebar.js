import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const ConfigurationSidebar = ({ selectedWebpart, updateWebpart }) => {
  if (!selectedWebpart) {
    return <Typography>Select a webpart to configure</Typography>;
  }

  const handleLabelChange = (e) => {
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control.props,
          label: e.target.value,
        },
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6">Configuration</Typography>
      {selectedWebpart.control && selectedWebpart.control.type === 'LabelControl' && (
        <TextField
          label="Label Text"
          value={selectedWebpart.control.props.label || ''}
          onChange={handleLabelChange}
          fullWidth
        />
      )}
      {selectedWebpart.control && selectedWebpart.control.type === 'TextInputControl' && (
        <TextField
          label="Text Input Label"
          value={selectedWebpart.control.props.label || ''}
          onChange={handleLabelChange}
          fullWidth
        />
      )}
    </Box>
  );
};

export default ConfigurationSidebar;
