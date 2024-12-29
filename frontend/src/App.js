import React, { useState, useEffect } from 'react';
import FormEditor from './components/FormEditor';
import { Box, IconButton, TextField, Select, MenuItem, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './App.css';
import { fetchForms, fetchForm, saveForm } from './api';

function App() {
  const [form, setForm] = useState({ name: '', rows: [] });
  const [formName, setFormName] = useState('');
  const [formList, setFormList] = useState([]);
  const [headerColor, setHeaderColor] = useState('#e0e0e0');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNewForm, setIsNewForm] = useState(true); // Tracks if the form is new or copied

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    setHeaderColor(hasUnsavedChanges ? '#e0e0e0' : '#d0f8ce');
  }, [hasUnsavedChanges]);

  const loadForms = async () => {
    try {
      const forms = await fetchForms();
      setFormList(forms || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      alert('Failed to fetch forms. Please check the backend connection.');
    }
  };

  const handleSave = async () => {
    if (!formName) {
      alert('Please provide a name for the form');
      return;
    }
  
    const newForm = { ...form, name: formName };
  
    try {
      console.log('Saving form:', newForm);
      await saveForm(newForm);
      setHeaderColor('#d0f8ce'); // Green for success
      loadForms(); // Refresh the form list after saving
    } catch (error) {
      console.error(error);
  
      let backendErrorCode = 'UNKNOWN_ERROR';
      let backendErrorMessage = 'Error saving form. Please try again.';
  
      // Parse the error message if it's a JSON string
      try {
        const errorObj = JSON.parse(error.message); // Convert the stringified JSON back to an object
        backendErrorCode = errorObj.code || backendErrorCode;
        backendErrorMessage = errorObj.message || backendErrorMessage;
      } catch (parseError) {
        console.error('Error parsing backend error response:', parseError);
      }
  
      console.error(`Error Code: ${backendErrorCode}, Message: ${backendErrorMessage}`);
      setHeaderColor('#f8d0d0'); // Red for error
      alert(`Error Code: ${backendErrorCode}\nMessage: ${backendErrorMessage}`);
    }
  };
  

  const handleLoad = async (name) => {
    try {
      const loadedForm = await fetchForm(name);
      setForm(loadedForm);
      setFormName(name);
      setHasUnsavedChanges(false);
      setHeaderColor('#d0f8ce');
      setIsNewForm(false); // Loaded forms are not new
    } catch (error) {
      alert('Failed to load the form. Please try again.');
    }
  };

  const handleCreateNewForm = () => {
    setForm({ _id: null, name: '', rows: [] });
    setFormName('');
    setHasUnsavedChanges(false);
    setHeaderColor('#e0e0e0');
    setIsNewForm(true); // New form is treated as new
  };

  const handleCopyForm = () => {
    if (!form._id) {
      alert('Cannot copy a form that is not saved yet.');
      return;
    }

    const copiedForm = { ...form, _id: null, name: `${form.name}_copy` };
    setForm(copiedForm);
    setFormName(`${formName}_copy`);
    setHasUnsavedChanges(true);
    setHeaderColor('#e0e0e0'); // Grey background for unsaved state
    setIsNewForm(true); // Copied form is treated as new
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
    setHeaderColor('#e0e0e0');
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: headerColor,
          padding: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">Dynamic Form Builder</Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Save Button */}
          <IconButton color="primary" onClick={handleSave}>
            <SaveIcon />
          </IconButton>

          {/* New Form Button */}
          <IconButton color="secondary" onClick={handleCreateNewForm}>
            <AddCircleOutlineIcon />
          </IconButton>

          {/* Copy Form Button */}
          <IconButton color="info" onClick={handleCopyForm}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Inline Form Selection and Save As Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          marginBottom: 2,
        }}
      >
        {/* Select Form */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', color: '#000' }}>
            Select Form:
          </Typography>
          <Select
            value={form.name || ''}
            onChange={(e) => handleLoad(e.target.value)}
            displayEmpty
            size="small"
            fullWidth
            sx={{ backgroundColor: '#fff' }}
          >
            <MenuItem value="" disabled>
              {formList.length === 0 ? 'No forms available' : 'Select a form to load'}
            </MenuItem>
            {formList.map((form) => (
              <MenuItem key={form.name} value={form.name}>
                {form.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Save Form As */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', color: '#000' }}>
            Save Form As:
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              handleFormChange();
            }}
            disabled={!isNewForm} // Disable field if the form is not new
            sx={{
              backgroundColor: isNewForm ? '#fff' : '#f0f0f0',
              flex: 1,
            }}
          />
        </Box>
      </Box>

      {/* Form Editor */}
      <FormEditor
        layout={form}
        setLayout={(updatedForm) => {
          setForm(updatedForm);
          handleFormChange();
        }}
        formId={form._id}
        formName={formName}
        setFormName={setFormName}
      />
    </Box>
  );
}

export default App;
