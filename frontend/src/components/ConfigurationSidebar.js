import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChromePicker } from 'react-color';

const ConfigurationSidebar = ({ selectedWebpart, updateWebpart }) => {
  const [openColorPickerIndex, setOpenColorPickerIndex] = useState(null);

  if (!selectedWebpart) {
    return <Typography>Select a webpart to configure</Typography>;
  }

  // Handle Markdown Content Change
  const handleMarkdownContentChange = (e) => {
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control?.props,
          markdownContent: e.target.value,
        },
      },
    });
  };

  // Handle Dropdown Option Updates (unchanged)
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
      color: color.hex,
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

  // Render Fields for Configuration
  const renderConfigurationFields = () => {
    switch (selectedWebpart.control?.type) {
      case 'MarkdownControl':
        return (
          <Box>
            <Typography>Markdown Content:</Typography>
            <TextField
              label="Markdown Content"
              value={selectedWebpart.control?.props?.markdownContent || ''}
              onChange={handleMarkdownContentChange}
              multiline
              rows={4}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 'DropDownField':
        return (
          <Box>
            <Typography>Options:</Typography>
            <Table>
              <TableBody>
                {selectedWebpart.control?.props?.options?.map((option, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        label={`Option ${index + 1} Value`}
                        value={option.value || ''}
                        onChange={(e) => handleOptionValueChange(index, e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: option.color || '#ffffff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setOpenColorPickerIndex(index)} // Open color picker
                      ></Box>
                      {openColorPickerIndex === index && (
                        <Box
                          sx={{
                            position: 'absolute',
                            zIndex: 10,
                            top: '50px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <ChromePicker
                            color={option.color || '#ffffff'}
                            onChange={(color) => handleOptionColorChange(index, color)}
                            disableAlpha
                          />
                          <IconButton
                            onClick={() => setOpenColorPickerIndex(null)} // Close the color picker
                            sx={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              backgroundColor: 'white',
                              border: '1px solid #ccc',
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addOption} variant="contained" sx={{ mt: 2 }}>
              Add Option
            </Button>
          </Box>
        );
      default:
        return (
          <TextField
            label="Label Text"
            value={selectedWebpart.control?.props?.label || ''}
            onChange={(e) =>
              updateWebpart({
                ...selectedWebpart,
                control: {
                  ...selectedWebpart.control,
                  props: { ...selectedWebpart.control?.props, label: e.target.value },
                },
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
        );
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
