import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

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
          ...selectedWebpart.control?.props,
          label: e.target.value,
        },
      },
    });
  };

  const handleOptionValueChange = (index, value) => {
    const updatedOptions = [...(selectedWebpart.control?.props?.options || [])];
    updatedOptions[index] = {
      ...(updatedOptions[index] || { color: '' }),
      value,
    };
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control?.props,
          options: updatedOptions,
        },
      },
    });
  };

  const handleOptionColorChange = (index, color) => {
    const updatedOptions = [...(selectedWebpart.control?.props?.options || [])];
    updatedOptions[index] = {
      ...(updatedOptions[index] || { value: '' }),
      color,
    };
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control?.props,
          options: updatedOptions,
        },
      },
    });
  };

  const addOption = () => {
    const updatedOptions = [...(selectedWebpart.control?.props?.options || []), { value: '', color: '' }];
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control?.props,
          options: updatedOptions,
        },
      },
    });
  };

  const renderConfigurationFields = () => {
    switch (selectedWebpart.control?.type) {
      case 'LabelControl':
      case 'TextInputControl':
      case 'IntegerInputField':
      case 'DoubleInputField':
      case 'CurrencyInputField':
      case 'Dateselector':
        return (
          <TextField
            label="Label Text"
            value={selectedWebpart.control?.props?.label || ''}
            onChange={handleLabelChange}
            fullWidth
          />
        );
      case 'DropDownField':
        return (
          <Box>
            <Typography>Options:</Typography>
            {selectedWebpart.control?.props?.options?.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label={`Option ${index + 1} Value`}
                  value={option.value || ''}
                  onChange={(e) => handleOptionValueChange(index, e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Color"
                  value={option.color || ''}
                  onChange={(e) => handleOptionColorChange(index, e.target.value)}
                  fullWidth
                />
              </Box>
            ))}
            <Button onClick={addOption} variant="contained" sx={{ mt: 2 }}>
              Add Option
            </Button>
          </Box>
        );
      default:
        return <Typography>No configuration available for this control</Typography>;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ padding: 1, backgroundColor: '#f5f5f5' }}>
        Configuration
      </Typography>
      {renderConfigurationFields()}
    </Box>
  );
};

export default ConfigurationSidebar;
