const mongoose = require('mongoose');

// Define the Control schema
const ControlSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Type of control, e.g., 'LabelControl', 'TextInputControl'
  name: { type: String, required: true }, // Unique name for the control to identify it in the database
  isBusinessKey: { type: Boolean, default: false }, // Flag to mark this control as the business key
  isHeaderColumn: { type: Boolean, default: false }, // Flag to mark this control for table column display
  props: {
    label: { type: String, default: '' }, // Label for the control
    placeholder: { type: String, default: '' }, // Placeholder text for input fields
    format: { type: String, enum: ['comma', 'dot', 'german', 'us', 'british'], default: 'dot' }, // Format for specific controls
    currency: { type: String, enum: ['EUR', 'USD', 'GBP'], default: 'USD' }, // Currency type for CurrencyInputField
    options: [
      {
        value: { type: String, required: true }, // Dropdown option value
        color: { type: String, default: null }, // Optional color for the dropdown option
      },
    ],
    markdownContent: { type: String, default: '' }, // Add markdownContent explicitly
  },
});


// Define the Webpart schema
const WebpartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true, default: 'text' },
  position: {
    row: { type: String, required: true }, // Use String for row ID
    col: { type: Number, required: true }, // Numeric column position
  },
  label: { type: String },
  elements: { type: Array, default: [] },
  width: { type: Number, default: 1 }, // Width for fixed webpart layout
  control: { type: ControlSchema, default: null }, // Store assigned control and its configuration
});

// Define the Row schema
const RowSchema = new mongoose.Schema({
  rowId: { type: String, required: true },
  webparts: [WebpartSchema], // Use the Webpart schema here
  flexWebpartWidth: { type: Boolean, default: true }, // Flex or Fix Webpart Width mode
  height: { type: Number, default: 100 }, // Default height for rows
});

// Define the Layout schema
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: [RowSchema], // Use the Row schema here
});

module.exports = mongoose.model('Form', FormSchema);
