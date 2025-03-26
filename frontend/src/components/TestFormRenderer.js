import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Checkbox, 
  FormControlLabel,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { marked } from 'marked';
import dayjs from 'dayjs';

const TestFormRenderer = ({ form, formData, onFormDataChange }) => {
  if (!form || !form.rows) {
    return <Typography>Form not found or has no content</Typography>;
  }

  const renderControl = (webpart) => {
    if (!webpart.control) return null;

    const control = webpart.control;
    const value = formData[control.name] || '';
    
    switch (control.type) {
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
          <Typography variant="body1">
            {control.props.label}
          </Typography>
        );
        
      case 'TextInputControl':
        return (
          <TextField
            label={control.props.label}
            value={value}
            onChange={(e) => onFormDataChange(control.name, e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        );
        
      case 'IntegerInputField':
        return (
          <TextField
            type="number"
            label={control.props.label}
            value={value}
            onChange={(e) => onFormDataChange(control.name, e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ step: 1 }}
          />
        );
        
      case 'DoubleInputField':
        return (
          <TextField
            type="number"
            label={control.props.label}
            value={value}
            onChange={(e) => onFormDataChange(control.name, e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ step: 0.01 }}
          />
        );
        
      case 'CurrencyInputField':
        return (
          <TextField
            type="number"
            label={control.props.label}
            value={value}
            onChange={(e) => onFormDataChange(control.name, e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            inputProps={{ step: 0.01 }}
            InputProps={{
              startAdornment: control.props.currency || '€',
            }}
          />
        );
        
      case 'BooleanCheckbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => onFormDataChange(control.name, e.target.checked)}
              />
            }
            label={control.props.label}
          />
        );
        
      case 'Dateselector':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={control.props.label}
              value={value ? dayjs(value) : null}
              onChange={(date) => onFormDataChange(control.name, date ? date.toISOString() : null)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              slotProps={{
                textField: { fullWidth: true, margin: 'normal' }
              }}
            />
          </LocalizationProvider>
        );
        
      case 'DropDownField':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{control.props.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onFormDataChange(control.name, e.target.value)}
              label={control.props.label}
            >
              {control.props.options?.map((option, index) => (
                <MenuItem 
                  key={index} 
                  value={option.value}
                  style={{ color: option.color || 'inherit' }}
                >
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      default:
        return <Typography>Unsupported control type: {control.type}</Typography>;
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: '100%' }}>
      {form.rows.map((row, rowIndex) => (
        <Box 
          key={row.rowId || rowIndex} 
          sx={{ 
            mb: 2,
            height: row.height ? `${row.height}px` : 'auto',
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Grid container spacing={2} sx={{ width: '100%' }}>
            {row.webparts.map((webpart, wpIndex) => {
              // Use the same width calculation logic as in the form builder
              const width = row.flexWebpartWidth 
                ? Math.floor(12 / row.webparts.length) 
                : (webpart.width || Math.floor(12 / row.webparts.length));
              
              return (
                <Grid item xs={12} md={width} key={webpart.id || wpIndex}>
                  <Box sx={{ 
                    p: 1, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    {renderControl(webpart)}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default TestFormRenderer;
