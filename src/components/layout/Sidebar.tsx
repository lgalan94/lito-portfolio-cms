import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { View } from '../../types';
import {
  DashboardIcon,
  ProjectsIcon,
  MessagesIcon,
  SkillsIcon,
  SettingsIcon,
  CodeBracketIcon,
  MenuIcon,
} from '../ui/Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const routeToView = (path: string): View => {
  switch (path) {
    case '/dashboard':
      return 'dashboard';
    case '/projects':
      return 'projects';
    case '/messages':
      return 'messages';
    case '/skills':
      return 'skills';
    case '/settings':
      return 'settings';
    default:
      return 'dashboard';
  }
};

const NavItem: React.FC<{
  view: View;
  activeView: View;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, onClick, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeView = routeToView(location.pathname);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false); // optional: close sidebar on mobile after click
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/60 p-4 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header */}
        <div className="flex items-center mb-8">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <CodeBracketIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Portfolio CMS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <NavItem
            view="dashboard"
            activeView={activeView}
            onClick={() => handleNavigation('/dashboard')}
            icon={<DashboardIcon />}
            label="Dashboard"
          />
          <NavItem
            view="projects"
            activeView={activeView}
            onClick={() => handleNavigation('/projects')}
            icon={<ProjectsIcon />}
            label="Projects"
          />
          <NavItem
            view="messages"
            activeView={activeView}
            onClick={() => handleNavigation('/messages')}
            icon={<MessagesIcon />}
            label="Messages"
          />
          <NavItem
            view="skills"
            activeView={activeView}
            onClick={() => handleNavigation('/skills')}
            icon={<SkillsIcon />}
            label="Skills"
          />
          <NavItem
            view="settings"
            activeView={activeView}
            onClick={() => handleNavigation('/settings')}
            icon={<SettingsIcon />}
            label="Settings"
          />
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 bg-slate-900/50 rounded-lg text-center">
          <p className="text-sm text-slate-400">© 2024 Your Name</p>
          <p className="text-xs text-slate-500 mt-1">Powered by React & Gemini</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
