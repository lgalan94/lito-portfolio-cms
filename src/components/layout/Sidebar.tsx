import React from 'react';
import type { View } from '../../types';
import { DashboardIcon, ProjectsIcon, MessagesIcon, SkillsIcon, SettingsIcon, CodeBracketIcon } from '../ui/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
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

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/60 p-4 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <CodeBracketIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Portfolio CMS</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem view="dashboard" activeView={activeView} setActiveView={setActiveView} icon={<DashboardIcon />} label="Dashboard" />
        <NavItem view="projects" activeView={activeView} setActiveView={setActiveView} icon={<ProjectsIcon />} label="Projects" />
        <NavItem view="messages" activeView={activeView} setActiveView={setActiveView} icon={<MessagesIcon />} label="Messages" />
        <NavItem view="skills" activeView={activeView} setActiveView={setActiveView} icon={<SkillsIcon />} label="Skills" />
        <NavItem view="settings" activeView={activeView} setActiveView={setActiveView} icon={<SettingsIcon />} label="Settings" />
      </nav>
      <div className="mt-auto p-4 bg-slate-900/50 rounded-lg text-center">
          <p className="text-sm text-slate-400">© 2024 Your Name</p>
          <p className="text-xs text-slate-500 mt-1">Powered by React & Gemini</p>
      </div>
    </div>
  );
};

export default Sidebar;