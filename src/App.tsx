import { useState } from 'react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Home
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Registration Numbers
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Edit Reservations
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Override Requests
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Users
              </a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Profile
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                FAQ
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                Logout
              </a>
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
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Home
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Registration Numbers
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Edit Reservations
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Override Requests
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Users
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Profile
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  FAQ
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-md">
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div>
        <h1 className="text-3xl font-bold">Hello world!</h1>
      </div>
    </>
  );
}

export default App;
