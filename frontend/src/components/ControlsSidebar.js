import React from 'react';
import { useDrag } from 'react-dnd';
import { Button, List, ListItem } from '@mui/material';

const ControlsSidebar = ({ assignControl }) => {
  const controls = [
    { type: 'LabelControl', label: 'Label' },
    { type: 'TextInputControl', label: 'Text Input' },
  ];

  return (
    <div>
      <h3>Controls</h3>
      <List>
        {controls.map((control) => (
          <ListItem key={control.type}>
            <DraggableControl control={control} />
            <Button
              variant="contained"
              onClick={() =>
                assignControl({
                  type: control.type,
                  props: { label: control.label },
                  value: control.type === 'TextInputControl' ? '' : undefined,
                })
              }
              style={{ marginLeft: '8px' }}
            >
              Assign {control.label}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
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
      style={{ cursor: 'grab' }}
    >
      {control.label}
    </Button>
  );
};

export default ControlsSidebar;
