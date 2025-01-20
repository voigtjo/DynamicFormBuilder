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
      case 'MarkdownControl':
        return (
          <Box
            dangerouslySetInnerHTML={{
              __html: marked(webpart.control.props.markdownContent || ''),
            }}
            sx={{ width: '100%' }}
          ></Box>
        );
      case 'LabelControl':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <Typography>{webpart.control.props.label}</Typography>
          </Box>
        );
      case 'TextInputControl':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%' }}>
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
      case 'IntegerInputField':
      case 'DoubleInputField':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%' }}>
            <Typography>{webpart.control.props.label}</Typography>
            <TextField
              type="number"
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
      case 'CurrencyInputField':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%' }}>
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
              label={webpart.control.props.label}
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
            <FormControl fullWidth>
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
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {renderControl()}
    </Box>
  );
};

export default Webpart;
