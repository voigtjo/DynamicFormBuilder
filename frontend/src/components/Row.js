import React from 'react';
import Webpart from './Webpart';
import { Box, Button } from '@mui/material';

const Row = ({ row, updateRow, deleteRow, addRowBelow, selectWebpart, selectedWebpartId }) => {
  const updateWebpart = (updatedWebpart) => {
    const updatedWebparts = row.webparts.map((wp) =>
      wp.id === updatedWebpart.id ? updatedWebpart : wp
    );
    updateRow({ ...row, webparts: updatedWebparts });
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
        {row.webparts.map((webpart) => (
          <Webpart
            key={webpart.id}
            webpart={webpart}
            updateWebpart={updateWebpart}
            deleteWebpart={(id) => {
              const updatedWebparts = row.webparts.filter((wp) => wp.id !== id);
              updateRow({ ...row, webparts: updatedWebparts });
            }}
            selectWebpart={selectWebpart}
            isSelected={webpart.id === selectedWebpartId}
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
