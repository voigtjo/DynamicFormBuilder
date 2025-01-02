import React from 'react';
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
            <Button
              variant="contained"
              onClick={() =>
                assignControl({
                  type: control.type,
                  props: { label: control.label },
                  value: control.type === 'TextInputControl' ? '' : undefined,
                })
              }
            >
              {control.label}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ControlsSidebar;
    