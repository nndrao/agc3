import React, { useState, useEffect, useRef } from 'react';
import { Save, ChevronDown, Bookmark, Trash2, Check, Search, GripVertical, X, AlertCircle, FileEdit, FilePlus } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';

interface SettingsMenuProps {
  className?: string;
}

export function SettingsMenu({ className }: SettingsMenuProps) {
  const { 
    saveSettings,
    loadSettings,
    updateSettings,
    deleteSettings,
    savedSettings,
    isDarkMode,
    accentColor
  } = useTheme();
  
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewView, setIsNewView] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create a new preset
  const handleSavePreset = () => {
    const trimmedName = presetName.trim();
    if (!trimmedName) {
      setSaveError("Please enter a name for your view");
      return;
    }

    // Only check for duplicates when creating a new view
    if (isNewView) {
      // Check for duplicates
      const duplicateName = savedSettings.find(s => 
        s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (duplicateName) {
        setSaveError(`A view named "${trimmedName}" already exists`);
        return;
      }
    }

    // Proceed with saving
    try {
      setIsSaving(true);
      
      if (isNewView) {
        // Save as new view
        saveSettings(trimmedName);
      } else {
        // Update existing view
        if (currentPreset) {
          updateSettings(currentPreset);
        }
      }
      
      // Reset form and close modal
      setPresetName('');
      setSaveError(null);
      setShowSaveInput(false);
      
      // Trigger grid update notification
      const event = new CustomEvent(isNewView ? 'preset-loaded' : 'preset-updated');
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error saving view:", error);
      setSaveError("Failed to save view. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle opening save modal safely
  const openSaveModal = (newView = true) => {
    setShowSettingsDropdown(false);
    setIsNewView(newView);
    
    // If updating existing view, set the name field to the current view name
    if (!newView && currentPreset) {
      const preset = savedSettings.find(s => s.id === currentPreset);
      setPresetName(preset?.name || '');
    } else {
      setPresetName('');
    }
    
    setSaveError(null);
    
    // Use a slightly longer timeout to ensure dropdown is fully closed
    setTimeout(() => {
      setShowSaveInput(true);
      // Focus the input after modal is visible
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 150);
  };

  // Load a preset
  const handleLoadPreset = (presetId: string) => {
    try {
      loadSettings(presetId);
      setCurrentPreset(presetId);
      setShowSettingsDropdown(false);
    } catch (error) {
      console.error("Error loading view:", error);
      // Could add a toast notification here
    }
  };

  // Update current preset
  const handleUpdateCurrentPreset = () => {
    if (currentPreset) {
      try {
        updateSettings(currentPreset);
        
        // Visual feedback
        const button = document.getElementById('update-view-button');
        if (button) {
          const originalText = button.innerText;
          button.innerHTML = '<span class="flex items-center"><Check class="h-3 w-3 mr-1.5" />Updated</span>';
          
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 1500);
        }
        
        // Trigger grid update notification
        const event = new CustomEvent('preset-updated');
        document.dispatchEvent(event);
      } catch (error) {
        console.error("Error updating view:", error);
        // Could add a toast notification here
      }
    }
  };

  // Delete a preset
  const handleDeletePreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deleteConfirmId === presetId) {
      try {
        // Confirm delete
        deleteSettings(presetId);
        setDeleteConfirmId(null);
        
        // If we're deleting the current preset, clear it
        if (currentPreset === presetId) {
          setCurrentPreset(null);
        }
      } catch (error) {
        console.error("Error deleting view:", error);
        // Could add a toast notification here
      }
    } else {
      // First click - set confirmation state
      setDeleteConfirmId(presetId);
    }
  };

  // Cancel delete confirmation on click outside
  useEffect(() => {
    if (!showSettingsDropdown) {
      setDeleteConfirmId(null);
      setSearchTerm('');
    } else if (searchInputRef.current) {
      // Focus search when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSettingsDropdown]);

  // Clear error when user types
  useEffect(() => {
    if (saveError) {
      setSaveError(null);
    }
  }, [presetName]);

  useEffect(() => {
    if (showSettingsDropdown && dropdownRef.current) {
      // Add entrance animation class
      dropdownRef.current.classList.add('dropdown-enter');
      
      setTimeout(() => {
        if (dropdownRef.current) {
          dropdownRef.current.classList.remove('dropdown-enter');
        }
      }, 300);
    }
  }, [showSettingsDropdown]);

  // Filtered settings based on search
  const filteredSettings = searchTerm 
    ? savedSettings.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : savedSettings;

  // Get current preset name for display
  const getCurrentPresetName = () => {
    if (!currentPreset) return null;
    const preset = savedSettings.find(s => s.id === currentPreset);
    return preset?.name;
  };

  // Add custom stylesheet for the column-selector-like design
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'column-selector-styles';
    
    // Use neutral monochromatic colors instead of accent colors
    const primaryColor = isDarkMode ? '#ffffff' : '#000000';
    const primaryColorAlpha = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    
    const stylesText = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .column-selector-dropdown {
        animation: fadeIn 0.15s ease-out;
      }
      
      .column-item {
        transition: background-color 0.1s ease;
      }
      
      .column-item:hover {
        background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
      }
      
      /* Scrollbar styling for the scrollable middle section */
      .overflow-y-auto::-webkit-scrollbar {
        width: 4px; /* Thinner scrollbar */
      }
      
      .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb {
        background-color: ${isDarkMode ? 'rgba(80, 80, 80, 0.5)' : 'rgba(160, 160, 160, 0.5)'};
        border-radius: 10px;
      }
      
      .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background-color: ${isDarkMode ? 'rgba(100, 100, 100, 0.6)' : 'rgba(180, 180, 180, 0.6)'};
      }
      
      /* Hide scrollbar when not hovering */
      .overflow-y-auto {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }
      
      /* Show scrollbar on hover */
      .overflow-y-auto:hover {
        scrollbar-color: ${isDarkMode ? 'rgba(80, 80, 80, 0.5) transparent' : 'rgba(160, 160, 160, 0.5) transparent'};
      }
      
      .delete-btn-active {
        color: #ef4444 !important;
        background-color: rgba(239, 68, 68, 0.15);
      }
      
      .save-modal-overlay {
        animation: fadeIn 0.2s ease-out;
        backdrop-filter: blur(2px);
      }
      
      .save-modal {
        animation: modalEnter 0.25s cubic-bezier(0.25, 0.1, 0.25, 1.0);
      }
      
      @keyframes modalEnter {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .error-message {
        animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      
      @keyframes shake {
        10%, 90% { transform: translateX(-1px); }
        20%, 80% { transform: translateX(2px); }
        30%, 50%, 70% { transform: translateX(-2px); }
        40%, 60% { transform: translateX(2px); }
      }
      
      .button-update {
        color: ${isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'} !important;
      }
      
      .button-update:hover {
        background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} !important;
      }
      
      .button-new {
        color: ${isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'} !important;
      }
      
      .button-new:hover {
        background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} !important;
      }
    `;
    
    styleElement.textContent = stylesText;
    document.head.appendChild(styleElement);
    
    // Cleanup
    return () => {
      const existingStyle = document.getElementById('column-selector-styles');
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, [isDarkMode]);
  
  return (
    <div className="flex items-center relative">
      {/* Button to show Views (same style but dark by default) */}
      <Button
        variant="ghost"
        size="sm"
        className="ag-toolbar-btn transition-all duration-200"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          background: showSettingsDropdown 
            ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') 
            : 'transparent',
          height: '28px',
          padding: '0 10px',
          fontSize: '12px',
          borderRadius: '3px',
          fontWeight: 500,
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: showSettingsDropdown 
            ? (isDarkMode ? '0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 0 0 1px rgba(0, 0, 0, 0.05)')
            : 'none'
        }}
        onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
      >
        <span className="mr-1.5 max-w-[100px] truncate">
          {currentPreset ? getCurrentPresetName() : 'Views'}
        </span>
        <ChevronDown 
          className="h-3 w-3 transition-transform duration-300" 
          style={{ transform: showSettingsDropdown ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </Button>
      
      {/* Update Current View Quick Button - only visible when a view is selected */}
      {currentPreset && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-1 h-7 px-2 text-xs font-medium rounded-sm transition-all duration-200"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            fontWeight: 500,
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => {
            updateSettings(currentPreset);
            // Show brief visual feedback
            const btn = document.activeElement as HTMLElement;
            if (btn) {
              const originalBackground = btn.style.background;
              btn.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
              setTimeout(() => {
                btn.style.background = originalBackground;
              }, 300);
            }
          }}
          title="Update current view with these settings"
        >
          <FileEdit className="h-3.5 w-3.5 mr-1" />
          Update
        </Button>
      )}

      {/* Column selector style dropdown */}
      {showSettingsDropdown && (
        <div 
          ref={dropdownRef}
          className="column-selector-dropdown"
          style={{
            position: 'absolute',
            top: '34px',
            right: '-8px',
            width: '200px',
            maxHeight: '350px',
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
            borderRadius: '4px',
            boxShadow: isDarkMode ? 
              '0 6px 16px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2)' : 
              '0 6px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Fixed header with search field */}
          <div 
            className="sticky top-0 z-10 px-2 py-2 border-b"
            style={{ 
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              borderColor: isDarkMode ? '#333' : '#e0e0e0',
              boxShadow: isDarkMode ? 
                '0 2px 4px rgba(0,0,0,0.2)' : 
                '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="w-full pl-7 pr-2 py-1 text-xs rounded-sm"
                style={{ 
                  background: isDarkMode ? '#333' : '#f5f5f5',
                  border: 'none',
                  color: isDarkMode ? '#e0e0e0' : '#333',
                  outline: 'none',
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3" 
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3"
                  style={{ color: isDarkMode ? '#777' : '#999' }}
                  onClick={() => setSearchTerm('')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          
          {/* Scrollable middle section with view items */}
          <div 
            className="py-1 overflow-y-auto"
            style={{ flexGrow: 1, maxHeight: 'calc(100% - 110px)' }}
          >
            {filteredSettings.length > 0 ? (
              filteredSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="column-item px-2 py-1 flex items-center cursor-pointer"
                  onClick={() => handleLoadPreset(setting.id)}
                  style={{
                    backgroundColor: setting.id === currentPreset ? 
                      (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') : 
                      'transparent'
                  }}
                >
                  {/* Three dot grip */}
                  <div className="mr-2" style={{ color: isDarkMode ? '#666' : '#ccc' }}>
                    <GripVertical size={14} />
                  </div>
                  
                  {/* Label */}
                  <span 
                    className="truncate text-xs"
                    style={{
                      color: isDarkMode ? '#e0e0e0' : '#333',
                      fontWeight: setting.id === currentPreset ? 500 : 400
                    }}
                  >
                    {setting.name}
                  </span>
                  
                  {/* Update icon (only for current preset) */}
                  {setting.id === currentPreset && (
                    <button
                      className="ml-1 p-1 rounded transition-colors"
                      style={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                        backgroundColor: 'transparent'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openSaveModal(false);
                      }}
                      title="Update this view"
                    >
                      <FileEdit size={14} />
                    </button>
                  )}
                  
                  {/* Delete button (always visible) */}
                  <button
                    className="ml-auto p-1 transition-colors"
                    onClick={(e) => handleDeletePreset(setting.id, e)}
                    title={deleteConfirmId === setting.id ? "Click again to confirm deletion" : "Delete view"}
                    style={{
                      color: deleteConfirmId === setting.id ? '#ef4444' : (isDarkMode ? '#777' : '#999'),
                      backgroundColor: deleteConfirmId === setting.id ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                      borderRadius: '2px'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : searchTerm ? (
              <div className="text-center py-3 text-xs" style={{ color: isDarkMode ? '#888' : '#999' }}>
                No views match "{searchTerm}"
              </div>
            ) : (
              <div className="text-center py-3 text-xs" style={{ color: isDarkMode ? '#888' : '#999' }}>
                No saved views
              </div>
            )}
          </div>
          
          {/* Fixed footer with buttons */}
          <div 
            className="sticky bottom-0 border-t p-2"
            style={{ 
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              borderColor: isDarkMode ? '#333' : '#e0e0e0',
              boxShadow: isDarkMode ? 
                '0 -2px 4px rgba(0,0,0,0.2)' : 
                '0 -2px 4px rgba(0,0,0,0.05)',
              zIndex: 10
            }}
          >
            {/* Two buttons: Update Current and New View */}
            <div className="flex gap-2">
              {/* Update Current View - always visible, disabled when no view is selected */}
              
              {/* New View */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-center items-center text-xs button-new"
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  padding: '6px 0',
                  borderRadius: '2px'
                }}
                onClick={() => openSaveModal(true)}
                title="Save as a new view"
              >
                <FilePlus className="h-3 w-3 mr-1" />
                New View
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Improved save modal with error handling */}
      {showSaveInput && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center save-modal-overlay"
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setShowSaveInput(false)}
        >
          <div 
            className="p-4 rounded-md shadow-lg w-80 save-modal"
            style={{ 
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
              boxShadow: isDarkMode ? 
                '0 25px 50px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.4)' : 
                '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 
              className="text-xs font-medium mb-3 flex items-center"
              style={{ color: isDarkMode ? '#e0e0e0' : '#333' }}
            >
              {isNewView ? (
                <>
                  <FilePlus className="h-3.5 w-3.5 mr-1.5" style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }} />
                  Save as New View
                </>
              ) : (
                <>
                  <FileEdit className="h-3.5 w-3.5 mr-1.5" style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }} />
                  Update Current View
                </>
              )}
            </h3>
            
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="text"
                placeholder={isNewView ? "New view name" : "View name"}
                className={`w-full px-3 py-2 text-xs rounded-sm ${saveError ? 'border border-[#ef4444]' : 'border-none'}`}
                style={{ 
                  background: isDarkMode ? '#333' : '#f5f5f5',
                  color: isDarkMode ? '#e0e0e0' : '#333',
                  outline: 'none',
                }}
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && presetName.trim()) {
                    handleSavePreset();
                  }
                }}
                disabled={isSaving}
                readOnly={!isNewView}
              />
              
              {/* Error message */}
              {saveError && (
                <div className="mt-1.5 text-xs text-[#ef4444] flex items-center error-message">
                  <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs bg-transparent"
                style={{
                  border: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
                  color: isDarkMode ? '#e0e0e0' : '#666',
                  borderRadius: '2px',
                }}
                onClick={() => setShowSaveInput(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="h-8 text-xs"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.75)',
                  color: isDarkMode ? '#ffffff' : '#ffffff',
                  borderRadius: '2px',
                  opacity: presetName.trim() && !isSaving ? '1' : '0.7',
                }}
                onClick={handleSavePreset}
                disabled={!presetName.trim() || isSaving}
              >
                {isSaving ? 'Saving...' : isNewView ? 'Save New' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add a global click handler to close the dropdown when clicking outside */}
      {showSettingsDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettingsDropdown(false)}
        />
      )}
    </div>
  );
}