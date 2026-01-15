import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Home
              </Link>
              <Link to="/registration-numbers" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Registration Numbers
              </Link>
              <Link to="/edit-reservations" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Edit Reservations
              </Link>
              <Link to="/override-requests" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Override Requests
              </Link>
              <Link to="/users" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Users
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/profile" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Profile
              </Link>
              <Link to="/faq" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                FAQ
              </Link>
              <Link to="/logout" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Logout
              </Link>
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
                <Link to="/" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/registration-numbers" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Registration Numbers
                </Link>
                <Link to="/edit-reservations" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Edit Reservations
                </Link>
                <Link to="/override-requests" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Override Requests
                </Link>
                <Link to="/users" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Users
                </Link>
                <Link to="/profile" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/faq" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </Link>
                <Link to="/logout" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md" onClick={() => setMobileMenuOpen(false)}>
                  Logout
                </Link>
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
