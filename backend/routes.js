const express = require('express');
const router = express.Router();
const Form = require('./models/Form');
const Test = require('./models/Test');

const ERROR_CODES = {
  FORM_NAME_EXISTS: {
    code: 'FORM_NAME_EXISTS',
    message: 'A form with the same name already exists. Please choose a different name.',
  },
  FORM_NOT_FOUND: {
    code: 'FORM_NOT_FOUND',
    message: 'The form you are trying to update does not exist.',
  },
  FORM_NAME_MISMATCH: {
    code: 'FORM_NAME_MISMATCH',
    message: 'Form name does not match the existing record. Please ensure the form name is correct.',
  },
  FORM_ID_REQUIRED: {
    code: 'FORM_ID_REQUIRED',
    message: 'Form ID is required for updates.',
  },
  FORM_NAME_REQUIRED: {
    code: 'FORM_NAME_REQUIRED',
    message: 'Form name is required.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An error occurred. Please try again.',
  },
};

// Helper function to log and respond with errors
const handleError = (res, errorObj, statusCode = 400) => {
  console.error(`Error Code: ${errorObj.code}, Message: ${errorObj.message}`);
  return res.status(statusCode).json(errorObj);
};

// Save or update a form
router.post('/form', async (req, res) => {
  console.log('POST /form called');
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { _id, name, rows } = req.body;

    if (!name) {
      return handleError(res, ERROR_CODES.FORM_NAME_REQUIRED, 400);
    }

    // Ensure position fields, row height, and control names
    rows.forEach((row) => {
      // Ensure row height is set
      if (row.height === undefined) {
        row.height = 100; // Default height if not specified
      }
      
      row.webparts.forEach((webpart) => {
        // Ensure position is set
        if (!webpart.position) {
          webpart.position = { row: 0, col: 0 };
        } else {
          if (webpart.position.row === undefined) webpart.position.row = 0;
          if (webpart.position.col === undefined) webpart.position.col = 0;
        }
        
        // Ensure control has a name if it exists
        if (webpart.control && !webpart.control.name) {
          // Generate a unique name based on the control type and timestamp
          webpart.control.name = `${webpart.control.type.toLowerCase()}_${Date.now()}`;
        }
      });
    });

    if (!_id) {
      const existingForm = await Form.findOne({ name });
      if (existingForm) {
        return handleError(res, ERROR_CODES.FORM_NAME_EXISTS, 400);
      }

      const form = new Form({ name, rows });
      await form.save();
      return res.json({ message: 'Form saved successfully', form });
    }

    const form = await Form.findById(_id);
    if (!form) {
      return handleError(res, ERROR_CODES.FORM_NOT_FOUND, 404);
    }

    if (form.name !== name) {
      return handleError(res, ERROR_CODES.FORM_NAME_MISMATCH, 400);
    }

    form.rows = rows;
    await form.save();
    res.json({ message: 'Form updated successfully', form });
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Update a form by ID
router.put('/form/:id', async (req, res) => {
  console.log(`PUT /form/${req.params.id} called`);

  try {
    const { name, rows } = req.body;

    if (!name) {
      return handleError(res, ERROR_CODES.FORM_NAME_REQUIRED, 400);
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return handleError(res, ERROR_CODES.FORM_NOT_FOUND, 404);
    }

    if (form.name !== name) {
      return handleError(res, ERROR_CODES.FORM_NAME_MISMATCH, 400);
    }

    form.rows = rows;
    await form.save();
    res.json({ message: 'Form updated successfully', form });
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Fetch a specific form by name
router.get('/form/:name', async (req, res) => {
  console.log(`GET /form/${req.params.name} called`);
  try {
    const form = await Form.findOne({ name: req.params.name });
    if (!form) {
      console.error(`Form not found: ${req.params.name}`);
      return res.status(404).json(ERROR_CODES.FORM_NOT_FOUND);
    }
    console.log('Form fetched successfully:', JSON.stringify(form, null, 2));
    res.json(form);
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Fetch all form names
router.get('/forms', async (req, res) => {
  console.log('GET /forms called');
  try {
    const forms = await Form.find({}, 'name');
    console.log('Forms fetched from database:', JSON.stringify(forms, null, 2));
    res.json(forms);
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Delete a form by ID
router.delete('/form/:id', async (req, res) => {
  console.log(`DELETE /form/${req.params.id} called`);
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      console.error(`Form not found: ${req.params.id}`);
      return res.status(404).json(ERROR_CODES.FORM_NOT_FOUND);
    }
    
    await Form.findByIdAndDelete(req.params.id);
    console.log(`Form deleted successfully: ${req.params.id}`);
    res.json({ message: 'Form deleted successfully', formId: req.params.id });
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Test Data Routes
// Get all test data for a specific form
router.get('/test/:formName', async (req, res) => {
  console.log(`GET /test/${req.params.formName} called`);
  try {
    const testData = await Test.find({ formName: req.params.formName });
    res.json(testData);
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Get a specific test data entry by form name and business key
router.get('/test/:formName/:businessKey', async (req, res) => {
  console.log(`GET /test/${req.params.formName}/${req.params.businessKey} called`);
  try {
    const testData = await Test.findOne({ 
      formName: req.params.formName,
      businessKey: req.params.businessKey
    });
    
    if (!testData) {
      return res.status(404).json({ 
        code: 'TEST_DATA_NOT_FOUND',
        message: 'Test data not found'
      });
    }
    
    res.json(testData);
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Create or update test data
router.post('/test', async (req, res) => {
  console.log('POST /test called');
  try {
    const { formName, businessKey, data } = req.body;
    
    if (!formName || !businessKey) {
      return res.status(400).json({
        code: 'MISSING_REQUIRED_FIELDS',
        message: 'Form name and business key are required'
      });
    }
    
    // Check if the form exists
    const form = await Form.findOne({ name: formName });
    if (!form) {
      return res.status(404).json({
        code: 'FORM_NOT_FOUND',
        message: 'The specified form does not exist'
      });
    }
    
    // Try to find existing test data
    let testData = await Test.findOne({ formName, businessKey });
    
    if (testData) {
      // Update existing test data
      testData.data = data;
      testData.updatedAt = Date.now();
      await testData.save();
      res.json({ message: 'Test data updated successfully', testData });
    } else {
      // Create new test data
      testData = new Test({
        formName,
        businessKey,
        data,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      await testData.save();
      res.json({ message: 'Test data created successfully', testData });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        code: 'DUPLICATE_BUSINESS_KEY',
        message: 'A record with this business key already exists for this form'
      });
    }
    
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

// Delete test data
router.delete('/test/:formName/:businessKey', async (req, res) => {
  console.log(`DELETE /test/${req.params.formName}/${req.params.businessKey} called`);
  try {
    const result = await Test.findOneAndDelete({ 
      formName: req.params.formName,
      businessKey: req.params.businessKey
    });
    
    if (!result) {
      return res.status(404).json({
        code: 'TEST_DATA_NOT_FOUND',
        message: 'Test data not found'
      });
    }
    
    res.json({ message: 'Test data deleted successfully' });
  } catch (error) {
    console.error('Unhandled error:', error);
    return handleError(res, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
  }
});

module.exports = router;
