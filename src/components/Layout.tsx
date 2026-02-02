import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/useAuthContext";
import { useUserClaims } from "../hooks/useUserClaims";

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
        `flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
          isActive
            ? "bg-[var(--color-nav-active)] text-white"
            : "text-gray-300 hover:bg-[var(--color-nav-hover)] hover:text-white"
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
        `block px-4 py-2.5 text-sm font-medium rounded transition-colors ${
          isActive
            ? "bg-[var(--color-nav-active)] text-white border-l-3 border-[var(--color-primary)]"
            : "text-gray-300 hover:bg-[var(--color-nav-hover)] hover:text-white"
        }`
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

function LogoutButton({
  onClick,
  isMobile = false,
}: {
  onClick: () => void;
  isMobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium text-gray-300 rounded transition-colors hover:bg-[var(--color-nav-hover)] hover:text-white ${
        isMobile ? "block w-full text-left px-4 py-2.5" : "px-3 py-2"
      }`}
    >
      Logout
    </button>
  );
}

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { isTeamLeader, isUserAdmin, firstName } = useUserClaims();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-[var(--color-nav)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <DesktopNavLink to="/">Home</DesktopNavLink>
              <DesktopNavLink to="/registration-numbers">
                Registration Numbers
              </DesktopNavLink>
              {isTeamLeader() && (
                <DesktopNavLink to="/edit-reservations">
                  Edit Reservations
                </DesktopNavLink>
              )}
              {isTeamLeader() && (
                <DesktopNavLink to="/override-requests">
                  Override Requests
                </DesktopNavLink>
              )}
              {isUserAdmin() && (
                <DesktopNavLink to="/users">Users</DesktopNavLink>
              )}
            </div>
            <div className="hidden md:flex items-center gap-1">
              <DesktopNavLink to="/profile">
                {firstName || "Profile"}
              </DesktopNavLink>
              <DesktopNavLink to="/faq">FAQ</DesktopNavLink>
              <LogoutButton onClick={handleLogout} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded text-gray-300 hover:bg-[var(--color-nav-hover)] hover:text-white transition-colors"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
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
            <div className="md:hidden pb-4 pt-2 border-t border-gray-700">
              <div className="flex flex-col gap-1">
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink
                  to="/registration-numbers"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registration Numbers
                </MobileNavLink>
                {isTeamLeader() && (
                  <MobileNavLink
                    to="/edit-reservations"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Edit Reservations
                  </MobileNavLink>
                )}
                {isTeamLeader() && (
                  <MobileNavLink
                    to="/override-requests"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Override Requests
                  </MobileNavLink>
                )}
                {isUserAdmin() && (
                  <MobileNavLink
                    to="/users"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Users
                  </MobileNavLink>
                )}
                <MobileNavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {firstName || "Profile"}
                </MobileNavLink>
                <MobileNavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </MobileNavLink>
                <LogoutButton onClick={handleLogout} isMobile />
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-[var(--color-text-muted)]">
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.en.html"
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              GNU General Public License v3
            </a>{" "}
            |{" "}
            <NavLink
              to="/privacy"
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Privacy Policy
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
