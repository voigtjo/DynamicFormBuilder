import React, { useState, useEffect } from 'react';
import FormEditor from './components/FormEditor';
import { Box, TextField, Select, MenuItem } from '@mui/material';
import { fetchForms, fetchForm, saveForm } from './api';
import Header from './components/BuilderHeader';

function FormBuilder() {
  const [form, setForm] = useState({ name: '', rows: [] });
  const [formName, setFormName] = useState('');
  const [formList, setFormList] = useState([]);
  const [headerColor, setHeaderColor] = useState('#e0e0e0');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNewForm, setIsNewForm] = useState(false); // Default to false


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
      const backendErrorCode = error.response?.data?.code || 'UNKNOWN_ERROR';
      const backendErrorMessage = error.response?.data?.message || 'Error saving form. Please try again.';
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
    setIsNewForm(true); // Enable editing the form name
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
    setHeaderColor('#e0e0e0');
    setIsNewForm(true); // Enable editing the copied form name
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
    setHeaderColor('#e0e0e0');
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: 3 }}>
      <Header
        title="Dynamic Form Builder"
        showActions
        onSave={handleSave}
        onCreateNew={handleCreateNewForm}
        onCopy={handleCopyForm}
      />
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
          <TextField
            label="Save Form As"
            value={formName}
            onChange={(e) => {
              if (isNewForm) {
                setFormName(e.target.value);
                handleFormChange();
              }
            }}
            disabled={!isNewForm} // Disable unless a new form is created or copied
            fullWidth
            size="small"
            sx={{
              backgroundColor: isNewForm ? '#fff' : '#f0f0f0', // White when editable, light grey otherwise
              '.MuiInputBase-root': {
                height: '40px', // Match the height of the Select dropdown
              },
            }}
          />
        </Box>


      </Box>
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

export default FormBuilder;
