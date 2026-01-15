import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function DesktopNavLink({ to, children }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          isActive ? 'bg-gray-900 border-b-2 border-blue-500' : 'hover:bg-gray-700'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavLink({ to, children, onClick }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 text-sm font-medium rounded-md ${
          isActive ? 'bg-gray-900 border-l-4 border-blue-500' : 'hover:bg-gray-700'
        }`
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <DesktopNavLink to="/">Home</DesktopNavLink>
              <DesktopNavLink to="/registration-numbers">Registration Numbers</DesktopNavLink>
              <DesktopNavLink to="/edit-reservations">Edit Reservations</DesktopNavLink>
              <DesktopNavLink to="/override-requests">Override Requests</DesktopNavLink>
              <DesktopNavLink to="/users">Users</DesktopNavLink>
            </div>
            <div className="hidden md:flex space-x-8">
              <DesktopNavLink to="/profile">Profile</DesktopNavLink>
              <DesktopNavLink to="/faq">FAQ</DesktopNavLink>
              <DesktopNavLink to="/logout">Logout</DesktopNavLink>
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
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/registration-numbers" onClick={() => setMobileMenuOpen(false)}>Registration Numbers</MobileNavLink>
                <MobileNavLink to="/edit-reservations" onClick={() => setMobileMenuOpen(false)}>Edit Reservations</MobileNavLink>
                <MobileNavLink to="/override-requests" onClick={() => setMobileMenuOpen(false)}>Override Requests</MobileNavLink>
                <MobileNavLink to="/users" onClick={() => setMobileMenuOpen(false)}>Users</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</MobileNavLink>
                <MobileNavLink to="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</MobileNavLink>
                <MobileNavLink to="/logout" onClick={() => setMobileMenuOpen(false)}>Logout</MobileNavLink>
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
