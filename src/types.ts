// App views
export type View = 'dashboard' | 'projects' | 'messages' | 'skills' | 'settings';

// 🔹 Social Links (matches schema)
export interface SocialLinks {
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  gitlab?: string | null;
}

// 🔹 User type (aligned with your userSchema)
export interface User {
  _id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  bio: string;
  profilePictureUrl: string;
  profilePictureUrlPublicId?: string | null;
  socialLinks: SocialLinks;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 🔹 Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 🔹 Auth Context
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 🔹 Profile type (used in SettingsView)
export interface Profile extends User {}
