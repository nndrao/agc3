import React, { useState, useEffect, useRef } from 'react';
import { Save, ChevronDown, Bookmark, Trash2, Check, Search, GripVertical, X, AlertCircle, FileEdit, FilePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../context/ThemeContext';

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
      setSaveError("Please enter a name for your profile");
      return;
    }

    // Only check for duplicates when creating a new view
    if (isNewView) {
      // Check for duplicates
      const duplicateName = savedSettings.find(s => 
        s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (duplicateName) {
        setSaveError(`A profile named "${trimmedName}" already exists`);
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
      console.error("Error saving profile:", error);
      setSaveError("Failed to save profile. Please try again.");
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
      console.error("Error loading profile:", error);
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
        console.error("Error updating profile:", error);
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
        console.error("Error deleting profile:", error);
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

  return (
    <div className={`settings-menu ${className || ''}`}>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
        className="flex items-center h-8 px-3 text-sm font-medium rounded-md"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          fontWeight: 500
        }}
      >
        <Bookmark className="h-4 w-4 mr-2" />
        <span>{currentPreset ? getCurrentPresetName() : 'Profiles'}</span>
        <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-70" />
      </Button>
      
      {/* Settings dropdown */}
      {showSettingsDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-72 bg-popover border rounded-lg shadow-lg"
          style={{
            backgroundColor: isDarkMode ? '#1F1F23' : '#FFFFFF',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            boxShadow: isDarkMode 
              ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
              : '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header with search */}
          <div className="p-3 border-b"
            style={{
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-1 pl-8 pr-3 h-8 text-sm rounded-md bg-transparent border focus:ring-1 focus:outline-none"
                  style={{
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => openSaveModal(true)}
                title="Create new profile"
              >
                <FilePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Body - profiles list */}
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: '300px',
              overscrollBehavior: 'contain'
            }}
          >
            {filteredSettings.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                <AlertCircle className="h-5 w-5 mb-2" />
                <p>No saved profiles found.</p>
                <p className="mt-1 text-xs">
                  {searchTerm ? "Try a different search term." : "Create your first profile."}
                </p>
              </div>
            ) : (
              filteredSettings.map((setting) => (
                <div 
                  key={setting.id}
                  className={`column-item p-2 flex items-center justify-between cursor-pointer hover:bg-accent hover:bg-opacity-5 ${
                    currentPreset === setting.id ? 'bg-accent bg-opacity-10' : ''
                  }`}
                  onClick={() => handleLoadPreset(setting.id)}
                >
                  <div className="flex items-center">
                    {currentPreset === setting.id && (
                      <Check className="h-4 w-4 mr-2 text-primary" />
                    )}
                    <span className="text-sm font-medium">{setting.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSaveModal(false);
                      }}
                      title="Edit profile"
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 ${
                        deleteConfirmId === setting.id 
                          ? 'text-destructive' 
                          : 'text-muted-foreground'
                      }`}
                      onClick={(e) => handleDeletePreset(setting.id, e)}
                      title={deleteConfirmId === setting.id ? "Confirm delete" : "Delete profile"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div 
            className="p-3 border-t"
            style={{
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setShowSettingsDropdown(false)}
              >
                Close
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                id="update-view-button"
                className="h-8"
                onClick={handleUpdateCurrentPreset}
                disabled={!currentPreset}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Update Current
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save input modal */}
      {showSaveInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-popover p-4 rounded-lg shadow-lg w-80"
            style={{
              backgroundColor: isDarkMode ? '#1F1F23' : '#FFFFFF',
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">
                {isNewView ? "Save New Profile" : "Update Profile"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setShowSaveInput(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Profile Name</label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter profile name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md bg-background border focus:ring-1 focus:outline-none"
                  style={{
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSavePreset();
                    } else if (e.key === 'Escape') {
                      setShowSaveInput(false);
                    }
                  }}
                />
                {saveError && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {saveError}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => setShowSaveInput(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleSavePreset}
                  disabled={!presetName.trim() || isSaving}
                >
                  {isSaving ? "Saving..." : isNewView ? "Save" : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 