// Fetch all available forms
export const fetchForms = async () => {
  try {
    const response = await fetch('/api/forms');
    console.log('FetchForms response:', response); // Log response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Forms received:', data); // Log data
    return data;
  } catch (error) {
    console.error('Error fetching forms:', error.message); // Log detailed error
    throw error;
  }
};

// Fetch a specific form by name
export const fetchForm = async (name) => {
  try {
    const response = await fetch(`/api/form/${name}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns the form object
  } catch (error) {
    console.error(`Error fetching form "${name}":`, error);
    throw error; // Propagate the error to be handled by the caller
  }
};

// Save or update a form
export const saveForm = async (form) => {
  try {
    const response = await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      const errorDetails = await response.json(); // Parse backend error response
      throw new Error(JSON.stringify(errorDetails));
    }
    return await response.json(); // Returns the save confirmation
  } catch (error) {
    console.error('[api.js]_Error saving form:', error);
    throw error; // Propagate the error to be handled by the caller
  }
};
