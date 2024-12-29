import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PageHeader = () => {
  const location = useLocation();

  // Define the color schema for each page
  const navigationColors = {
    test: '#f44336', // Red for Test
    build: '#ff9800', // Orange for Build
    prod: '#4caf50', // Green for Prod
  };

  // Determine the current page color based on the route
  const currentPage =
    location.pathname === '/test'
      ? 'test'
      : location.pathname === '/build'
      ? 'build'
      : location.pathname === '/prod'
      ? 'prod'
      : 'test'; // Default to Test if unknown route

  const pageColor = navigationColors[currentPage];

  return (
    <Box
      sx={{
        backgroundColor: '#e0e0e0',
        padding: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
        border: `3px solid ${pageColor}`, // Border color matches the page
      }}
    >
      {/* Navigation Buttons (Left-Aligned) */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          component="a"
          href="/test"
          variant="outlined"
          target="_self"
          rel="noopener noreferrer"
          sx={{
            color: navigationColors.test,
            borderColor: navigationColors.test,
            fontWeight: location.pathname === '/test' ? 'bold' : 'normal',
          }}
        >
          Test
        </Button>
        <Button
          component="a"
          href="/build"
          variant="outlined"
          target="_self"
          rel="noopener noreferrer"
          sx={{
            color: navigationColors.build,
            borderColor: navigationColors.build,
            fontWeight: location.pathname === '/build' ? 'bold' : 'normal',
          }}
        >
          Build
        </Button>
        <Button
          component="a"
          href="/prod"
          variant="outlined"
          target="_self"
          rel="noopener noreferrer"
          sx={{
            color: navigationColors.prod,
            borderColor: navigationColors.prod,
            fontWeight: location.pathname === '/prod' ? 'bold' : 'normal',
          }}
        >
          Prod
        </Button>
      </Box>

      {/* Centered Header Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: pageColor, // Text color matches the page color
          flex: 1, // Ensure it takes space to center properly
        }}
      >
        {`Form App - ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}`}
      </Typography>

      {/* Empty Box to balance layout */}
      <Box sx={{ width: '160px' }}></Box>
    </Box>
  );
};

export default PageHeader;
