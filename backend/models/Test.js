const mongoose = require('mongoose');

// Schema for test data entries
const TestSchema = new mongoose.Schema({
  formName: { 
    type: String, 
    required: true 
  },
  businessKey: { 
    type: String, 
    required: true 
  },
  data: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure businessKey is unique per form
TestSchema.index({ formName: 1, businessKey: 1 }, { unique: true });

module.exports = mongoose.model('Test', TestSchema);
