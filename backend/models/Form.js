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
    imageData: { type: String, default: '' }, // Base64 encoded image data
    imageType: { type: String, default: '' }, // MIME type of the image
    imageSize: { type: Number, default: 0 }, // Size of the image in bytes
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
  control: { type: ControlSchema, default: null }, // Store assigned control and its configuration (legacy support)
  controls: [ControlSchema], // Array of controls for stacked layout
  isStacked: { type: Boolean, default: false }, // Flag to indicate if controls are stacked
  verticalAlign: { type: String, enum: ['top', 'center', 'bottom'], default: 'center' }, // Vertical alignment of webpart content
  horizontalAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' }, // Horizontal alignment of webpart content
});

// Define the Row schema
const RowSchema = new mongoose.Schema({
  rowId: { type: String, required: true },
  webparts: [WebpartSchema], // Use the Webpart schema here
  flexWebpartWidth: { type: Boolean, default: true }, // Flex or Fix Webpart Width mode
  height: { type: Number, default: 100 }, // Default height for rows
  verticalSpacing: { type: Number, default: 1 }, // Vertical spacing between controls (0-3)
  isCompact: { type: Boolean, default: false }, // Compact mode for reduced padding
  distribution: { type: String, default: '' }, // Distribution string (e.g., "2:1")
  distributionPercentages: [{ type: Number }], // Calculated percentages for each webpart
  frame: {
    enabled: { type: Boolean, default: false },
    style: { type: String, enum: ['solid', 'dotted'], default: 'solid' },
    thickness: { type: String, enum: ['thin', 'thick'], default: 'thin' }
  }
});

// Define the Layout schema
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: [RowSchema], // Use the Row schema here
});

module.exports = mongoose.model('Form', FormSchema);
