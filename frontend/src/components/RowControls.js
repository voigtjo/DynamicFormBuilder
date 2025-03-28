import React, { useState, useEffect } from 'react';
import { IconButton, Box, Switch, Typography, Slider, Button } from '@mui/material';
import DistributionInput from './DistributionInput';
import FrameSettings from './FrameSettings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import HeightIcon from '@mui/icons-material/Height';

const RowControls = ({
  highlightedRowId,
  moveRow,
  addRow,
  deleteRow,
  setHighlightedRowId,
  updateRow,
  rows = [],
}) => {
  const selectedRow = rows.find((row) => row.rowId === highlightedRowId);
  const [showDistribution, setShowDistribution] = useState(false);
  
  // Show distribution controls only when a row is selected and has multiple webparts in flex mode
  useEffect(() => {
    if (selectedRow && selectedRow.webparts.length > 1 && selectedRow.flexWebpartWidth !== false) {
      setShowDistribution(true);
    } else {
      setShowDistribution(false);
    }
  }, [selectedRow]);

  const handleSwitchChange = (event) => {
    const isManualMode = event.target.checked;

    if (selectedRow) {
      if (isManualMode) {
        const totalWebparts = selectedRow.webparts.length;
        const fixedWidth = Math.floor(12 / totalWebparts);

        const updatedWebparts = selectedRow.webparts.map((webpart) => ({
          ...webpart,
          width: fixedWidth,
        }));

        updateRow({ ...selectedRow, flexWebpartWidth: false, webparts: updatedWebparts });
      } else {
        updateRow({ ...selectedRow, flexWebpartWidth: true });
      }
    }
  };

  const handleHeightChange = (event, newValue) => {
    if (selectedRow) {
      updateRow({ ...selectedRow, height: newValue });
    }
  };


  

  return (
    <Box sx={{ display: 'flex', gap: 0.5, marginBottom: 0.5 }}>
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
      {selectedRow && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 0 }}>
            <Switch
              checked={selectedRow?.flexWebpartWidth === false} // "On" means flexWebpartWidth is false
              onChange={handleSwitchChange}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: 200, marginLeft: 2 }}>
            <HeightIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Slider
              value={selectedRow?.height || 100}
              onChange={handleHeightChange}
              min={30}
              max={500}
              step={5}
              aria-labelledby="row-height-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}px`}
            />
          </Box>
          
          {/* Distribution Input */}
          {showDistribution && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
              <DistributionInput
                rowId={selectedRow.rowId}
                webpartsCount={selectedRow.webparts.length}
                distribution={selectedRow.distribution}
                onDistributionChange={(rowId, distribution, percentages) => {
                  updateRow({
                    ...selectedRow,
                    distribution: distribution,
                    distributionPercentages: percentages
                  });
                }}
              />
            </Box>
          )}
          
          {/* Frame Settings */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            <FrameSettings
              rowId={selectedRow.rowId}
              frame={selectedRow.frame}
              onFrameChange={(rowId, frameSettings) => {
                updateRow({
                  ...selectedRow,
                  frame: frameSettings
                });
              }}
            />
          </Box>
          
          {/* Row Background Color */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Background:</Typography>
            <Box
              sx={{
                width: '20px',
                height: '20px',
                border: '1px solid #ccc',
                backgroundColor: selectedRow?.backgroundColor || 'transparent',
                mr: 1
              }}
            />
            <input
              type="color"
              value={selectedRow?.backgroundColor || '#ffffff'}
              onChange={(e) => {
                updateRow({
                  ...selectedRow,
                  backgroundColor: e.target.value
                });
              }}
              style={{ marginRight: '4px' }}
            />
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => {
                updateRow({
                  ...selectedRow,
                  backgroundColor: ''
                });
              }}
            >
              Clear
            </Button>
          </Box>
          
        </>
      )}
    </Box>
  );
};

export default RowControls;
