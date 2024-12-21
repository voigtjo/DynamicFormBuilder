const mongoose = require('mongoose');

const WebpartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  position: {
    row: { type: Number, required: true, default: 0 }, // Default row
    col: { type: Number, required: true, default: 0 }, // Default col
  },
  label: { type: String, default: '' },
  elements: { type: Array, default: [] },
});


const RowSchema = new mongoose.Schema({
  rowId: { type: String, required: true },
  webparts: [WebpartSchema], // Use the updated Webpart schema
});

const LayoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: [RowSchema], // Use the updated Row schema
});

module.exports = mongoose.model('Layout', LayoutSchema);
