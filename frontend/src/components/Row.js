import React from 'react';
import Webpart from './Webpart';
import { Box, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Row = ({ row, updateRow, deleteRow, addRowBelow, moveWebpart, rowIndex, totalRows }) => {
  const addWebpart = () => {
    const newWebpart = {
      id: `webpart-${Date.now()}`,
      type: 'text',
      position: { row: row.rowId, col: row.webparts.length || 0 }, // Ensure both row and col are set
      label: '',
      elements: [],
    };
    const updatedRow = {
      ...row,
      webparts: [...row.webparts, newWebpart],
    };
    updateRow(updatedRow);
  };

  const updateWebpart = (updatedWebpart) => {
    const updatedWebparts = row.webparts.map((wp) =>
      wp.id === updatedWebpart.id ? updatedWebpart : wp
    );
    updateRow({ ...row, webparts: updatedWebparts }); // Update the parent row with the new webpart data
  };

  return (
    <Box
      sx={{
        border: '2px dotted lightgray',
        borderRadius: '8px',
        padding: 2,
        marginBottom: 2,
        backgroundColor: '#fefefe',
      }}
    >
      {/* Webparts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${row.webparts.length || 1}, 1fr)`,
          gap: 2,
        }}
      >
        {row.webparts.map((webpart, index) => (
          <Webpart
            key={webpart.id}
            webpart={webpart}
            updateWebpart={updateWebpart} // Pass the update handler
            deleteWebpart={(id) => {
              const updatedWebparts = row.webparts.filter((wp) => wp.id !== id);
              updateRow({ ...row, webparts: updatedWebparts });
            }}
            moveWebpart={(direction) => moveWebpart(row.rowId, webpart.id, direction)}
            canMoveLeft={index > 0}
            canMoveRight={index < row.webparts.length - 1}
            canMoveUp={rowIndex > 0} // Can move up if there's a row above
            canMoveDown={rowIndex < totalRows - 1} // Can move down if there's a row below
          />
        ))}
      </Box>

      {/* Row Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 2,
          gap: 2,
        }}
      >
        <IconButton
          onClick={addWebpart}
          color="primary"
          sx={{
            backgroundColor: '#e3f2fd',
            '&:hover': { backgroundColor: '#bbdefb' },
          }}
        >
          <AddIcon />
        </IconButton>
        <Button variant="contained" color="success" onClick={() => addRowBelow(row.rowId)}>
          + Add Row
        </Button>
        <Button variant="contained" color="error" onClick={() => deleteRow(row.rowId)}>
          - Delete Row
        </Button>
      </Box>
    </Box>
  );
};

export default Row;
