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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChromePicker } from 'react-color';
import { marked } from 'marked'; // Import for Markdown rendering
import OpenInFullIcon from '@mui/icons-material/OpenInFull'; // Import the enlarge icon

const ConfigurationSidebar = ({ selectedWebpart, updateWebpart }) => {
  const [openColorPickerIndex, setOpenColorPickerIndex] = useState(null);
  const [isMarkdownDialogOpen, setMarkdownDialogOpen] = useState(false);

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

  const handleMarkdownContentChange = (e) => {
    const newMarkdown = e.target.value;
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        props: {
          ...selectedWebpart.control?.props,
          markdownContent: newMarkdown,
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

  const renderMarkdownDialog = () => {
    const markdownContent = selectedWebpart.control?.props?.markdownContent || '';

    return (
      <Dialog
        open={isMarkdownDialogOpen}
        onClose={() => setMarkdownDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Markdown Content</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {/* Markdown Editor */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Raw Markdown
            </Typography>
            <TextField
              value={markdownContent}
              onChange={(e) => handleMarkdownContentChange(e)}
              multiline
              rows={15}
              fullWidth
              variant="outlined"
            />
          </Box>

          {/* Markdown Preview */}
          <Box
            sx={{
              flex: 1,
              border: '1px solid #ccc',
              borderRadius: 2,
              padding: 2,
              backgroundColor: '#f9f9f9',
              overflowY: 'auto',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Preview
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
              sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}
            ></Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarkdownDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderConfigurationFields = () => {
    switch (selectedWebpart.control?.type) {
      case 'MarkdownControl':
        return (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: '0.9rem', marginBottom: 1 }}
            >
              Markdown Content:
            </Typography>
            <TextField
              value={selectedWebpart.control?.props?.markdownContent || ''}
              onChange={handleMarkdownContentChange}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              sx={{ fontSize: '0.85rem' }}
            />
            <IconButton
              onClick={() => setMarkdownDialogOpen(true)}
              size="small"
              sx={{ mt: 1 }}
            >
              <OpenInFullIcon />
            </IconButton>
            {renderMarkdownDialog()}
          </Box>
        );      case 'DropDownField':
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Options:
            </Typography>
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
                        variant="outlined"
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
                        onClick={() => setOpenColorPickerIndex(index)}
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
                            onClick={() => setOpenColorPickerIndex(null)}
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
            label="Label"
            value={selectedWebpart.control?.props?.label || ''}
            onChange={handleLabelChange}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
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
