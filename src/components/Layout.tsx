import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/useAuthContext";
import { useUserClaims } from "../hooks/useUserClaims";

interface NavItem {
  to: string;
  label: string;
  visible?: boolean;
}

const variantStyles = {
  desktop: {
    base: "flex items-center px-3 py-2 text-sm font-medium rounded transition-colors",
    active: "bg-[var(--color-nav-active)] text-white",
    inactive: "text-gray-300 hover:bg-[var(--color-nav-hover)] hover:text-white",
  },
  mobile: {
    base: "block px-4 py-2.5 text-sm font-medium rounded transition-colors",
    active: "bg-[var(--color-nav-active)] text-white border-l-3 border-[var(--color-primary)]",
    inactive: "text-gray-300 hover:bg-[var(--color-nav-hover)] hover:text-white",
  },
} as const;

function AppNavLink({
  to,
  children,
  variant,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const styles = variantStyles[variant];

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.base} ${isActive ? styles.active : styles.inactive}`
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
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

  const mainNavItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/registration-numbers", label: "Registration Numbers" },
    { to: "/edit-reservations", label: "Edit Reservations", visible: isTeamLeader() },
    { to: "/override-requests", label: "Override Requests", visible: isTeamLeader() },
    { to: "/users", label: "Users", visible: isUserAdmin() },
  ];

  const secondaryNavItems: NavItem[] = [
    { to: "/profile", label: firstName || "Profile" },
    { to: "/faq", label: "FAQ" },
  ];

  const visibleMainItems = mainNavItems.filter((item) => item.visible !== false);
  const allNavItems = [...visibleMainItems, ...secondaryNavItems];

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-[var(--color-nav)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {visibleMainItems.map((item) => (
                <AppNavLink key={item.to} to={item.to} variant="desktop">
                  {item.label}
                </AppNavLink>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-1">
              {secondaryNavItems.map((item) => (
                <AppNavLink key={item.to} to={item.to} variant="desktop">
                  {item.label}
                </AppNavLink>
              ))}
              <button
                onClick={handleLogout}
                className={`${variantStyles.desktop.base} ${variantStyles.desktop.inactive}`}
              >
                Logout
              </button>
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
                {allNavItems.map((item) => (
                  <AppNavLink
                    key={item.to}
                    to={item.to}
                    variant="mobile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </AppNavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className={`${variantStyles.mobile.base} ${variantStyles.mobile.inactive} w-full text-left`}
                >
                  Logout
                </button>
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
