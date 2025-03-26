import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Box, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  Tooltip, 
  Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';

const ControlsSidebar = ({ assignControl }) => {
  const controls = [
    { type: 'MarkdownControl', label: 'Markdown', icon: <DescriptionIcon /> },
    { type: 'LabelControl', label: 'Label', icon: <TextFormatIcon /> },
    { type: 'TextInputControl', label: 'Text Input', icon: <TextFieldsIcon /> },
    { type: 'IntegerInputField', label: 'Integer Input', icon: <NumbersIcon /> },
    { type: 'DoubleInputField', label: 'Double Input', icon: <NumbersIcon /> },
    { type: 'CurrencyInputField', label: 'Currency Input', icon: <AttachMoneyIcon /> },
    { type: 'BooleanCheckbox', label: 'Checkbox', icon: <CheckBoxIcon /> },
    { type: 'Dateselector', label: 'Date Selector', icon: <CalendarMonthIcon /> },
    { type: 'DropDownField', label: 'DropDown', icon: <ArrowDropDownIcon /> },
    { type: 'ImageControl', label: 'Image', icon: <ImageIcon /> },
    { type: 'DropDownField', label: 'DropDown', icon: <ArrowDropDownIcon /> },
    { type: 'ImageControl', label: 'Image', icon: <ImageIcon /> },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: 2,
        borderRight: '1px solid #ccc',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          padding: '4px 8px',
          borderBottom: '2px solid #ccc',
        }}
      >
        Controls
      </Typography>
      
      {/* Column Headers */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 1,
        paddingX: 1
      }}>
        <Typography variant="subtitle2" sx={{ width: '45%', textAlign: 'center' }}>
          Drag & Drop
        </Typography>
        <Typography variant="subtitle2" sx={{ width: '45%', textAlign: 'center' }}>
          Click to Add
        </Typography>
      </Box>
      
      <List
        sx={{
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {controls.map((control) => (
          <ListItem
            key={control.type}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              padding: '8px 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
              }}
            >
              <DraggableControl control={control} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
              }}
            >
              <Tooltip title={`Add ${control.label}`}>
                <IconButton
                  color="primary"
                  onClick={() =>
                    assignControl({
                      type: control.type,
                      props: { label: control.label },
                      value: control.type === 'TextInputControl' ? '' : undefined,
                    })
                  }
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const DraggableControl = ({ control }) => {
  const [, drag] = useDrag(() => ({
    type: 'CONTROL',
    item: control,
  }));

  return (
    <Tooltip title={control.label}>
      <Button
        ref={drag}
        variant="contained"
        size="small"
        startIcon={control.icon}
        style={{
          cursor: 'grab',
          textTransform: 'none',
          width: '100%', // Ensure equal width
          minWidth: '40px',
          padding: '6px 10px',
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default ControlsSidebar;
