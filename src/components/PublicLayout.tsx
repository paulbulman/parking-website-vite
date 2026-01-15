import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            <div className="flex space-x-8">
              <div className="flex items-center px-3 py-2 text-sm font-medium">
                Home
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
}

export default PublicLayout;
