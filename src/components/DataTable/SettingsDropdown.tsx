import React, { useState } from "react";
import { Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function SettingsDropdown() {
  const { isDarkMode, toggleDarkMode, saveSettings } = useTheme();
  const [profileName, setProfileName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const handleSaveProfile = () => {
    if (profileName.trim()) {
      saveSettings(profileName);
      setProfileName("");
      setShowSaveDialog(false);
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="flex items-center px-3 py-1 text-sm rounded bg-opacity-20 hover:bg-opacity-30 transition-colors"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
        onClick={() => setShowSaveDialog(!showSaveDialog)}
      >
        <Settings className="h-4 w-4 mr-1.5" />
        <span className="mr-1">Settings</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>
      
      {showSaveDialog && (
        <div 
          className="absolute right-0 mt-1 p-4 rounded shadow-lg z-50 min-w-[240px]"
          style={{
            backgroundColor: isDarkMode ? '#1f2836' : '#ffffff',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium mb-1">Theme</label>
              <div className="flex items-center">
                <span className="text-xs mr-2">{isDarkMode ? 'Dark' : 'Light'}</span>
                <button
                  onClick={toggleDarkMode}
                  className="w-10 h-5 rounded-full relative"
                  style={{
                    backgroundColor: isDarkMode ? '#8AAAA7' : 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <span 
                    className="absolute w-4 h-4 rounded-full transition-transform"
                    style={{
                      backgroundColor: 'white',
                      transform: isDarkMode ? 'translateX(20px)' : 'translateX(2px)',
                      top: '2px',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Save Current Settings</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Profile name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="flex-1 py-1 px-2 text-sm rounded border"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? 'white' : 'black',
                }}
              />
              <button
                onClick={handleSaveProfile}
                disabled={!profileName.trim()}
                className="ml-2 px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: '#8AAAA7',
                  color: 'white',
                  opacity: profileName.trim() ? 1 : 0.5,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 