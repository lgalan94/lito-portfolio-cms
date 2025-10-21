import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
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

  // ✅ Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Failed to load user:', err);
        toast.error('Failed to load profile.');
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle input changes
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

  // ✅ Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or WebP).');
      e.target.value = '';
      return;
    }
    if (file.size > maxSize) {
      toast.error('Image size must be 5MB or smaller.');
      e.target.value = '';
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('jobTitle', user.jobTitle);
      formData.append('bio', user.bio);
      formData.append('shortBio', user.shortBio);
      formData.append('socialLinks', JSON.stringify(user.socialLinks));
      if (profileImage) formData.append('profilePicture', profileImage);

      const updated = await updateUserProfile(formData);
      setUser(updated);
      setPreviewUrl(null);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
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
    <>


      <motion.div
        className="ml-66"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Card className="w-full h-full mt-16">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:text-left">
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img
                  src={previewUrl || user.profilePictureUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border border-slate-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
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
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-white">{user.fullName}</h3>
                <p className="text-slate-400">{user.jobTitle}</p>
              </div>
            </div>

            {/* Name & Job */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Short Bio
                </label>
                <input
                  type="text"
                  name="shortBio"
                  value={user.shortBio || ''}
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
                {['github', 'linkedin', 'facebook', 'gitlab'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-slate-400 mb-1 capitalize">
                      {platform} URL
                    </label>
                    <input
                      type="text"
                      name={`socialLinks.${platform}`}
                      value={user.socialLinks?.[platform] || ''}
                      onChange={handleChange}
                      className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <motion.button
                type="submit"
                disabled={isSaving}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </Card>
      </motion.div>
    </>
  );
};

export default SettingsView;
