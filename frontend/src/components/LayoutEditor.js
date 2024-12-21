import React, { useState } from 'react';
import Row from './Row'; // Import Row component
import { Box, Button, IconButton } from '@mui/material'; // Import Material UI components
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

const LayoutEditor = ({ layout, setLayout }) => {
  const [selectedWebpartId, setSelectedWebpartId] = useState(null); // Track selected webpart

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

  const addWebpartRight = () => {
    if (!selectedWebpartId) return;

    const sourceRowIndex = layout.rows.findIndex((row) =>
      row.webparts.some((wp) => wp.id === selectedWebpartId)
    );
    if (sourceRowIndex === -1) return;

    const sourceRow = layout.rows[sourceRowIndex];
    const webpartIndex = sourceRow.webparts.findIndex((wp) => wp.id === selectedWebpartId);

    const newWebpart = {
      id: `webpart-${Date.now()}`,
      type: 'text',
      position: { row: sourceRow.rowId, col: webpartIndex + 1 },
      label: '',
      elements: [],
    };

    const updatedWebparts = [
      ...sourceRow.webparts.slice(0, webpartIndex + 1),
      newWebpart,
      ...sourceRow.webparts.slice(webpartIndex + 1),
    ];

    const updatedRow = { ...sourceRow, webparts: updatedWebparts };
    const updatedRows = layout.rows.map((row, index) =>
      index === sourceRowIndex ? updatedRow : row
    );

    setLayout({ ...layout, rows: updatedRows });
  };

  const moveWebpart = (direction) => {
    if (!selectedWebpartId) return;

    const sourceRowIndex = layout.rows.findIndex((row) =>
      row.webparts.some((wp) => wp.id === selectedWebpartId)
    );
    if (sourceRowIndex === -1) return;

    const sourceRow = layout.rows[sourceRowIndex];
    const webpartIndex = sourceRow.webparts.findIndex((wp) => wp.id === selectedWebpartId);
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

  const deleteSelectedWebpart = () => {
    if (!selectedWebpartId) return;

    const updatedRows = layout.rows.map((row) => ({
      ...row,
      webparts: row.webparts.filter((wp) => wp.id !== selectedWebpartId),
    }));

    setLayout({ ...layout, rows: updatedRows });
    setSelectedWebpartId(null); // Clear selection
  };

  return (
    <Box>
      {/* Button Row */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginBottom: 2 }}>
        <IconButton onClick={addWebpartRight} disabled={!selectedWebpartId} color="primary">
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => moveWebpart('left')} disabled={!selectedWebpartId}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={() => moveWebpart('right')} disabled={!selectedWebpartId}>
          <ArrowForwardIcon />
        </IconButton>
        <IconButton onClick={() => moveWebpart('up')} disabled={!selectedWebpartId}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={() => moveWebpart('down')} disabled={!selectedWebpartId}>
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton
          onClick={deleteSelectedWebpart}
          disabled={!selectedWebpartId}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => setSelectedWebpartId(null)} disabled={!selectedWebpartId}>
          <ClearIcon />
        </IconButton>
      </Box>

      {/* Rows */}
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
          selectWebpart={setSelectedWebpartId}
          selectedWebpartId={selectedWebpartId}
        />
      ))}
    </Box>
  );
};

export default LayoutEditor;
