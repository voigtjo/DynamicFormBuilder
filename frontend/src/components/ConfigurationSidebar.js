import React from 'react';

const ConfigurationSidebar = ({ selectedControl }) => {
    if (!selectedControl || !selectedControl.parameters) {
        return (
            <div className="configuration-sidebar">
                <h2>Configuration</h2>
                <p>Select a control to configure its parameters.</p>
            </div>
        );
    }

    return (
        <div className="configuration-sidebar">
            <h2>Configuration</h2>
            <p>Configure selected Control.</p>
            <form>
                {Object.entries(selectedControl.parameters).map(([key, value]) => (
                    <div key={key}>
                        <label>{key}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => selectedControl.updateParameter(key, e.target.value)}
                        />
                    </div>
                ))}
            </form>
        </div>
    );
};

export default ConfigurationSidebar;
