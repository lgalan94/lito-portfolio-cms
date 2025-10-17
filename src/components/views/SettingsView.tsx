import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentUser, updateUserProfile } from '../../services/userApi';
import type { User } from '../../types';

const SettingsView: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ Load full user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle input & textarea changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setUser((prev) =>
        prev ? { ...prev, socialLinks: { ...prev.socialLinks, [key]: value } } : prev
      );
    } else {
      setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  // ✅ Handle image selection + preview
  /* const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }; */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // 🔸 Validate file type
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, or WebP).');
      e.target.value = ''; // reset input
      return;
    }

    // 🔸 Validate file size
    if (file.size > maxSize) {
      alert('Image size must be 5MB or smaller.');
      e.target.value = ''; // reset input
      return;
    }

    // ✅ Clean up previous preview URL (avoid memory leak)
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    // ✅ Set new preview
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };


  // ✅ Submit updates (with image)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('jobTitle', user.jobTitle);
      formData.append('bio', user.bio);
      formData.append('socialLinks', JSON.stringify(user.socialLinks));
      if (profileImage) formData.append('profilePicture', profileImage);

      const updated = await updateUserProfile(formData); // must handle FormData in API
      setUser(updated);
      setPreviewUrl(null);
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-slate-400 mt-10">
        Loading profile...
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
          <div className="relative group">
            <img
              src={previewUrl || user.profilePictureUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border border-slate-700"
            />
            <label
              htmlFor="profilePicture"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
            >
              Change
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">{user.fullName}</h3>
            <p className="text-slate-400">{user.jobTitle}</p>
          </div>
        </div>

        {/* Full Name + Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={user.fullName || ''}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={user.jobTitle || ''}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={user.bio || ''}
            onChange={handleChange}
            rows={4}
            className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Social Links
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                name="socialLinks.github"
                value={user.socialLinks?.github || ''}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="socialLinks.linkedin"
                value={user.socialLinks?.linkedin || ''}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                name="socialLinks.facebook"
                value={user.socialLinks?.facebook || ''}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Gitlab URL
              </label>
              <input
                type="text"
                name="socialLinks.gitlab"
                value={user.socialLinks?.gitlab || ''}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default SettingsView;
