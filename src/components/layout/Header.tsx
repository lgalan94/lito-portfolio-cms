import { useState } from 'react';
import { BellIcon, MenuIcon } from '../ui/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 text-white fixed w-full z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left Section — Brand + Menu Button */}
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* App Title or User Name */}
          <h1 className="text-lg md:text-2xl font-semibold truncate">
            {user?.fullName || 'My App'}
          </h1>
        </div>

        {/* Right Section — Notifications, Profile & Logout */}
        <div className="flex items-center space-x-4">
          <button
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-600">
            <img
              src={user?.profilePictureUrl || '/Profile.png'}
              alt={`${user?.fullName || 'User'} Profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Logout Button (Visible on Large Screens) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hidden lg:block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      
    </header>
  );
};

export default Header;
