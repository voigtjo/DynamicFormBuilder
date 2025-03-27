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
    // Generate a unique name based on the control type and timestamp
    const uniqueName = `${control.type.toLowerCase()}_${Date.now()}`;
    
    const newControl = control.type === 'MarkdownControl' 
      ? {
          type: control.type,
          name: uniqueName,
          props: { label: control.label },
          value: undefined,
        }
      : {
          type: control.type,
          name: uniqueName,
          isBusinessKey: false, // Default to false
          isHeaderColumn: false, // Default to false
          props: { label: control.label },
          value: control.type === 'TextInputControl' ? '' : undefined,
        };
    
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
            {webpart.control.props.imageData ? (
              <Box 
                component="img" 
                src={webpart.control.props.imageData}
                alt={webpart.control.props.label || "Image"}
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
                  {webpart.control.props.label || "Image placeholder"}
                </Typography>
              </Box>
            )}
          </Box>
        );
        
      case 'MarkdownControl':
        return (
          <Box
            dangerouslySetInnerHTML={{
              __html: marked(webpart.control.props.markdownContent || ''),
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
            <Typography variant="body1">{webpart.control.props.label}</Typography>
          </Box>
        );
      case 'TextInputControl':
        return (
          <TextField
            label={webpart.control.props.label || 'Text Input'}
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
            variant="outlined"
          />
        );
      case 'IntegerInputField':
      case 'DoubleInputField':
        return (
          <TextField
            type="number"
            label={webpart.control.props.label || 'Number Input'}
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
            variant="outlined"
          />
        );
      case 'CurrencyInputField':
        return (
          <TextField
            label={webpart.control.props.label || 'Currency Input'}
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
            variant="outlined"
          />
        );
      case 'BooleanCheckbox':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Checkbox
              checked={webpart.control.value || false}
              onChange={(e) =>
                updateWebpart({
                  ...webpart,
                  control: {
                    ...webpart.control,
                    value: e.target.checked,
                  },
                })
              }
            />
            <Typography>{webpart.control.props.label || 'Checkbox'}</Typography>
          </Box>
        );
      case 'Dateselector':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={webpart.control.props.label || 'Select Date'}
              value={webpart.control.value || null}
              onChange={(date) =>
                updateWebpart({
                  ...webpart,
                  control: {
                    ...webpart.control,
                    value: date,
                  },
                })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        );
      case 'DropDownField':
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel>{webpart.control.props.label || 'Select'}</InputLabel>
            <Select
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
              label={webpart.control.props.label || 'Select'}
            >
              {webpart.control.props.options?.map((option, index) => (
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
    // If in stacked mode, render all controls
    if (webpart.isStacked) {
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {webpart.controls && webpart.controls.length > 0 ? (
            <>
              {webpart.controls.map((control, index) => (
                <Box key={control.name || index} sx={{ mb: index < webpart.controls.length - 1 ? 1 : 0 }}>
                  {renderSingleControl(control)}
                  {index < webpart.controls.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              ))}
              {isSelected && (
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1, alignSelf: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    assignControl({ 
                      type: 'LabelControl', 
                      props: { label: 'New Label' }
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
                    assignControl({ 
                      type: 'LabelControl', 
                      props: { label: 'New Label' }
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
