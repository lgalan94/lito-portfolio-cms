import { useState, useRef } from 'react';
import { MenuIcon, ChevronDownIcon, LogOutIcon, UserIcon } from '../ui/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 text-white fixed w-full z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left Section — Brand + Menu Button */}
        <div className="flex items-center space-x-3">
          {setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden mr-6 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}

          <div className="w-10 h-10 shrink-0">
          <img
            src="/logo.png" 
            alt="Logo"
            className="w-full h-full object-contain"
          />
  </div>

  <h1 className="text-lg md:text-2xl font-semibold truncate">
    {user?.fullName || 'My App'}
  </h1>
        </div>

        {/* Right Section — Profile */}
        <div className="flex items-center space-x-4 relative">
          {/* Profile Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-600">
                <img
                  src={user?.profilePictureUrl || '/Profile.png'}
                  alt={`${user?.fullName || 'User'} Profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-sm font-semibold">{user?.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <ul className="py-1 text-sm">
                    <li>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-700 text-left transition"
                      >
                        <UserIcon className="w-4 h-4 text-slate-300" />
                        Profile
                      </button>
                    </li>

                    {isAuthenticated && (
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600/20 text-left text-red-400 transition"
                        >
                          <LogOutIcon className="w-4 h-4" />
                          Logout
                        </button>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
