import React, { useState, useEffect } from 'react';
import { Save, Bookmark, Plus, Check, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useTheme, GridSettings } from '../context/ThemeContext';

interface SettingsMenuProps {
  className?: string;
}

export function SettingsMenu({ className }: SettingsMenuProps) {
  const { 
    savedSettings, 
    saveSettings, 
    loadSettings,
    updateSettings,
    spacing,
    fontSize,
    accentColor
  } = useTheme();
  
  const [selectedSetting, setSelectedSetting] = useState<string>('');
  const [showNewPresetInput, setShowNewPresetInput] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  
  // Set the first preset as selected if nothing is selected
  useEffect(() => {
    if (savedSettings.length > 0 && !selectedSetting) {
      setSelectedSetting(savedSettings[0].id);
    }
  }, [savedSettings, selectedSetting]);
  
  // Create a new preset
  const handleCreateNewPreset = () => {
    if (newPresetName.trim()) {
      const newId = saveSettings(newPresetName.trim());
      setSelectedSetting(newId);
      setNewPresetName('');
      setShowNewPresetInput(false);
      
      // Trigger grid update
      const event = new CustomEvent('preset-loaded');
      document.dispatchEvent(event);
    }
  };
  
  // Update current preset
  const handleUpdateCurrentPreset = () => {
    if (selectedSetting) {
      updateSettings(selectedSetting);
      
      // Trigger grid update
      const event = new CustomEvent('preset-loaded');
      document.dispatchEvent(event);
    }
  };
  
  // Select and load a preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedSetting(presetId);
    loadSettings(presetId);
  };
  
  // Get the name of the currently selected preset
  const getSelectedPresetName = () => {
    const selected = savedSettings.find(s => s.id === selectedSetting);
    return selected ? selected.name : 'Select preset';
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center px-3 py-1.5 bg-white dark:bg-[#2b2b40] rounded-md shadow-sm border border-[#e5e7eb] dark:border-[#323248] gap-3">
        <Bookmark className="h-4 w-4 text-[#5e6278] dark:text-[#a1a5b7]" />
        
        {/* Preset selector dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm" 
              className="h-6 min-w-32 text-xs gap-1 px-2 py-0 rounded bg-transparent hover:bg-[#eef3f7] dark:hover:bg-[#323248]"
            >
              <span className="truncate font-medium text-[#181c32] dark:text-[#cdcfd9]">{getSelectedPresetName()}</span>
              <ChevronDown className="h-3 w-3 ml-auto text-[#5e6278] dark:text-[#a1a5b7]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border border-[#e5e7eb] dark:border-[#323248] bg-white dark:bg-[#1e1e2d] rounded-md shadow-md">
            {savedSettings.length > 0 ? (
              <>
                {savedSettings.map((preset) => (
                  <DropdownMenuItem
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[#f9f9fa] dark:hover:bg-[#2b2b40] text-[#181c32] dark:text-[#cdcfd9]"
                  >
                    {selectedSetting === preset.id && (
                      <Check className="h-3.5 w-3.5 text-[#009ef7] dark:text-[#00a3ff]" />
                    )}
                    <span className={selectedSetting === preset.id ? 'font-medium' : ''}>
                      {preset.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <DropdownMenuItem disabled className="py-2 text-center text-[#5e6278] dark:text-[#a1a5b7]">No saved presets</DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator className="bg-[#e9e9e9] dark:bg-[#323248]" />
            
            <DropdownMenuItem 
              className="py-1.5 text-[#009ef7] dark:text-[#00a3ff] font-medium hover:bg-[#f9f9fa] dark:hover:bg-[#2b2b40]"
              onClick={handleUpdateCurrentPreset}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save current settings
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="py-1.5 text-[#009ef7] dark:text-[#00a3ff] font-medium hover:bg-[#f9f9fa] dark:hover:bg-[#2b2b40]"
              onClick={() => setShowNewPresetInput(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Save as new preset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* New preset input */}
      {showNewPresetInput && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowNewPresetInput(false)}>
          <div className="bg-white dark:bg-[#1e1e2d] p-4 rounded-lg shadow-lg w-80" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium mb-3 text-[#181c32] dark:text-[#cdcfd9]">Save New Preset</h3>
            <input
              type="text"
              placeholder="Preset name"
              className="w-full px-3 py-2 text-sm border rounded-md mb-4 border-[#e5e7eb] dark:border-[#323248] bg-white dark:bg-[#1e1e2d] text-[#181c32] dark:text-[#cdcfd9]"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs border-[#e5e7eb] dark:border-[#323248] text-[#181c32] dark:text-[#cdcfd9]"
                onClick={() => setShowNewPresetInput(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="h-8 text-xs bg-[#009ef7] hover:bg-[#0095e8] text-white"
                onClick={handleCreateNewPreset}
                disabled={!newPresetName.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}