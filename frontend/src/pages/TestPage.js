import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from './PageHeader';
import { fetchForm, fetchTestData, fetchTestDataEntry, saveTestData } from '../api';
import TestFormRenderer from '../components/TestFormRenderer';

const TestPage = () => {
  const { formName, businessKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [testData, setTestData] = useState([]);
  const [currentTestData, setCurrentTestData] = useState(null);
  const [newBusinessKey, setNewBusinessKey] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Determine the current view based on the URL
  const isListView = location.pathname.includes('/list');
  const isEditView = location.pathname.includes('/edit');
  const isMainView = !isListView && !isEditView;
  
  // Load forms for the main test page
  useEffect(() => {
    if (isMainView) {
      const loadForms = async () => {
        try {
          const response = await fetch('/api/forms');
          if (!response.ok) {
            throw new Error('Failed to fetch forms');
          }
          const data = await response.json();
          setTestData(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      loadForms();
    }
  }, [isMainView]);
  
  // Load form and test data for list view
  useEffect(() => {
    if (isListView && formName) {
      const loadFormAndTestData = async () => {
        setLoading(true);
        try {
          // Load the form definition
          const formData = await fetchForm(formName);
          setForm(formData);
          
          // Load all test data for this form
          const testData = await fetchTestData(formName);
          setTestData(testData);
          
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      loadFormAndTestData();
    }
  }, [isListView, formName]);
  
  // Load form and specific test data for edit view
  useEffect(() => {
    if (isEditView && formName && businessKey) {
      const loadFormAndTestDataEntry = async () => {
        setLoading(true);
        try {
          // Load the form definition
          const formData = await fetchForm(formName);
          setForm(formData);
          
          try {
            // Try to load existing test data
            const testDataEntry = await fetchTestDataEntry(formName, businessKey);
            setCurrentTestData(testDataEntry);
            setFormData(testDataEntry.data || {});
          } catch (err) {
            // If not found, we're creating a new entry
            setCurrentTestData({ formName, businessKey, data: {} });
            setFormData({});
          }
          
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      loadFormAndTestDataEntry();
    }
  }, [isEditView, formName, businessKey]);
  
  // Handle opening the new test data dialog
  const handleOpenDialog = () => {
    setNewBusinessKey('');
    setDialogOpen(true);
  };
  
  // Handle creating a new test data entry
  const handleCreateTestData = () => {
    if (!newBusinessKey.trim()) {
      alert('Please enter a business key');
      return;
    }
    
    setDialogOpen(false);
    navigate(`/test/form/${formName}/businessKey/${newBusinessKey}/edit`);
  };
  
  // Handle saving form data
  const handleSaveFormData = async () => {
    try {
      await saveTestData({
        formName,
        businessKey,
        data: formData
      });
      
      navigate(`/test/form/${formName}/list`);
    } catch (err) {
      alert(`Error saving data: ${err.message}`);
    }
  };
  
  // Handle form data changes
  const handleFormDataChange = (controlName, value) => {
    setFormData(prev => ({
      ...prev,
      [controlName]: value
    }));
  };
  
  // Extract business key and header columns from form
  const getBusinessKeyAndHeaderColumns = () => {
    if (!form || !form.rows) return { businessKeyControl: null, headerColumns: [] };
    
    let businessKeyControl = null;
    const headerColumns = [];
    
    form.rows.forEach(row => {
      row.webparts.forEach(webpart => {
        if (webpart.control) {
          if (webpart.control.isBusinessKey) {
            businessKeyControl = webpart.control;
          }
          if (webpart.control.isHeaderColumn) {
            headerColumns.push(webpart.control);
          }
        }
      });
    });
    
    return { businessKeyControl, headerColumns };
  };
  
  // Render the main test page (form selection)
  const renderMainView = () => (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Select a Form to Test
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Form Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testData.map((form) => (
                <TableRow key={form._id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(`/test/form/${form.name}/list`)}
                    >
                      Test
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
  
  // Render the list view (test data entries)
  const renderListView = () => {
    const { businessKeyControl, headerColumns } = getBusinessKeyAndHeaderColumns();
    
    return (
      <Box sx={{ padding: 2 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            component="button" 
            variant="body1" 
            onClick={() => navigate('/test')}
            underline="hover"
          >
            Test
          </Link>
          <Typography color="text.primary">{formName}</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Test Data for Form: {formName}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Test Data
          </Button>
        </Box>
        
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Key</TableCell>
                  {headerColumns.map(column => (
                    <TableCell key={column.name}>{column.props.label}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headerColumns.length + 2} align="center">
                      No test data available. Create a new entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  testData.map((entry) => (
                    <TableRow key={entry.businessKey}>
                      <TableCell>{entry.businessKey}</TableCell>
                      {headerColumns.map(column => (
                        <TableCell key={column.name}>
                          {entry.data[column.name] || ''}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => navigate(`/test/form/${formName}/businessKey/${entry.businessKey}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Dialog for creating new test data */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Create New Test Data</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a unique business key for this test data entry.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Business Key"
              fullWidth
              value={newBusinessKey}
              onChange={(e) => setNewBusinessKey(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTestData} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  // Render the edit view (form for editing test data)
  const renderEditView = () => (
    <Box sx={{ padding: 2 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button" 
          variant="body1" 
          onClick={() => navigate('/test')}
          underline="hover"
        >
          Test
        </Link>
        <Link 
          component="button" 
          variant="body1" 
          onClick={() => navigate(`/test/form/${formName}/list`)}
          underline="hover"
        >
          {formName}
        </Link>
        <Typography color="text.primary">{businessKey}</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          {businessKey} - Edit Test Data
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => navigate(`/test/form/${formName}/list`)}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveFormData}
          >
            Save
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TestFormRenderer 
          form={form} 
          formData={formData} 
          onFormDataChange={handleFormDataChange} 
        />
      )}
    </Box>
  );
  
  return (
    <Box>
      <PageHeader />
      {isMainView && renderMainView()}
      {isListView && renderListView()}
      {isEditView && renderEditView()}
    </Box>
  );
};

export default TestPage;
