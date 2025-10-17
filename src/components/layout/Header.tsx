import { useState } from 'react';
import { BellIcon, MenuIcon } from '../ui/Icons';
import { Fragment } from 'react/jsx-runtime';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 text-white">
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

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden bg-slate-800/90 backdrop-blur-md border-t border-slate-700/50 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-40 opacity-100 py-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          {isAuthenticated ? (
            <Fragment>
              <span className="text-sm text-gray-300">
                Welcome, <span className="font-semibold">{user?.fullName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
              >
                Logout
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-300 hover:text-indigo-400 transition duration-300"
              >
                Login
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
