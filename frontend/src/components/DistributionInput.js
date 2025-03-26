import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Tooltip, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const DistributionInput = ({ rowId, webpartsCount, distribution, onDistributionChange }) => {
  const [inputValue, setInputValue] = useState('');
  
  // Initialize the input value based on the current distribution or default
  useEffect(() => {
    if (distribution) {
      setInputValue(distribution);
    } else {
      // Default to equal distribution (e.g., ":" for 2 webparts, "::" for 3 webparts)
      setInputValue(':'.repeat(webpartsCount - 1));
    }
  }, [distribution, webpartsCount]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const applyDistribution = () => {
    // Validate the input
    const colonCount = (inputValue.match(/:/g) || []).length;
    
    if (colonCount !== webpartsCount - 1) {
      // Reset to default if invalid
      setInputValue(':'.repeat(webpartsCount - 1));
      onDistributionChange(rowId, ':'.repeat(webpartsCount - 1));
      return;
    }
    
    // Parse the distribution (e.g., "2:1" -> [2, 1])
    const parts = inputValue.split(':').map(part => {
      const num = parseInt(part || '1', 10);
      return isNaN(num) ? 1 : num;
    });
    
    // Calculate the total sum of parts
    const sum = parts.reduce((acc, val) => acc + val, 0);
    
    // Calculate the percentage for each part
    const percentages = parts.map(part => (part / sum) * 100);
    
    // Update the distribution
    onDistributionChange(rowId, inputValue, percentages);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyDistribution();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={`Enter distribution ratios (e.g., ${webpartsCount === 2 ? '2:1' : '2:1:1'} for uneven distribution)`}>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          Distribution:
        </Typography>
      </Tooltip>
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        size="small"
        sx={{ width: '80px' }}
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <IconButton 
        size="small" 
        onClick={applyDistribution}
        color="primary"
        sx={{ padding: '2px' }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default DistributionInput;
