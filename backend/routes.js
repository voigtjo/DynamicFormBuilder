const express = require('express');
const router = express.Router();
const Layout = require('./models/Layout');

// Save or update a layout
router.post('/layout', async (req, res) => {
  console.log('POST /layout called');
  console.log('Request body:', JSON.stringify(req.body, null, 2)); // Log incoming data

  try {
    const { name, rows } = req.body;

    if (!name) {
      console.error('Layout name is missing');
      return res.status(400).json({ message: 'Layout name is required' });
    }

    // Validate and ensure position fields
    rows.forEach((row) => {
      row.webparts.forEach((webpart) => {
        if (!webpart.position) {
          webpart.position = { row: 0, col: 0 }; // Provide default position
        } else {
          if (webpart.position.row === undefined) webpart.position.row = 0;
          if (webpart.position.col === undefined) webpart.position.col = 0;
        }
      });
    });

    let layout = await Layout.findOne({ name });
    if (layout) {
      console.log(`Updating existing layout: ${name}`);
      layout.rows = rows;
      await layout.save();
      console.log('Layout updated successfully');
      return res.json({ message: 'Layout updated successfully', layout });
    }

    console.log(`Creating new layout: ${name}`);
    layout = new Layout({ name, rows });
    await layout.save();
    console.log('Layout saved successfully');
    res.json({ message: 'Layout saved successfully', layout });
  } catch (error) {
    console.error('Error saving layout:', error);
    res.status(500).json({ message: 'Error saving layout', error });
  }
});



// Fetch a specific layout by name
router.get('/layout/:name', async (req, res) => {
  console.log(`GET /layout/${req.params.name} called`); // Log when the endpoint is hit
  try {
    const layout = await Layout.findOne({ name: req.params.name });
    if (!layout) {
      console.error(`Layout not found: ${req.params.name}`);
      return res.status(404).json({ message: 'Layout not found' });
    }
    console.log('Layout fetched successfully:', JSON.stringify(layout, null, 2)); // Log the fetched layout
    res.json(layout);
  } catch (error) {
    console.error('Error fetching layout:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching layout', error });
  }
});

// Update a layout by ID
router.put('/layout/:id', async (req, res) => {
  console.log(`PUT /layout/${req.params.id} called`); // Log when the endpoint is hit
  try {
    const layout = await Layout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!layout) {
      console.error(`Layout not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Layout not found' });
    }
    console.log('Layout updated successfully:', JSON.stringify(layout, null, 2)); // Log the updated layout
    res.json(layout);
  } catch (error) {
    console.error('Error updating layout:', error); // Log any errors
    res.status(500).json({ message: 'Error updating layout', error });
  }
});

// Delete a layout by ID
router.delete('/layout/:id', async (req, res) => {
  console.log(`DELETE /layout/${req.params.id} called`); // Log when the endpoint is hit
  try {
    const layout = await Layout.findByIdAndDelete(req.params.id);
    if (!layout) {
      console.error(`Layout not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Layout not found' });
    }
    console.log(`Layout deleted successfully: ${req.params.id}`);
    res.json({ message: 'Layout deleted successfully' });
  } catch (error) {
    console.error('Error deleting layout:', error); // Log any errors
    res.status(500).json({ message: 'Error deleting layout', error });
  }
});

// Fetch all layout names
router.get('/layouts', async (req, res) => {
  console.log('GET /layouts called'); // Log when the endpoint is hit
  try {
    const layouts = await Layout.find({}, 'name'); // Fetch only the names of the layouts
    console.log('Layouts fetched from database:', JSON.stringify(layouts, null, 2)); // Log the fetched layouts
    res.json(layouts); // Send the layouts as JSON
  } catch (error) {
    console.error('Error fetching layouts:', error); // Log any errors
    res.status(500).json({ message: 'Error fetching layouts', error });
  }
});

module.exports = router;
