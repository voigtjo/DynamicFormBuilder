  import React, { useState, useEffect } from 'react';
  import Row from './Row';
  import ControlsSidebar from './ControlsSidebar';
  import ConfigurationSidebar from './ConfigurationSidebar';
  import RowControls from './RowControls';
  import WebpartControls from './WebpartControls';
  import { Box } from '@mui/material';

  const FormEditor = ({ layout, setLayout, formId, formName, setFormName }) => {
    const [selectedWebpartId, setSelectedWebpartId] = useState(null);
    const [highlightedRowId, setHighlightedRowId] = useState(null);

    useEffect(() => {
      if (layout.rows.length === 0) {
        const initialRow = { rowId: `row-${Date.now()}`, webparts: [] };
        setLayout({ ...layout, rows: [initialRow] });
      }
    }, [layout, setLayout]);

    const assignControlToWebpart = (control) => {
      if (!selectedWebpartId) return;
    
      setLayout((prevLayout) => {
        const updatedRows = prevLayout.rows.map((row) => ({
          ...row,
          webparts: row.webparts.map((webpart) =>
            webpart.id === selectedWebpartId
              ? { ...webpart, control }
              : webpart
          ),
        }));
        return { ...prevLayout, rows: updatedRows };
      });
    };
    

    const handleRowSelection = (rowId) => {
      if (selectedWebpartId) {
        setSelectedWebpartId(null); // Deselect webpart if a row is selected
      }
      setHighlightedRowId(rowId);
    };

    const handleWebpartSelection = (webpartId) => {
      if (highlightedRowId) {
        setHighlightedRowId(null); // Deselect row if a webpart is selected
      }
      setSelectedWebpartId(webpartId);
    };

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

    const toggleFlexSwitch = (rowId, isFlexMode) => {
      const selectedRow = layout.rows.find((row) => row.rowId === rowId);
      if (!selectedRow) return;
    
      if (!isFlexMode) {
        const totalWebparts = selectedRow.webparts.length;
        const fixedWidth = Math.floor(12 / totalWebparts);
    
        const updatedWebparts = selectedRow.webparts.map((webpart) => ({
          ...webpart,
          width: fixedWidth,
        }));
    
        const updatedRow = {
          ...selectedRow,
          flexWebpartWidth: false,
          webparts: updatedWebparts,
        };
    
        updateRow(updatedRow);
      } else {
        const updatedRow = {
          ...selectedRow,
          flexWebpartWidth: true,
        };
    
        updateRow(updatedRow);
      }
    };

    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Left Sidebar */}
        <Box sx={{ width: '16.66%', backgroundColor: '#f5f5f5', borderRight: '1px solid #ccc', padding: 2 }}>
          <ControlsSidebar assignControl={(control) => assignControlToWebpart(control)} />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <RowControls
              highlightedRowId={highlightedRowId}
              moveRow={moveRow}
              addRow={addRow}
              deleteRow={deleteRow}
              setHighlightedRowId={setHighlightedRowId}
              updateRow={updateRow} // Pass updateRow here
              rows={layout.rows}
            />

            <WebpartControls
              selectedWebpartId={selectedWebpartId}
              moveWebpart={moveWebpart}
              deleteSelectedWebpart={deleteSelectedWebpart}
              setSelectedWebpartId={setSelectedWebpartId}
              addWebpartToRow={(rowId) => {
                const updatedRows = layout.rows.map((row) =>
                  row.rowId === rowId
                    ? {
                        ...row,
                        webparts: [
                          ...row.webparts,
                          { id: `webpart-${Date.now()}`, control: null },
                        ],
                      }
                    : row
                );
                setLayout({ ...layout, rows: updatedRows });
              }}
              updateWebpartWidth={(webpartId, newWidth) => {
                const updatedRows = layout.rows.map((row) => ({
                  ...row,
                  webparts: row.webparts.map((webpart) =>
                    webpart.id === webpartId ? { ...webpart, width: newWidth } : webpart
                  ),
                }));
                setLayout({ ...layout, rows: updatedRows });
              }}
              highlightedRowId={highlightedRowId}
              layout={layout}
              setLayout={setLayout} // Pass setLayout here
            />

          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {layout.rows.map((row) => (
              <Row
                key={row.rowId}
                row={row}
                setLayout={setLayout} // Pass setLayout as a prop
                isHighlighted={highlightedRowId === row.rowId}
                highlightRow={() => handleRowSelection(row.rowId)}
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
                        style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                      },
                    ],
                  })
                }
                selectWebpart={handleWebpartSelection}
                selectedWebpartId={selectedWebpartId}
              />
            ))}
          </Box>
        </Box>

        {/* Right Sidebar */}
        <Box sx={{ width: '16.66%', backgroundColor: '#f5f5f5', borderLeft: '1px solid #ccc', padding: 2 }}>
          <ConfigurationSidebar
            selectedWebpart={layout.rows
              .flatMap((row) => row.webparts)
              .find((webpart) => webpart.id === selectedWebpartId)}
            updateWebpart={(updatedWebpart) => {
              const updatedRows = layout.rows.map((row) => ({
                ...row,
                webparts: row.webparts.map((webpart) =>
                  webpart.id === updatedWebpart.id
                    ? { ...updatedWebpart, style: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }
                    : webpart
                ),
              }));
              setLayout({ ...layout, rows: updatedRows });
            }}
          />
        </Box>
      </Box>
    );
  };

  export default FormEditor;
