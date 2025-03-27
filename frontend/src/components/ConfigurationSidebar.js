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
  Tooltip,
  Checkbox,
  Alert,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { ChromePicker } from 'react-color';
import { marked } from 'marked'; // Import for Markdown rendering
import OpenInFullIcon from '@mui/icons-material/OpenInFull'; // Import the enlarge icon

const ConfigurationSidebar = ({ selectedWebpart, updateWebpart }) => {
  const [openColorPickerIndex, setOpenColorPickerIndex] = useState(null);
  const [isMarkdownDialogOpen, setMarkdownDialogOpen] = useState(false);
  const [selectedControlIndex, setSelectedControlIndex] = useState(0);

  if (!selectedWebpart) {
    return <Typography>Select a webpart to configure</Typography>;
  }

  // Determine if we're in stacked mode
  const isStacked = selectedWebpart.isStacked;
  
  // Get the controls array or create one from the single control
  const controls = isStacked 
    ? selectedWebpart.controls || []
    : selectedWebpart.control ? [selectedWebpart.control] : [];
  
  // Get the currently selected control
  const selectedControl = controls[selectedControlIndex] || null;
  
  const handleNameChange = (e) => {
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        name: e.target.value,
      },
    });
  };
  
  const handleBusinessKeyChange = (e) => {
    // If this control is being set as business key, we need to unset any other business key
    if (e.target.checked) {
      // This would ideally update all webparts in all rows, but we don't have access to the full layout here
      // The form editor component will need to handle this when saving the form
      updateWebpart({
        ...selectedWebpart,
        control: {
          ...selectedWebpart.control,
          isBusinessKey: true,
        },
      });
    } else {
      updateWebpart({
        ...selectedWebpart,
        control: {
          ...selectedWebpart.control,
          isBusinessKey: false,
        },
      });
    }
  };
  
  const handleHeaderColumnChange = (e) => {
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        isHeaderColumn: e.target.checked,
      },
    });
  };
  
  const generateNameFromLabel = () => {
    if (!selectedWebpart.control?.props?.label) {
      alert('Please enter a label first');
      return;
    }
    
    // Generate a name based on the label: lowercase, replace spaces with underscores, remove special chars
    const generatedName = selectedWebpart.control.props.label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .substring(0, 30); // Limit length
    
    // Add a timestamp to ensure uniqueness
    const uniqueName = `${generatedName}_${Date.now().toString().substring(8)}`;
    
    updateWebpart({
      ...selectedWebpart,
      control: {
        ...selectedWebpart.control,
        name: uniqueName,
      },
    });
  };

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
    // Get the control to use (either the selected control in stacked mode or the single control)
    const controlToUse = isStacked ? selectedControl : selectedWebpart.control;
    const markdownContent = controlToUse?.props?.markdownContent || '';

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
              onChange={(e) => {
                if (isStacked) {
                  const newControls = [...controls];
                  newControls[selectedControlIndex] = {
                    ...controlToUse,
                    props: {
                      ...controlToUse.props,
                      markdownContent: e.target.value,
                    },
                  };
                  updateWebpart({
                    ...selectedWebpart,
                    controls: newControls
                  });
                } else {
                  updateWebpart({
                    ...selectedWebpart,
                    control: {
                      ...selectedWebpart.control,
                      props: {
                        ...selectedWebpart.control.props,
                        markdownContent: e.target.value,
                      },
                    },
                  });
                }
              }}
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
    // Get the control to configure (either the selected control in stacked mode or the single control)
    const controlToConfig = isStacked ? selectedControl : selectedWebpart.control;
    if (!controlToConfig) return null;
    
    // Update the control in the appropriate place
    const updateControl = (updatedControl) => {
      if (isStacked) {
        const newControls = [...controls];
        newControls[selectedControlIndex] = updatedControl;
        updateWebpart({
          ...selectedWebpart,
          controls: newControls
        });
      } else {
        updateWebpart({
          ...selectedWebpart,
          control: updatedControl
        });
      }
    };
    
    // Handler functions for the control being configured
    const handleNameChange = (e) => {
      updateControl({
        ...controlToConfig,
        name: e.target.value,
      });
    };
    
    const handleBusinessKeyChange = (e) => {
      updateControl({
        ...controlToConfig,
        isBusinessKey: e.target.checked,
      });
    };
    
    const handleHeaderColumnChange = (e) => {
      updateControl({
        ...controlToConfig,
        isHeaderColumn: e.target.checked,
      });
    };
    
    const handleLabelChange = (e) => {
      updateControl({
        ...controlToConfig,
        props: {
          ...controlToConfig.props,
          label: e.target.value,
        },
      });
    };
    
    const generateNameFromLabel = () => {
      if (!controlToConfig.props?.label) {
        alert('Please enter a label first');
        return;
      }
      
      // Generate a name based on the label
      const generatedName = controlToConfig.props.label
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .substring(0, 30);
      
      const uniqueName = `${generatedName}_${Date.now().toString().substring(8)}`;
      
      updateControl({
        ...controlToConfig,
        name: uniqueName,
      });
    };
    
    // Common fields for all control types
    const commonFields = (
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', marginBottom: 1 }}>
          Control Name (unique identifier):
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={controlToConfig.name || ''}
            onChange={handleNameChange}
            placeholder="Enter a unique name"
            required
          />
          <Tooltip title="Generate name from label">
            <Button 
              variant="outlined" 
              size="small" 
              onClick={generateNameFromLabel}
              sx={{ minWidth: 'auto', padding: '4px 8px' }}
            >
              ↻
            </Button>
          </Tooltip>
        </Box>
        
        {/* Data properties - Hide for Markdown controls */}
        {controlToConfig.type !== 'MarkdownControl' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', marginBottom: 1 }}>
              Data Properties:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={controlToConfig.isBusinessKey || false}
                  onChange={handleBusinessKeyChange}
                  size="small"
                />
                <Typography variant="body2">Business Key</Typography>
                <Tooltip title="Only one field can be the business key. It uniquely identifies the record.">
                  <span style={{ marginLeft: '4px', cursor: 'help' }}>ⓘ</span>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={controlToConfig.isHeaderColumn || false}
                  onChange={handleHeaderColumnChange}
                  size="small"
                />
                <Typography variant="body2">Table Column</Typography>
                <Tooltip title="This field will be displayed as a column in table views.">
                  <span style={{ marginLeft: '4px', cursor: 'help' }}>ⓘ</span>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );

    switch (controlToConfig.type) {
      case 'ImageControl':
        return (
          <Box>
            {commonFields}
            <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', marginBottom: 1 }}>
              Image Upload:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    // Check file size (limit to 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      alert('Image size must be less than 2MB');
                      return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateControl({
                        ...controlToConfig,
                        props: {
                          ...controlToConfig.props,
                          imageData: event.target.result,
                          imageType: file.type,
                          imageSize: file.size,
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </Button>
              
              {controlToConfig.props?.imageData && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Preview:
                  </Typography>
                  <Box 
                    component="img" 
                    src={controlToConfig.props.imageData}
                    alt="Uploaded image"
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Size: {Math.round(controlToConfig.props.imageSize / 1024)} KB
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => {
                      updateControl({
                        ...controlToConfig,
                        props: {
                          ...controlToConfig.props,
                          imageData: '',
                          imageType: '',
                          imageSize: 0,
                        },
                      });
                    }}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
              
              <Alert severity="info" sx={{ mt: 1 }}>
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 2MB.
              </Alert>
            </Box>
          </Box>
        );
      
      case 'MarkdownControl':
        return (
          <Box>
            {commonFields}
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
            {commonFields}
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
          <Box>
            {controlToConfig ? commonFields : null}
            <TextField
              label="Label"
              value={controlToConfig?.props?.label || ''}
              onChange={(e) => {
                updateControl({
                  ...controlToConfig,
                  props: {
                    ...controlToConfig.props,
                    label: e.target.value,
                  },
                });
              }}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        );
    }
  };

  const handleDeleteControl = (index) => {
    console.log('handleDeleteControl called with index:', index);
    console.log('isStacked:', isStacked);
    console.log('controls:', JSON.stringify(controls));
    
    if (!isStacked) return;
    
    const newControls = [...controls];
    newControls.splice(index, 1);
    
    // If we're deleting the selected control, select the previous one or the first one
    if (index === selectedControlIndex) {
      setSelectedControlIndex(Math.max(0, index - 1));
    } else if (index < selectedControlIndex) {
      // If we're deleting a control before the selected one, adjust the index
      setSelectedControlIndex(selectedControlIndex - 1);
    }
    
    // If this was the last control, disable stacked mode
    if (newControls.length === 0) {
      updateWebpart({
        ...selectedWebpart,
        isStacked: false,
        controls: [],
        control: null
      });
    } else if (newControls.length === 1 && !selectedWebpart.isStacked) {
      // If we're down to one control and not explicitly in stacked mode, convert back to single control
      updateWebpart({
        ...selectedWebpart,
        isStacked: false,
        control: newControls[0],
        controls: []
      });
    } else {
      // Otherwise just update the controls array
      updateWebpart({
        ...selectedWebpart,
        controls: newControls
      });
    }
  };
  
  const handleToggleStackedMode = () => {
    if (isStacked) {
      // Convert to single control mode if possible
      if (controls.length === 1) {
        updateWebpart({
          ...selectedWebpart,
          isStacked: false,
          control: controls[0],
          controls: []
        });
      } else if (controls.length === 0) {
        updateWebpart({
          ...selectedWebpart,
          isStacked: false,
          controls: []
        });
      } else {
        // Can't disable stacked mode with multiple controls
        alert('Remove additional controls before disabling stacked mode');
      }
    } else {
      // Convert to stacked mode
      updateWebpart({
        ...selectedWebpart,
        isStacked: true,
        controls: selectedWebpart.control ? [selectedWebpart.control] : [],
        control: null
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ padding: 1, backgroundColor: '#f5f5f5' }}>
        Configuration
      </Typography>
      
      {/* Stacked Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
        <Typography variant="subtitle2">Stacked Controls Mode:</Typography>
        <Button 
          variant={isStacked ? "contained" : "outlined"} 
          color={isStacked ? "primary" : "inherit"}
          size="small"
          onClick={handleToggleStackedMode}
        >
          {isStacked ? "Enabled" : "Disabled"}
        </Button>
      </Box>
      
      {isStacked && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Controls:</Typography>
          <List dense sx={{ mb: 2, border: '1px solid #eee', borderRadius: 1 }}>
            {controls.length > 0 ? (
              controls.map((control, index) => (
                <ListItem 
                  key={control.name || index}
                  button
                  selected={index === selectedControlIndex}
                  onClick={() => setSelectedControlIndex(index)}
                  divider={index < controls.length - 1}
                >
                  <ListItemText 
                    primary={control.props?.label || control.name || `Control ${index + 1}`} 
                    secondary={control.type}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={() => handleDeleteControl(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No controls added yet" />
              </ListItem>
            )}
          </List>
        </>
      )}
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Configuration for the selected control */}
      {(isStacked && selectedControl) || (!isStacked && selectedWebpart.control) ? (
        renderConfigurationFields()
      ) : (
        <Typography variant="body2" color="text.secondary">
          {isStacked ? "Select a control or add a new one to configure" : "No control assigned to this webpart"}
        </Typography>
      )}
    </Box>
  );
};

export default ConfigurationSidebar;
