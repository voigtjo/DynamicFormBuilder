const mongoose = require('mongoose');

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
  width: { type: Number, default: 1 }, // New: Width for fixed webpart layout
});

// Define the Row schema
const RowSchema = new mongoose.Schema({
  rowId: { type: String, required: true },
  webparts: [WebpartSchema], // Use the Webpart schema here
  flexWebpartWidth: { type: Boolean, default: true }, // New: Flex or Fix Webpart Width mode
});

// Define the Layout schema
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: [RowSchema], // Use the Row schema here
});

module.exports = mongoose.model('Form', FormSchema);
