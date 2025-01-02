import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const Webpart = ({ webpart, updateWebpart, selectWebpart, isSelected }) => {
  const handleClick = () => {
    selectWebpart(webpart.id);
  };

  const renderControl = () => {
    switch (webpart.control?.type) {
      case 'LabelControl':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Typography>{webpart.control.props.label}</Typography>
          </Box>
        );
      case 'TextInputControl':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
              width: '100%',
              padding: '0 8px',
            }}
          >
            <Typography>{webpart.control.props.label}</Typography>
            <TextField
              value={webpart.control.value || ''}
              onChange={(e) =>
                updateWebpart({
                  ...webpart,
                  control: {
                    ...webpart.control,
                    value: e.target.value,
                  },
                })
              }
              fullWidth
            />
          </Box>
        );
      default:
        return <p></p>;
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        border: isSelected ? '2px solid blue' : '1px solid #ccc',
        padding: 2,
        borderRadius: '8px',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Prevent overflow issues
        boxSizing: 'border-box', // Ensures padding doesn't expand the element's size
      }}
    >
      {renderControl()}
    </Box>
  );
};

export default Webpart;
