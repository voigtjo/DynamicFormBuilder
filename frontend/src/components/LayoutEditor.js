import React, { useState } from 'react';
import Row from './Row';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

const LayoutEditor = ({ layout, setLayout }) => {
  const [selectedWebpartId, setSelectedWebpartId] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const addRow = (position = 'end', targetRowId = null) => {
    const newRow = { rowId: `row-${Date.now()}`, webparts: [] };
    const updatedRows =
      position === 'top'
        ? [newRow, ...layout.rows]
        : position === 'below' && targetRowId
        ? layout.rows.flatMap((row) =>
            row.rowId === targetRowId ? [row, newRow] : [row]
          )
        : [...layout.rows, newRow];
    setLayout({ ...layout, rows: updatedRows });
  };

  const updateRow = (updatedRow) => {
    const updatedRows = layout.rows.map((row) =>
      row.rowId === updatedRow.rowId ? updatedRow : row
    );
    setLayout({ ...layout, rows: updatedRows });
  };

  const deleteRow = (rowId) => {
    const updatedRows = layout.rows.filter((row) => row.rowId !== rowId);
    setLayout({ ...layout, rows: updatedRows });
    setHighlightedRowId(null);
  };

  const moveRow = (rowId, direction) => {
    const rowIndex = layout.rows.findIndex((row) => row.rowId === rowId);
    if (rowIndex === -1) return;
    const updatedRows = [...layout.rows];
    if (direction === 'up' && rowIndex > 0) {
      [updatedRows[rowIndex - 1], updatedRows[rowIndex]] = [
        updatedRows[rowIndex],
        updatedRows[rowIndex - 1],
      ];
    } else if (direction === 'down' && rowIndex < updatedRows.length - 1) {
      [updatedRows[rowIndex + 1], updatedRows[rowIndex]] = [
        updatedRows[rowIndex],
        updatedRows[rowIndex + 1],
      ];
    }
    setLayout({ ...layout, rows: updatedRows });
  };

  const addWebpartToRow = (rowId) => {
    const newWebpart = {
      id: `webpart-${Date.now()}`,
      type: 'text',
      position: null,
      label: 'New Webpart',
      elements: [],
    };
    const updatedRows = layout.rows.map((row) =>
      row.rowId === rowId ? { ...row, webparts: [...row.webparts, newWebpart] } : row
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

    setLayout({ ...layout, rows: updatedRows });
  };

  const deleteSelectedWebpart = () => {
    if (!selectedWebpartId) return;

    const updatedRows = layout.rows.map((row) => ({
      ...row,
      webparts: row.webparts.filter((wp) => wp.id !== selectedWebpartId),
    }));

    setLayout({ ...layout, rows: updatedRows });
    setSelectedWebpartId(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        {/* Left-Aligned Row Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => moveRow(highlightedRowId, 'up')} disabled={!highlightedRowId} color="primary">
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton onClick={() => moveRow(highlightedRowId, 'down')} disabled={!highlightedRowId} color="primary">
            <ArrowDownwardIcon />
          </IconButton>
          <IconButton onClick={() => addRow('below', highlightedRowId)} disabled={!highlightedRowId} color="success">
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => deleteRow(highlightedRowId)} disabled={!highlightedRowId} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => setHighlightedRowId(null)} disabled={!highlightedRowId} color="secondary">
            <ClearIcon />
          </IconButton>
        </Box>

        {/* Right-Aligned Webpart Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => addWebpartToRow(highlightedRowId)} disabled={!highlightedRowId} color="primary">
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
          <IconButton onClick={deleteSelectedWebpart} disabled={!selectedWebpartId} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => setSelectedWebpartId(null)} disabled={!selectedWebpartId}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {layout.rows.map((row) => (
          <Row
            key={row.rowId}
            row={row}
            isHighlighted={highlightedRowId === row.rowId}
            highlightRow={() => setHighlightedRowId(row.rowId)}
            unhighlightRow={() => setHighlightedRowId(null)}
            updateRow={updateRow}
            deleteRow={deleteRow}
            addRowBelow={(targetRowId) => addRow('below', targetRowId)}
            moveRow={moveRow}
            addWebpartToRow={addWebpartToRow}
            selectWebpart={setSelectedWebpartId}
            selectedWebpartId={selectedWebpartId}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LayoutEditor;
