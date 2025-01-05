import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, TextField, Typography } from '@mui/material';

const Webpart = ({ webpart, updateWebpart, selectWebpart, isSelected }) => {
  const [, drop] = useDrop(() => ({
    accept: 'CONTROL',
    drop: (control) => assignControl(control),
  }));


  const assignControl = (control) => {
    updateWebpart({
      ...webpart,
      control: {
        type: control.type,
        props: { label: control.label },
        value: control.type === 'TextInputControl' ? '' : undefined,
      },
    });
  };
  

  const handleClick = () => {
    selectWebpart(webpart.id);
  };

  const renderControl = () => {
    if (!webpart.control) {
      return <p>No control assigned</p>;
    }

    switch (webpart.control.type) {
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
        return null;
    }
  };

  return (
    <Box
      ref={drop}
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
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {renderControl()}
    </Box>
  );
};

export default Webpart;
