import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { User, Mail, Camera, Check, GripVertical } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

const STORAGE_KEY = "profiles-column-width";
const PROFILES_STORAGE_KEY = "profiles-data";
const SELECTED_PROFILE_KEY = "selected-profile-id";

const defaultProfiles: Profile[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    isActive: false,
  },
];

export function Profiles() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProfiles;
  });
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(() => {
    const savedProfileId = localStorage.getItem(SELECTED_PROFILE_KEY);
    if (savedProfileId) {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      const savedProfiles = saved ? JSON.parse(saved) : defaultProfiles;
      return savedProfiles.find(p => p.id === savedProfileId) || null;
    }
    return null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [columnWidth, setColumnWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 256; // Default width: 256px (w-64)
  });
  const resizerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  // Load saved column width on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setColumnWidth(parseInt(saved, 10));
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    
    // Check if selected profile still exists in the updated profiles list
    if (selectedProfile) {
      const profileStillExists = profiles.some(p => p.id === selectedProfile.id);
      if (!profileStillExists) {
        setSelectedProfile(null);
        localStorage.removeItem(SELECTED_PROFILE_KEY);
      }
    }
  }, [profiles, selectedProfile]);

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setEditForm({
      name: profile.name,
      email: profile.email,
    });
    setIsEditing(false);
    localStorage.setItem(SELECTED_PROFILE_KEY, profile.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedProfile) return;

    const updatedProfiles = profiles.map(profile => 
      profile.id === selectedProfile.id
        ? { ...profile, ...editForm }
        : profile
    );

    setProfiles(updatedProfiles);
    setSelectedProfile({
      ...selectedProfile,
      ...editForm,
    });

    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleCancel = () => {
    if (selectedProfile) {
      setEditForm({
        name: selectedProfile.name,
        email: selectedProfile.email,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));

    // If we're deleting the selected profile, clear it
    if (selectedProfile?.id === profileId) {
      setSelectedProfile(null);
      localStorage.removeItem(SELECTED_PROFILE_KEY);
    }

    toast({
      title: "Profile deleted",
      description: "The profile has been deleted successfully.",
    });
  };

  const startResizing = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 400) { // Min: 200px, Max: 400px
      setColumnWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    localStorage.setItem(STORAGE_KEY, columnWidth.toString());
  };

  return (
    <div className="flex gap-6">
      {/* Profile List with Resizer */}
      <div className="relative" style={{ width: columnWidth }}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profiles</h3>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedProfile?.id === profile.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  {profile.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-sm opacity-80">{profile.email}</div>
                </div>
                {selectedProfile?.id === profile.id && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={resizerRef}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
          onMouseDown={startResizing}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary/50 rounded-full" />
        </div>
      </div>

      {/* Profile Details */}
      <div className="flex-1 space-y-6">
        {selectedProfile ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Profile Details</h3>
              {!isEditing && (
                <Button variant="outline" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-10 h-10" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Click to upload a new avatar
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a profile to view details
          </div>
        )}
      </div>
    </div>
  );
} 