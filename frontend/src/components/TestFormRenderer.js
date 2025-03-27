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
  InputLabel,
  Divider
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
    // Handle stacked controls
    if (webpart.isStacked && webpart.controls && webpart.controls.length > 0) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          {webpart.controls.map((control, index) => (
            <Box key={control.name || index}>
              {renderSingleControl(control, webpart)}
              {index < webpart.controls.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </Box>
          ))}
        </Box>
      );
    } else if (webpart.control) {
      // Handle single control
      return renderSingleControl(webpart.control, webpart);
    }
    
    return null;
  };

  const renderSingleControl = (control, webpart) => {
    console.log('renderSingleControl called with control type:', control ? control.type : 'null');
    
    if (!control) {
      console.error('Control is null in renderSingleControl');
      return null;
    }

    // Ensure control.props exists to prevent "Cannot read properties of undefined" errors
    if (!control.props) {
      console.error('control.props is undefined for control:', JSON.stringify(control));
      control.props = { label: control.label || 'Unnamed Control' };
    }

    const value = formData[control.name] || '';
    
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
                  minHeight: '100px',
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  No image available
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
          <Typography 
            variant="body1" 
            sx={{ 
              width: '100%',
              textAlign: webpart?.horizontalAlign || 'left',
              fontWeight: control.props?.textFormatting?.bold ? 'bold' : 'normal',
              fontStyle: control.props?.textFormatting?.italic ? 'italic' : 'normal',
              textDecoration: control.props?.textFormatting?.underline ? 'underline' : 'none',
              fontSize: control.props?.textFormatting?.fontSize || 16,
            }}
          >
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
            flexDirection: 'row',
            border: row.frame && row.frame.enabled ? 
              `${row.frame.thickness === 'thick' ? '3px' : '1px'} ${row.frame.style} #333` : 
              'none',
            borderRadius: '8px',
            padding: row.frame && row.frame.enabled ? 1 : 0
          }}
        >
          <Grid container spacing={2} sx={{ width: '100%' }}>
            {row.webparts.map((webpart, wpIndex) => {
              // Use the same width calculation logic as in the form builder
              let width;
              
              if (row.flexWebpartWidth) {
                if (row.distributionPercentages && row.distributionPercentages.length === row.webparts.length) {
                  // Use the distribution percentages to calculate grid width (out of 12)
                  width = Math.round((row.distributionPercentages[wpIndex] / 100) * 12);
                  // Ensure minimum width of 1
                  width = Math.max(1, width);
                } else {
                  // Default equal distribution
                  width = Math.floor(12 / row.webparts.length);
                }
              } else {
                // Fixed width mode
                width = webpart.width || Math.floor(12 / row.webparts.length);
              }
              
              return (
                <Grid item xs={12} md={width} key={webpart.id || wpIndex}>
                  <Box sx={{ 
                    p: 0.5, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: webpart.verticalAlign === 'top' 
                      ? 'flex-start' 
                      : webpart.verticalAlign === 'bottom'
                        ? 'flex-end'
                        : 'center',
                    alignItems: webpart.horizontalAlign === 'left'
                      ? 'flex-start'
                      : webpart.horizontalAlign === 'right'
                        ? 'flex-end'
                        : 'center'
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
