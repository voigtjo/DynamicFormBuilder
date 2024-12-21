import React, { useState, useEffect } from 'react';
import LayoutEditor from './components/LayoutEditor'; // Your layout editing component
import { Box, Button, TextField, Select, MenuItem, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import './App.css';
import { fetchLayouts, fetchLayout, saveLayout } from './api'; // Import API functions

function App() {
  const [layout, setLayout] = useState({ name: '', rows: [] });
  const [layoutName, setLayoutName] = useState('');
  const [layoutList, setLayoutList] = useState([]);

  // Load layouts from the backend on component mount
  useEffect(() => {
    console.log('Loading available layouts...');
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const layouts = await fetchLayouts(); // Fetch available layouts
      setLayoutList(layouts || []);
      console.log('Available layouts:', layouts);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      alert('Failed to fetch layouts. Please check the backend connection.');
    }
  };

  const handleSave = async () => {
    if (!layoutName) {
      alert('Please provide a name for the layout');
      return;
    }

    const newLayout = { ...layout, name: layoutName };

    try {
      console.log('Saving layout:', newLayout);
      await saveLayout(newLayout);
      alert('Layout saved successfully!');
      loadLayouts(); // Refresh the layout list after saving
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save the layout. Please try again.');
    }
  };

  const handleLoad = async (name) => {
    try {
      const loadedLayout = await fetchLayout(name);
      setLayout(loadedLayout);
      setLayoutName(name);
      console.log('Loaded layout:', loadedLayout);
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('Failed to load the layout. Please try again.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: 3 }}>
      {/* Combined Header Section */}
      <Box
        sx={{
          backgroundColor: '#e0e0e0',
          padding: 2,
          borderRadius: 2,
          marginBottom: 2,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Dynamic Form Builder
        </Typography>

        {/* Inline Layout Selection and Save As Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Select Layout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', color: '#000' }}>
              Select Layout:
            </Typography>
            <Select
              value={layout.name || ''}
              onChange={(e) => handleLoad(e.target.value)}
              displayEmpty
              size="small"
              fullWidth
              sx={{
                backgroundColor: '#fff',
                '& .MuiSelect-root': {
                  backgroundColor: '#fff',
                },
              }}
            >
              <MenuItem value="" disabled>
                {layoutList.length === 0
                  ? 'No layouts available'
                  : 'Select a layout to load'}
              </MenuItem>
              {layoutList.map((layout) => (
                <MenuItem key={layout.name} value={layout.name}>
                  {layout.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Save Layout As */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', color: '#000' }}>
              Save Layout As:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                },
                flex: 1,
              }}
            />
          </Box>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{ flexShrink: 0 }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Layout Editor */}
      <LayoutEditor layout={layout} setLayout={setLayout} />
    </Box>
  );
}

export default App;
