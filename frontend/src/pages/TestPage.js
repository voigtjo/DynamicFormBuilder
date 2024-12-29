import React from 'react';
import PageHeader from './PageHeader';
import { Box, Typography } from '@mui/material';

const TestPage = () => (
  <Box>
    <PageHeader />
    <Box sx={{ padding: 2 }}>
      <Typography variant="body1">
        This is the placeholder content for the Test Page.
      </Typography>
    </Box>
  </Box>
);

export default TestPage;
