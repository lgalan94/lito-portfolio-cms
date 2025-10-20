// App views
export type View = 'dashboard' | 'projects' | 'messages' | 'skills' | 'settings';

// 🔹 Social Links (matches schema)
export interface SocialLinks {
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  gitlab?: string | null;
  [key: string]: string | null |undefined;
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

export interface Message {
  _id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  messageBody: string;
  receivedAt: string;
  status: 'unread' | 'read' | 'archived' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  tags: string | string[];
  description: string;
  imageUrl: string;
  imagePublicId?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string,
  name: string,
  icon: string,
  category: string
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
