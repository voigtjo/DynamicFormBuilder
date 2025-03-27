import React from 'react';
import { useDrop } from 'react-dnd';
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { marked } from 'marked'; // Use marked for Markdown rendering
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Webpart = ({ webpart, updateWebpart, selectWebpart, isSelected }) => {
  const [, drop] = useDrop(() => ({
    accept: 'CONTROL',
    drop: (control) => assignControl(control),
  }));

  const assignControl = (control) => {
    console.log('assignControl called with:', JSON.stringify(control));
    console.log('Current webpart state:', JSON.stringify(webpart));
    
    // Generate a unique name based on the control type and timestamp
    const uniqueName = `${control.type.toLowerCase()}_${Date.now()}`;
    
    // Ensure control has props
    if (!control.props) {
      console.error('Control props is null or undefined:', control);
      control.props = { label: control.label || 'New Control' };
    }
    
    const newControl = control.type === 'MarkdownControl' 
      ? {
          type: control.type,
          name: uniqueName,
          props: { label: control.props.label || control.label || 'Markdown' },
          value: undefined,
        }
      : {
          type: control.type,
          name: uniqueName,
          isBusinessKey: false, // Default to false
          isHeaderColumn: false, // Default to false
          props: { label: control.props.label || control.label || 'Control' },
          value: control.type === 'TextInputControl' ? '' : undefined,
        };
    
    console.log('Created newControl:', JSON.stringify(newControl));
    
    // If webpart is already in stacked mode, add to controls array
    if (webpart.isStacked) {
      updateWebpart({
        ...webpart,
        controls: [...(webpart.controls || []), newControl],
      });
    } else if (webpart.control) {
      // If there's already a control, convert to stacked mode
      updateWebpart({
        ...webpart,
        isStacked: true,
        controls: [webpart.control, newControl],
        control: null, // Remove the single control
      });
    } else {
      // If no control yet, just set it as the single control
      updateWebpart({
        ...webpart,
        control: newControl,
      });
    }
  };

  const handleClick = () => {
    selectWebpart(webpart.id);
  };

  const addStackedControl = () => {
    // Convert to stacked mode if not already
    if (!webpart.isStacked) {
      if (webpart.control) {
        // Convert single control to stacked
        updateWebpart({
          ...webpart,
          isStacked: true,
          controls: [webpart.control],
          control: null,
        });
      } else {
        // Just enable stacked mode
        updateWebpart({
          ...webpart,
          isStacked: true,
          controls: [],
        });
      }
    }
  };

  const renderSingleControl = (control) => {
    if (!control) {
      return <Typography>No control assigned</Typography>;
    }
    
    // Ensure control.props exists to prevent "Cannot read properties of undefined" errors
    if (!control.props) {
      control.props = { label: control.label || 'Unnamed Control' };
    }

    switch (control.type) {
      case 'ImageControl':
        return (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            {control.props.imageData ? (
              <Box 
                component="img" 
                src={control.props.imageData}
                alt={control.props.label || "Image"}
                sx={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  padding: 2,
                  height: '100%',
                  minHeight: '100px',
                }}
              >
                <ImageIcon sx={{ fontSize: 40, color: '#aaa', mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  {control.props.label || "Image placeholder"}
                </Typography>
              </Box>
            )}
          </Box>
        );
        
      case 'MarkdownControl':
        return (
          <Box
            dangerouslySetInnerHTML={{
              __html: marked(control.props.markdownContent || ''),
            }}
            sx={{ width: '100%' }}
          />
        );
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
            <Typography variant="body1">{control.props.label}</Typography>
          </Box>
        );
      case 'TextInputControl':
        return (
          <TextField
            label={control.props.label || 'Text Input'}
            value={control.value || ''}
            onChange={(e) => {
              // For stacked controls, we need to update the specific control in the array
              if (webpart.isStacked) {
                const updatedControls = [...webpart.controls];
                const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                if (controlIndex !== -1) {
                  updatedControls[controlIndex] = {
                    ...control,
                    value: e.target.value
                  };
                  updateWebpart({
                    ...webpart,
                    controls: updatedControls
                  });
                }
              } else {
                updateWebpart({
                  ...webpart,
                  control: {
                    ...control,
                    value: e.target.value,
                  },
                });
              }
            }}
            fullWidth
            variant="outlined"
          />
        );
      case 'IntegerInputField':
      case 'DoubleInputField':
        return (
          <TextField
            type="number"
            label={control.props.label || 'Number Input'}
            value={control.value || ''}
            onChange={(e) => {
              if (webpart.isStacked) {
                const updatedControls = [...webpart.controls];
                const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                if (controlIndex !== -1) {
                  updatedControls[controlIndex] = {
                    ...control,
                    value: e.target.value
                  };
                  updateWebpart({
                    ...webpart,
                    controls: updatedControls
                  });
                }
              } else {
                updateWebpart({
                  ...webpart,
                  control: {
                    ...control,
                    value: e.target.value,
                  },
                });
              }
            }}
            fullWidth
            variant="outlined"
          />
        );
      case 'CurrencyInputField':
        return (
          <TextField
            label={control.props.label || 'Currency Input'}
            value={control.value || ''}
            onChange={(e) => {
              if (webpart.isStacked) {
                const updatedControls = [...webpart.controls];
                const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                if (controlIndex !== -1) {
                  updatedControls[controlIndex] = {
                    ...control,
                    value: e.target.value
                  };
                  updateWebpart({
                    ...webpart,
                    controls: updatedControls
                  });
                }
              } else {
                updateWebpart({
                  ...webpart,
                  control: {
                    ...control,
                    value: e.target.value,
                  },
                });
              }
            }}
            fullWidth
            variant="outlined"
          />
        );
      case 'BooleanCheckbox':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Checkbox
              checked={control.value || false}
              onChange={(e) => {
                if (webpart.isStacked) {
                  const updatedControls = [...webpart.controls];
                  const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                  if (controlIndex !== -1) {
                    updatedControls[controlIndex] = {
                      ...control,
                      value: e.target.checked
                    };
                    updateWebpart({
                      ...webpart,
                      controls: updatedControls
                    });
                  }
                } else {
                  updateWebpart({
                    ...webpart,
                    control: {
                      ...control,
                      value: e.target.checked,
                    },
                  });
                }
              }}
            />
            <Typography>{control.props.label || 'Checkbox'}</Typography>
          </Box>
        );
      case 'Dateselector':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={control.props.label || 'Select Date'}
              value={control.value || null}
              onChange={(date) => {
                if (webpart.isStacked) {
                  const updatedControls = [...webpart.controls];
                  const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                  if (controlIndex !== -1) {
                    updatedControls[controlIndex] = {
                      ...control,
                      value: date
                    };
                    updateWebpart({
                      ...webpart,
                      controls: updatedControls
                    });
                  }
                } else {
                  updateWebpart({
                    ...webpart,
                    control: {
                      ...control,
                      value: date,
                    },
                  });
                }
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        );
      case 'DropDownField':
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel>{control.props.label || 'Select'}</InputLabel>
            <Select
              value={control.value || ''}
              onChange={(e) => {
                if (webpart.isStacked) {
                  const updatedControls = [...webpart.controls];
                  const controlIndex = updatedControls.findIndex(c => c.name === control.name);
                  if (controlIndex !== -1) {
                    updatedControls[controlIndex] = {
                      ...control,
                      value: e.target.value
                    };
                    updateWebpart({
                      ...webpart,
                      controls: updatedControls
                    });
                  }
                } else {
                  updateWebpart({
                    ...webpart,
                    control: {
                      ...control,
                      value: e.target.value,
                    },
                  });
                }
              }}
              label={control.props.label || 'Select'}
            >
              {control.props.options?.map((option, index) => (
                <MenuItem key={index} value={option.value} style={{ color: option.color || 'inherit' }}>
                  {option.value || `Option ${index + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const renderControl = () => {
    console.log('renderControl called');
    console.log('webpart.isStacked:', webpart.isStacked);
    console.log('webpart.controls:', webpart.controls ? JSON.stringify(webpart.controls) : 'undefined');
    
    // If in stacked mode, render all controls
    if (webpart.isStacked) {
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {webpart.controls && webpart.controls.length > 0 ? (
            <>
              {webpart.controls.map((control, index) => {
                console.log(`Rendering stacked control ${index}:`, JSON.stringify(control));
                return (
                  <Box key={control.name || index} sx={{ mb: index < webpart.controls.length - 1 ? 1 : 0 }}>
                    {renderSingleControl(control)}
                    {index < webpart.controls.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </Box>
                );
              })}
              {isSelected && (
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1, alignSelf: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open a dialog to select control type instead of directly adding a label
                    const controlType = prompt(
                      'Select control type:\n1. Label\n2. Text Input\n3. Integer Input\n4. Double Input\n5. Currency Input\n6. Checkbox\n7. Date Selector\n8. Dropdown\n9. Markdown\n10. Image',
                      '1'
                    );
                    
                    if (!controlType) return;
                    
                    const controlTypes = {
                      '1': 'LabelControl',
                      '2': 'TextInputControl',
                      '3': 'IntegerInputField',
                      '4': 'DoubleInputField',
                      '5': 'CurrencyInputField',
                      '6': 'BooleanCheckbox',
                      '7': 'Dateselector',
                      '8': 'DropDownField',
                      '9': 'MarkdownControl',
                      '10': 'ImageControl'
                    };
                    
                    const selectedType = controlTypes[controlType] || 'LabelControl';
                    const label = prompt('Enter label for the control:', 'New Control');
                    
                    if (label === null) return;
                    
                    console.log('Add Control button clicked in stacked mode');
                    assignControl({ 
                      type: selectedType, 
                      name: `${selectedType.toLowerCase()}_${Date.now()}`,
                      props: { label: label || 'New Control' }
                    });
                  }}
                >
                  Add Control
                </Button>
              )}
            </>
          ) : (
            <>
              <Typography>No controls assigned</Typography>
              {isSelected && (
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1, alignSelf: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open a dialog to select control type instead of directly adding a label
                    const controlType = prompt(
                      'Select control type:\n1. Label\n2. Text Input\n3. Integer Input\n4. Double Input\n5. Currency Input\n6. Checkbox\n7. Date Selector\n8. Dropdown\n9. Markdown\n10. Image',
                      '1'
                    );
                    
                    if (!controlType) return;
                    
                    const controlTypes = {
                      '1': 'LabelControl',
                      '2': 'TextInputControl',
                      '3': 'IntegerInputField',
                      '4': 'DoubleInputField',
                      '5': 'CurrencyInputField',
                      '6': 'BooleanCheckbox',
                      '7': 'Dateselector',
                      '8': 'DropDownField',
                      '9': 'MarkdownControl',
                      '10': 'ImageControl'
                    };
                    
                    const selectedType = controlTypes[controlType] || 'LabelControl';
                    const label = prompt('Enter label for the control:', 'New Control');
                    
                    if (label === null) return;
                    
                    assignControl({ 
                      type: selectedType, 
                      name: `${selectedType.toLowerCase()}_${Date.now()}`,
                      props: { label: label || 'New Control' }
                    });
                  }}
                >
                  Add Control
                </Button>
              )}
            </>
          )}
        </Box>
      );
    } else {
      // Regular single control mode
      return renderSingleControl(webpart.control);
    }
  };

  return (
    <Box
      ref={drop}
      onClick={handleClick}
      sx={{
        border: isSelected ? '2px solid blue' : '1px solid #ccc',
        padding: 0.5, // Reduced from 1 to 0.5 (4px instead of 8px)
        borderRadius: '8px',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {renderControl()}
      {isSelected && !webpart.isStacked && !webpart.control && (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            addStackedControl();
          }}
        >
          Enable Stacked Mode
        </Button>
      )}
    </Box>
  );
};

export default Webpart;
