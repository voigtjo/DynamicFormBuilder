// Fetch all available layouts
export const fetchLayouts = async () => {
  try {
    const response = await fetch('/api/layouts');
    console.log('FetchLayouts response:', response); // Log response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Layouts received:', data); // Log data
    return data;
  } catch (error) {
    console.error('Error fetching layouts:', error.message); // Log detailed error
    throw error;
  }
};


// Fetch a specific layout by name
export const fetchLayout = async (name) => {
  try {
    const response = await fetch(`/api/layout/${name}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns the layout object
  } catch (error) {
    console.error(`Error fetching layout "${name}":`, error);
    throw error; // Propagate the error to be handled by the caller
  }
};

// Save or update a layout
export const saveLayout = async (layout) => {
  try {
    const response = await fetch('/api/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(layout),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns the save confirmation
  } catch (error) {
    console.error('Error saving layout:', error);
    throw error; // Propagate the error to be handled by the caller
  }
};
