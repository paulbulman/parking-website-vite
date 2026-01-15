import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <NavLink to="/" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Home
              </NavLink>
              <NavLink to="/registration-numbers" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Registration Numbers
              </NavLink>
              <NavLink to="/edit-reservations" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Edit Reservations
              </NavLink>
              <NavLink to="/override-requests" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Override Requests
              </NavLink>
              <NavLink to="/users" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Users
              </NavLink>
            </div>
            <div className="hidden md:flex space-x-8">
              <NavLink to="/profile" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Profile
              </NavLink>
              <NavLink to="/faq" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                FAQ
              </NavLink>
              <NavLink to="/logout" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
                Logout
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3">
              <div className="flex flex-col space-y-1">
                <NavLink to="/" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/registration-numbers" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Registration Numbers
                </NavLink>
                <NavLink to="/edit-reservations" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Edit Reservations
                </NavLink>
                <NavLink to="/override-requests" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Override Requests
                </NavLink>
                <NavLink to="/users" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Users
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </NavLink>
                <NavLink to="/faq" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </NavLink>
                <NavLink to="/logout" className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'}`} onClick={() => setMobileMenuOpen(false)}>
                  Logout
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
