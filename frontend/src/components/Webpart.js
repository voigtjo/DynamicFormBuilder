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
} from '@mui/material';
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
    
    updateWebpart({
      ...webpart,
      control: {
        type: control.type,
        name: uniqueName, // Add a unique name for the control
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
      return <Typography>No control assigned</Typography>;
    }

    switch (webpart.control.type) {
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
        overflow: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {renderControl()}
    </Box>
  );
};

export default Webpart;
