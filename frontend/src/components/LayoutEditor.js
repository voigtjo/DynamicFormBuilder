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
  const [highlightedRowId, setHighlightedRowId] = useState(null); // New state for highlighting

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
  

  const moveRow = (rowId, direction) => {
    const rowIndex = layout.rows.findIndex((row) => row.rowId === rowId);
    if (rowIndex === -1) return;
  
    let updatedRows = [...layout.rows];
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

  const deleteRow = (rowId) => {
    const updatedRows = layout.rows.filter((row) => row.rowId !== rowId);
    setLayout({ ...layout, rows: updatedRows });
    setHighlightedRowId(null); // Clear the row selection after deletion
  };
  

  const addWebpartToRow = (rowId) => {
    const newWebpart = {
      id: `webpart-${Date.now()}`,
      type: 'text', // Default type
      position: null, // Position will be managed dynamically
      label: 'New Webpart',
      elements: [],
    };

    const updatedRows = layout.rows.map((row) => {
      if (row.rowId === rowId) {
        return {
          ...row,
          webparts: [...row.webparts, newWebpart],
        };
      }
      return row;
    });

    setLayout({ ...layout, rows: updatedRows });
  };

  layout.rows.map((row) => (
    <Row
      key={row.rowId}
      row={row}
      isHighlighted={highlightedRowId === row.rowId} // Correct usage
      highlightRow={() => setHighlightedRowId(row.rowId)} // Highlight this row
      unhighlightRow={() => setHighlightedRowId(null)} // Unhighlight this row
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
      addRowBelow={(targetRowId) => addRow('below', targetRowId)} // Correctly reference addRow
      moveRow={moveRow}
      selectWebpart={setSelectedWebpartId}
      selectedWebpartId={selectedWebpartId}
    />
  ))
  
  
  

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Add space between left and right controls
          alignItems: 'center', // Vertically align controls
          marginBottom: 2,
        }}
      >
        {/* Left-Aligned Row Controls */}
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
            onClick={() => setHighlightedRowId(null)}
            disabled={!highlightedRowId}
            color="secondary"
          >
            <ClearIcon />
          </IconButton>
        </Box>

        {/* Right-Aligned Webpart Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
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
          <IconButton onClick={deleteSelectedWebpart} disabled={!selectedWebpartId} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => setSelectedWebpartId(null)} disabled={!selectedWebpartId}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>


      {/* Rows */}
      {layout.rows.map((row, rowIndex) => (
        <Row
        key={row.rowId}
        row={row}
        isHighlighted={highlightedRowId === row.rowId} // Highlight condition
        highlightRow={() => setHighlightedRowId(row.rowId)} // Highlight this row
        unhighlightRow={() => setHighlightedRowId(null)} // Unhighlight the row
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
        moveRow={moveRow} // Pass moveRow to Row
        addWebpartToRow={addWebpartToRow} // Pass addWebpartToRow
        selectWebpart={setSelectedWebpartId} // Pass selectWebpart
        selectedWebpartId={selectedWebpartId}
      />
      
      ))}
    </Box>
  );
};

export default LayoutEditor;
