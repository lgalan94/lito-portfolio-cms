// ===============================
// App Views
// ===============================
export type View =
  | "dashboard"
  | "projects"
  | "certificates"
  | "messages"
  | "skills"
  | "work-experience"
  | "settings";

// ===============================
// Social Links
// ===============================
export interface SocialLinks {
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  gitlab?: string | null;
  [key: string]: string | null | undefined;
}

// ===============================
// User
// ===============================
export interface User {
  _id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  bio: string;
  shortBio: string;
  profilePictureUrl: string;
  profilePictureUrlPublicId?: string | null;
  socialLinks: SocialLinks;
  isAdmin: boolean;
  resumeUrl?: string | null;
  resumePublicId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ===============================
// Messages
// ===============================
export interface Message {
  _id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  messageBody: string;
  receivedAt: string;
  status: "unread" | "read" | "archived" | "deleted";
  createdAt: string;
  updatedAt: string;
}

// ===============================
// Projects
// ===============================
export interface Project {
  _id: string;
  title: string;
  tags: string | string[];
  description: string;
  imageUrl: string;
  imagePublicId?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  category?: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================
// Certificates
// ===============================
export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  imageUrl: string;
  imagePublicId?: string | null;
  credentialUrl?: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificatePayload {
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  credentialUrl?: string;
  image: File;
}

export interface UpdateCertificatePayload {
  title?: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  credentialUrl?: string;
  image?: File;
}

// ===============================
// Employment
// ===============================
export interface Employment {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string[] | string;
  createdOn?: string;
}

// ===============================
// Skills
// ===============================
export interface Skill {
  _id: string;
  name: string;
  icon: string;
  category: string;
}

// ===============================
// Auth State
// ===============================
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===============================
// Auth Context
// ===============================
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ===============================
// Profile
// ===============================
export interface Profile extends User {}