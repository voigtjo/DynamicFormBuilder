import React, { useState, useEffect } from 'react';
import Row from './Row';
import { Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear'; // Import ClearIcon


const FormEditor = ({ layout, setLayout, formId, formName, setFormName }) => {
  const [selectedWebpartId, setSelectedWebpartId] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  useEffect(() => {
    if (layout.rows.length === 0) {
      const initialRow = { rowId: `row-${Date.now()}`, webparts: [] };
      setLayout({ ...layout, rows: [initialRow] });
    }
  }, [layout, setLayout]);

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
    if (updatedRows.length === 0) {
      const newRow = { rowId: `row-${Date.now()}`, webparts: [] };
      setLayout({ ...layout, rows: [newRow] });
    } else {
      setLayout({ ...layout, rows: updatedRows });
    }
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

  const moveWebpart = (direction) => {
    if (!selectedWebpartId) return;

    const sourceRowIndex = layout.rows.findIndex((row) =>
      row.webparts.some((wp) => wp.id === selectedWebpartId)
    );
    if (sourceRowIndex === -1) return;

    const sourceRow = layout.rows[sourceRowIndex];
    const webpartIndex = sourceRow.webparts.findIndex((wp) => wp.id === selectedWebpartId);
    if (webpartIndex === -1) return;

    let updatedRows = [...layout.rows];

    if (direction === 'left' && webpartIndex > 0) {
      const updatedWebparts = [...sourceRow.webparts];
      [updatedWebparts[webpartIndex - 1], updatedWebparts[webpartIndex]] = [
        updatedWebparts[webpartIndex],
        updatedWebparts[webpartIndex - 1],
      ];
      updatedRows[sourceRowIndex] = { ...sourceRow, webparts: updatedWebparts };
    } else if (direction === 'right' && webpartIndex < sourceRow.webparts.length - 1) {
      const updatedWebparts = [...sourceRow.webparts];
      [updatedWebparts[webpartIndex + 1], updatedWebparts[webpartIndex]] = [
        updatedWebparts[webpartIndex],
        updatedWebparts[webpartIndex + 1],
      ];
      updatedRows[sourceRowIndex] = { ...sourceRow, webparts: updatedWebparts };
    } else if (direction === 'up' && sourceRowIndex > 0) {
      const targetRow = updatedRows[sourceRowIndex - 1];
      const updatedSourceWebparts = sourceRow.webparts.filter(
        (wp, idx) => idx !== webpartIndex
      );
      const updatedTargetWebparts = [...targetRow.webparts, sourceRow.webparts[webpartIndex]];

      updatedRows[sourceRowIndex] = {
        ...sourceRow,
        webparts: updatedSourceWebparts,
      };
      updatedRows[sourceRowIndex - 1] = {
        ...targetRow,
        webparts: updatedTargetWebparts,
      };
    } else if (direction === 'down' && sourceRowIndex < updatedRows.length - 1) {
      const targetRow = updatedRows[sourceRowIndex + 1];
      const updatedSourceWebparts = sourceRow.webparts.filter(
        (wp, idx) => idx !== webpartIndex
      );
      const updatedTargetWebparts = [...targetRow.webparts, sourceRow.webparts[webpartIndex]];

      updatedRows[sourceRowIndex] = {
        ...sourceRow,
        webparts: updatedSourceWebparts,
      };
      updatedRows[sourceRowIndex + 1] = {
        ...targetRow,
        webparts: updatedTargetWebparts,
      };
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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: '200px',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #ccc',
          padding: 2,
        }}
      >
        <h3>Controls</h3>
        <p>Drag and drop controls here</p>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => moveRow(highlightedRowId, 'up')}
            disabled={!highlightedRowId}
            color="primary"
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            onClick={() => moveRow(highlightedRowId, 'down')}
            disabled={!highlightedRowId}
            color="primary"
          >
            <ArrowDownwardIcon />
          </IconButton>
          <IconButton
            onClick={() => addRow('below', highlightedRowId)}
            disabled={!highlightedRowId}
            color="success"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteRow(highlightedRowId)}
            disabled={!highlightedRowId}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => setHighlightedRowId(null)} // Deselect the highlighted row
            disabled={!highlightedRowId}
            color="secondary"
          >
            <ClearIcon />
          </IconButton>
        </Box>


        <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Move Webpart Left */}
        <IconButton onClick={() => moveWebpart('left')} disabled={!selectedWebpartId}>
          <ArrowBackIcon />
        </IconButton>

        {/* Move Webpart Right */}
        <IconButton onClick={() => moveWebpart('right')} disabled={!selectedWebpartId}>
          <ArrowForwardIcon />
        </IconButton>

        {/* Move Webpart Up */}
        <IconButton onClick={() => moveWebpart('up')} disabled={!selectedWebpartId}>
          <ArrowUpwardIcon />
        </IconButton>

        {/* Move Webpart Down */}
        <IconButton onClick={() => moveWebpart('down')} disabled={!selectedWebpartId}>
          <ArrowDownwardIcon />
        </IconButton>

        {/* Delete Selected Webpart */}
        <IconButton onClick={deleteSelectedWebpart} disabled={!selectedWebpartId} color="error">
          <DeleteIcon />
        </IconButton>

        {/* Add New Webpart */}
        <IconButton
          onClick={() => {
            if (!highlightedRowId) return;
            const newWebpart = {
              id: `webpart-${Date.now()}`,
              type: 'text', // Set a default type
              label: '',
              position: { row: highlightedRowId, col: 0 }, // Example position
            };
            const updatedRows = layout.rows.map((row) =>
              row.rowId === highlightedRowId
                ? { ...row, webparts: [...row.webparts, newWebpart] }
                : row
            );
            setLayout({ ...layout, rows: updatedRows });
          }}
          disabled={!highlightedRowId}
          color="success"
        >
          <AddIcon />
        </IconButton>

        {/* Deselect Webpart */}
        <IconButton
          onClick={() => setSelectedWebpartId(null)}
          disabled={!selectedWebpartId}
          color="secondary"
        >
          <ClearIcon />
        </IconButton>
      </Box>

        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #ccc',
            }}
          >
            <Typography variant="body1" sx={{ color: 'gray' }}>
              <strong>Form ID:</strong>&nbsp;
              {formId || <span style={{ fontStyle: 'italic' }}>New Form ID</span>}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'gray',
                textAlign: 'right',
              }}
            >
              <strong>Form Name:</strong>&nbsp;
              {formName || <span style={{ fontStyle: 'italic' }}>New Form Name</span>}
            </Typography>
          </Box>

          {layout.rows.map((row) => (
            <Row
              key={row.rowId}
              row={row}
              isHighlighted={highlightedRowId === row.rowId}
              highlightRow={() => setHighlightedRowId(row.rowId)}
              updateRow={updateRow}
              deleteRow={deleteRow}
              addRowBelow={(targetRowId) => addRow('below', targetRowId)}
              moveRow={moveRow}
              addWebpartToRow={(rowId) =>
                updateRow({
                  ...row,
                  webparts: [
                    ...row.webparts,
                    {
                      id: `webpart-${Date.now()}`,
                      type: 'text',
                      label: '',
                      position: { row: row.rowId, col: row.webparts.length },
                    },
                  ],
                })
              }
              selectWebpart={setSelectedWebpartId}
              selectedWebpartId={selectedWebpartId}
            />
          ))}
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          width: '200px',
          backgroundColor: '#f5f5f5',
          borderLeft: '1px solid #ccc',
          padding: 2,
        }}
      >
        <h3>Configuration</h3>
        {selectedWebpartId ? (
          <p>Configure Webpart ID: {selectedWebpartId}</p>
        ) : (
          <p>Select a webpart to configure</p>
        )}
      </Box>
    </Box>
  );
};

export default FormEditor;
