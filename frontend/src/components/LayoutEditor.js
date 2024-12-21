import React from 'react';
import Row from './Row'; // Import Row component
import { Box, Button } from '@mui/material'; // Import Material UI components

const LayoutEditor = ({ layout, setLayout }) => {
  const addRow = (position = 'end', targetRowId = null) => {
    const newRow = {
      rowId: `row-${Date.now()}`,
      webparts: [],
    };

    let updatedRows;
    if (position === 'top') {
      updatedRows = [newRow, ...layout.rows];
    } else if (position === 'below' && targetRowId) {
      updatedRows = layout.rows.flatMap((row) =>
        row.rowId === targetRowId ? [row, newRow] : [row]
      );
    } else {
      updatedRows = [...layout.rows, newRow];
    }

    setLayout({ ...layout, rows: updatedRows });
  };

  const moveWebpart = (rowId, webpartId, direction) => {
    const sourceRowIndex = layout.rows.findIndex((row) => row.rowId === rowId);
    if (sourceRowIndex === -1) return;

    const sourceRow = layout.rows[sourceRowIndex];
    const webpartIndex = sourceRow.webparts.findIndex((wp) => wp.id === webpartId);
    if (webpartIndex === -1) return;

    const webpart = sourceRow.webparts[webpartIndex];
    let updatedRows = [...layout.rows];

    if (direction === 'left' && webpartIndex > 0) {
      // Move within the same row
      const updatedWebparts = [...sourceRow.webparts];
      [updatedWebparts[webpartIndex - 1], updatedWebparts[webpartIndex]] = [
        updatedWebparts[webpartIndex],
        updatedWebparts[webpartIndex - 1],
      ];
      updatedRows[sourceRowIndex] = { ...sourceRow, webparts: updatedWebparts };
    } else if (direction === 'right' && webpartIndex < sourceRow.webparts.length - 1) {
      // Move within the same row
      const updatedWebparts = [...sourceRow.webparts];
      [updatedWebparts[webpartIndex + 1], updatedWebparts[webpartIndex]] = [
        updatedWebparts[webpartIndex],
        updatedWebparts[webpartIndex + 1],
      ];
      updatedRows[sourceRowIndex] = { ...sourceRow, webparts: updatedWebparts };
    } else if (direction === 'up' && sourceRowIndex > 0) {
      // Move to the row above
      const targetRow = updatedRows[sourceRowIndex - 1];
      targetRow.webparts.push(webpart);
      sourceRow.webparts.splice(webpartIndex, 1);
    } else if (direction === 'down' && sourceRowIndex < layout.rows.length - 1) {
      // Move to the row below
      const targetRow = updatedRows[sourceRowIndex + 1];
      targetRow.webparts.push(webpart);
      sourceRow.webparts.splice(webpartIndex, 1);
    }

    setLayout({ ...layout, rows: updatedRows.filter((row) => row.webparts.length > 0) });
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        onClick={() => addRow('top')}
        sx={{ display: 'block', margin: '10px auto' }}
      >
        + Add Row (Top)
      </Button>

      {layout.rows.map((row, rowIndex) => (
        <Row
          key={row.rowId}
          row={row}
          rowIndex={rowIndex}
          totalRows={layout.rows.length}
          updateRow={(updatedRow) => {
            const updatedRows = layout.rows.map((r) =>
              r.rowId === updatedRow.rowId ? updatedRow : r
            );
            setLayout({ ...layout, rows: updatedRows });
          }}
          deleteRow={(rowId) => {
            const updatedRows = layout.rows.filter((r) => r.rowId !== rowId);
            setLayout({ ...layout, rows: updatedRows });
          }}
          addRowBelow={(targetRowId) => addRow('below', targetRowId)}
          moveWebpart={moveWebpart}
        />
      ))}

      <Button
        variant="contained"
        color="success"
        onClick={() => addRow('end')}
        sx={{ display: 'block', margin: '10px auto' }}
      >
        + Add Row (Bottom)
      </Button>
    </Box>
  );
};

export default LayoutEditor;
