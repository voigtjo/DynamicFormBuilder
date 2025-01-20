import React from 'react';
import { useDrag } from 'react-dnd';
import { Box, Button, List, ListItem, Typography } from '@mui/material';

const ControlsSidebar = ({ assignControl }) => {
  const controls = [
    { type: 'MarkdownControl', label: 'Markdown' }, // New Markdown control
    { type: 'LabelControl', label: 'Label' },
    { type: 'TextInputControl', label: 'Text Input' },
    { type: 'IntegerInputField', label: 'Integer Input' },
    { type: 'DoubleInputField', label: 'Double Input' },
    { type: 'CurrencyInputField', label: 'Currency Input' },
    { type: 'BooleanCheckbox', label: 'Checkbox' },
    { type: 'Dateselector', label: 'Date Selector' },
    { type: 'DropDownField', label: 'DropDown' },
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
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  assignControl({
                    type: control.type,
                    props: { label: control.label },
                    value: control.type === 'TextInputControl' ? '' : undefined,
                  })
                }
                sx={{
                  textTransform: 'none',
                  width: '100%', // Ensure equal width
                }}
              >
                {control.label}
              </Button>
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
    <Button
      ref={drag}
      variant="contained"
      size="small"
      style={{
        cursor: 'grab',
        textTransform: 'none',
        width: '100%', // Ensure equal width
      }}
    >
      {control.label}
    </Button>
  );
};

export default ControlsSidebar;
