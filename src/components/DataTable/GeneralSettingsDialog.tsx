import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { useTheme } from "../../context/ThemeContext";
import { ColorPicker } from "./ColorPicker";
import { FontSelect } from "./FontSelect";
import { useToast } from "../ui/use-toast";
import { Profiles } from "./Profiles";

interface GeneralSettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GeneralSettingsDialog({ 
  open, 
  onOpenChange 
}: GeneralSettingsDialogProps) {
  const { 
    spacing, 
    updateSpacing, 
    fontSize, 
    updateFontSize,
    fontFamily,
    accentColor,
    isDarkMode,
    toggleDarkMode,
  } = useTheme();
  
  const [compactMode, setCompactMode] = useState(spacing <= 8);
  const { toast } = useToast();
  
  const handleCompactModeChange = (checked: boolean) => {
    setCompactMode(checked);
    updateSpacing(checked ? 8 : 12);
    toast({
      title: `${checked ? 'Compact' : 'Standard'} mode activated`,
      description: `UI spacing has been adjusted to ${checked ? 'compact' : 'standard'} mode.`,
    });
  };
  
  const handleFontSizeChange = (values: number[]) => {
    const newSize = values[0];
    updateFontSize(newSize);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">General Settings</DialogTitle>
          <DialogDescription>
            Configure your data grid appearance and behavior.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-8">
          {/* UI Density Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">UI Density</h3>
            <div className="flex flex-col space-y-4">
              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode" className="text-sm font-medium">
                    Compact Mode
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reduce spacing between UI elements
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              
              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size" className="text-sm font-medium">
                    Font Size: {fontSize}px
                  </Label>
                </div>
                <div className="pt-2">
                  <Slider
                    id="font-size"
                    min={12}
                    max={18}
                    step={1}
                    value={[fontSize]}
                    onValueChange={handleFontSizeChange}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Theme */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:space-y-2">
                <div>
                  <Label htmlFor="theme-mode" className="text-sm font-medium">
                    Theme
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Light or dark mode
                  </p>
                </div>
                <Switch
                  id="theme-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              {/* Accent Color */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:space-y-2">
                <div>
                  <Label className="text-sm font-medium">
                    Accent Color
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Primary highlight color
                  </p>
                </div>
                <ColorPicker />
              </div>
              
              {/* Font */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:space-y-2 sm:col-span-2">
                <div>
                  <Label className="text-sm font-medium">
                    Font
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred font
                  </p>
                </div>
                <div className="w-full max-w-[260px]">
                  <FontSelect />
                </div>
              </div>
            </div>
          </div>
          
          {/* Profiles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profiles</h3>
            <Profiles />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={() => onOpenChange?.(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 