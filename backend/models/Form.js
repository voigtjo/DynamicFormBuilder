const mongoose = require('mongoose');

// Define the Control schema
const ControlSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Type of control, e.g., 'LabelControl', 'TextInputControl'
  props: { type: mongoose.Schema.Types.Mixed, default: {} }, // Additional properties like label, placeholder, etc.
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
  control: { type: ControlSchema, default: null }, // New: Store assigned control
});

// Define the Row schema
const RowSchema = new mongoose.Schema({
  rowId: { type: String, required: true },
  webparts: [WebpartSchema], // Use the Webpart schema here
  flexWebpartWidth: { type: Boolean, default: true }, // Flex or Fix Webpart Width mode
});

// Define the Layout schema
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: [RowSchema], // Use the Row schema here
});

module.exports = mongoose.model('Form', FormSchema);
