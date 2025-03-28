import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { User, Mail, Camera, Check, GripVertical } from "lucide-react";

// Profile interface
interface Profile {
  id: string;
  name: string;
  active: boolean;
}

// Constants
const STORAGE_KEY = "profiles-column-width";
const PROFILES_STORAGE_KEY = "profiles-data";

// Default profiles data
const defaultProfiles: Profile[] = [
  {
    id: "default",
    name: "Default",
    active: true,
  },
  {
    id: "compact",
    name: "Compact View",
    active: false,
  },
  {
    id: "expanded",
    name: "Expanded View",
    active: false,
  }
];

export function Profiles() {
  // State for profiles
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProfiles;
  });
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(() => {
    const savedProfileId = localStorage.getItem("selected-profile-id");
    const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
    const savedProfiles = saved ? JSON.parse(saved) : defaultProfiles;
    return savedProfiles.find(p => p.id === savedProfileId) || null;
  });
  const [newProfileName, setNewProfileName] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  // Toast notification
  const { toast } = useToast();
  
  // Refs
  const newInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to focus input on edit
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 50);
    }
  }, [isEditing]);
  
  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    
    // Check if selected profile still exists in the updated profiles list
    if (selectedProfile) {
      const profileStillExists = profiles.some(p => p.id === selectedProfile.id);
      if (!profileStillExists) {
        setSelectedProfile(profiles[0] || null);
        localStorage.setItem("selected-profile-id", profiles[0]?.id || "");
      }
    }
  }, [profiles, selectedProfile]);
  
  const handleProfileSelect = (profile: Profile) => {
    // Update selected profile
    setSelectedProfile(profile);
    localStorage.setItem("selected-profile-id", profile.id);
    
    // Show toast notification
    toast({
      title: `Profile: ${profile.name}`,
      description: `Switched to the ${profile.name} profile.`,
    });
    
    // Trigger a custom event that the DataTable component can listen for
    const event = new CustomEvent("profile-changed", { detail: profile.id });
    document.dispatchEvent(event);
  };
  
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    
    // Create new profile
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: newProfileName.trim(),
      active: false,
    };
    
    // Update profiles state with the new profile
    const updatedProfiles = profiles.map(profile =>
      ({ ...profile, active: false })
    );
    setProfiles([...updatedProfiles, newProfile]);
    
    // Clear input
    setNewProfileName("");
    
    // Show toast
    toast({
      title: "Profile Created",
      description: `Created new profile: ${newProfileName}`,
    });
  };
  
  const handleDeleteProfile = (profileId: string) => {
    // Don't allow deleting the last profile
    if (profiles.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one profile.",
        variant: "destructive",
      });
      return;
    }
    
    // Update profiles state
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    // If the deleted profile was selected, select the first available one
    if (selectedProfile && selectedProfile.id === profileId) {
      const newSelected = updatedProfiles[0];
      setSelectedProfile(newSelected);
      localStorage.setItem("selected-profile-id", newSelected.id);
      
      // Trigger profile change event
      const event = new CustomEvent("profile-changed", { detail: newSelected.id });
      document.dispatchEvent(event);
    }
    
    // Show toast
    toast({
      title: "Profile Deleted",
      description: "The profile has been deleted.",
    });
  };
  
  const handleStartEditing = (profile: Profile) => {
    setIsEditing(profile.id);
    setEditName(profile.name);
  };
  
  const handleSaveEdit = (profileId: string) => {
    if (!editName.trim()) return;
    
    // Update profile name
    const updatedProfiles = profiles.map(p => 
      p.id === profileId ? { ...p, name: editName.trim() } : p
    );
    setProfiles(updatedProfiles);
    
    // Clear editing state
    setIsEditing(null);
    
    // Update selected profile if it was the one edited
    if (selectedProfile && selectedProfile.id === profileId) {
      const updatedProfile = { ...selectedProfile, name: editName.trim() };
      setSelectedProfile(updatedProfile);
    }
    
    // Show toast
    toast({
      title: "Profile Updated",
      description: "The profile name has been updated.",
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Profiles</h3>
      
      <div className="space-y-2">
        {profiles.map((profile) => (
          <div 
            key={profile.id}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              selectedProfile?.id === profile.id 
                ? 'bg-primary/10 border-l-4 border-primary' 
                : 'hover:bg-accent/50'
            }`}
            onClick={() => handleProfileSelect(profile)}
          >
            <div className="flex items-center">
              {selectedProfile?.id === profile.id && (
                <Check className="h-4 w-4 mr-2 text-primary" />
              )}
              
              {isEditing === profile.id ? (
                <Input
                  ref={editInputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(profile.id);
                    } else if (e.key === 'Escape') {
                      setIsEditing(null);
                    }
                  }}
                  onBlur={() => handleSaveEdit(profile.id)}
                  className="h-8 w-48"
                  autoFocus
                />
              ) : (
                <span className="font-medium">{profile.name}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {!isEditing && selectedProfile?.id !== profile.id && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditing(profile);
                    }}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="flex items-center space-x-2">
          <Input
            ref={newInputRef}
            placeholder="New profile name"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateProfile();
              }
            }}
            className="h-8"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleCreateProfile}
            disabled={!newProfileName.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
} 