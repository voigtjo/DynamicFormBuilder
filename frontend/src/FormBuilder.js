import React, { useState, useEffect } from 'react';
import FormEditor from './components/FormEditor';
import BuilderHeader from './components/BuilderHeader';
import { Box, Select, MenuItem, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchForms, fetchForm, saveForm, deleteForm } from './api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function FormBuilder() {
  const [form, setForm] = useState({ name: '', rows: [] });
  const [formName, setFormName] = useState('');
  const [formList, setFormList] = useState([]);
  const [headerColor, setHeaderColor] = useState('#e0e0e0'); // Default grey
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNewForm, setIsNewForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

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
    
    // Validate that there's at most one business key
    let businessKeyCount = 0;
    let businessKeyName = '';
    
    form.rows.forEach(row => {
      row.webparts.forEach(webpart => {
        if (webpart.control && webpart.control.isBusinessKey) {
          businessKeyCount++;
          businessKeyName = webpart.control.props.label || webpart.control.name;
        }
      });
    });
    
    if (businessKeyCount > 1) {
      alert('There can only be one business key in a form. Please check your form configuration.');
      setHeaderColor('#f8d0d0'); // Red for error
      return;
    }
  
    const newForm = { ...form, name: formName };
  
    try {
      console.log('Saving form:', newForm);
      await saveForm(newForm);
      setHeaderColor('#d0f8ce'); // Green for success
      loadForms(); // Refresh the form list after saving
    } catch (error) {
      console.error('[FormBuilder.js]_Error:', error);
  
      let backendErrorCode = 'UNKNOWN_ERROR';
      let backendErrorMessage = 'Error saving form. Please try again.';
  
      // Extract error details from the error object
      try {
        const errorObj = JSON.parse(error.message); // Convert the stringified JSON back to an object
        backendErrorCode = errorObj.code || backendErrorCode;
        backendErrorMessage = errorObj.message || backendErrorMessage;
      } catch (parseError) {
        console.error('[FormBuilder.js]_Error parsing error response:', parseError);
      }
  
      console.error(`Error Code: ${backendErrorCode}, Message: ${backendErrorMessage}`);
      setHeaderColor('#f8d0d0'); // Red for error
      alert(`Error Code: ${backendErrorCode}\nMessage: ${backendErrorMessage}`);
    }
  };
  

  const handleLoad = async (name) => {
    try {
      const loadedForm = await fetchForm(name);
      
      // Ensure each row has a height property
      if (loadedForm && loadedForm.rows) {
        loadedForm.rows = loadedForm.rows.map(row => ({
          ...row,
          height: row.height || 100 // Default to 100 if height is missing
        }));
      }
      
      setForm(loadedForm);
      setFormName(name);
      setHasUnsavedChanges(false);
      setHeaderColor('#d0f8ce'); // Green for loaded form
      setIsNewForm(false); // Loaded forms are not new
    } catch (error) {
      alert('Failed to load the form. Please try again.');
    }
  };

  const handleCreateNewForm = () => {
    setForm({ 
      _id: null, 
      name: '', 
      rows: [{ rowId: `row-${Date.now()}`, webparts: [], height: 100 }] // Initialize with one row with height
    });
    setFormName('');
    setHasUnsavedChanges(false);
    setHeaderColor('#e0e0e0'); // Reset to grey
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
    setHeaderColor('#e0e0e0'); // Grey for unsaved changes
    setIsNewForm(true); // Enable editing the copied form name
  };

  const handleDeleteForm = async () => {
    if (!form._id) {
      alert('Cannot delete a form that is not saved yet.');
      return;
    }

    setDeleteDialogOpen(true);
  };

  const confirmDeleteForm = async () => {
    try {
      await deleteForm(form._id);
      setDeleteDialogOpen(false);
      handleCreateNewForm(); // Reset the form
      loadForms(); // Refresh the form list
      setHeaderColor('#d0f8ce'); // Green for success
    } catch (error) {
      console.error('Error deleting form:', error);
      setHeaderColor('#f8d0d0'); // Red for error
      alert('Failed to delete the form. Please try again.');
    }
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
    setHeaderColor('#e0e0e0'); // Grey indicates unsaved changes
  };

  const setLayout = (updatedForm) => {
    setForm(updatedForm);
    handleFormChange();
  }

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: 3 }}>
      <BuilderHeader
        title="Dynamic Form Builder"
        headerColor={headerColor} // Pass the dynamic header color
        showActions
        onSave={handleSave}
        onCreateNew={handleCreateNewForm}
        onCopy={handleCopyForm}
        onDelete={form._id ? handleDeleteForm : null}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the form "{formName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteForm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
      <DndProvider backend={HTML5Backend}>
        <FormEditor
          layout={form}
          setLayout={setLayout}
          formId={form._id}
          formName={formName}
          setFormName={setFormName}
        />
      </DndProvider>
    </Box>
  );
}

export default FormBuilder;
