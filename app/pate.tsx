import React, { useEffect } from 'react';

const resetPolicySettings = () => {
    updatePolicySettings(defaultPolicySettings);
    setActivePresetKey("");
    triggerToastDisplay("Policies reset to default values.");
};

useEffect(() => {
    // ... existing code ...
}, []); 