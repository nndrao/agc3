import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTheme } from "../context/ThemeContext";
import { ColorPicker } from "./ColorPicker";
import { FontSelect } from "./FontSelect";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Profiles } from "./Profiles";

interface GeneralSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeneralSettingsDialog({ open, onOpenChange }: GeneralSettingsDialogProps) {
  const { 
    spacing,
    updateSpacing,
    fontSize,
    updateFontSize,
    accentColor,
    isDarkMode,
    toggleDarkMode
  } = useTheme();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>General Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance and behavior of your application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Theme Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dark-mode" className="text-right">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accent-color" className="text-right">
                Accent Color
              </Label>
              <div className="col-span-3">
                <ColorPicker initialColor={accentColor} />
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Typography</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="font-family" className="text-right">
                Font Family
              </Label>
              <div className="col-span-3">
                <FontSelect />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="font-size" className="text-right">
                Font Size
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="18"
                  step="1"
                  value={fontSize}
                  onChange={(e) => updateFontSize(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <span className="text-sm min-w-[35px] text-center">{fontSize}px</span>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Layout</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="spacing" className="text-right">
                Spacing
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={spacing}
                  onChange={(e) => updateSpacing(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <span className="text-sm min-w-[30px] text-center">{spacing}px</span>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Language</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                Language
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-notifications" className="text-right">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="push-notifications" className="text-right">
                Push Notifications
              </Label>
              <Switch
                id="push-notifications"
                className="col-span-3"
              />
            </div>
          </div>

          {/* Profiles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profiles</h3>
            <Profiles />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 