const express = require('express');
const router = express.Router();
const Form = require('./models/Form');

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

    // Ensure position fields
    rows.forEach((row) => {
      row.webparts.forEach((webpart) => {
        if (!webpart.position) {
          webpart.position = { row: 0, col: 0 };
        } else {
          if (webpart.position.row === undefined) webpart.position.row = 0;
          if (webpart.position.col === undefined) webpart.position.col = 0;
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

module.exports = router;
