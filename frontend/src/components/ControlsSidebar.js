// ControlsSidebar.js
import React from 'react';

const ControlsSidebar = () => {
    return (
        <div className="controls-sidebar">
            <h2>Controls</h2>
            <p>Drag controls from here and drop them on webparts of the form.</p>
            {/* Example controls list */}
            <ul>
                <li draggable>Label</li>
                <li draggable>Image</li>
                <li draggable>Link</li>
                {/* Add more controls */}
            </ul>
        </div>
    );
};

export default ControlsSidebar;