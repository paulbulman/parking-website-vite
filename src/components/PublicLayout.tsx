import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-[var(--color-nav)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14">
            <div className="flex items-center">
              <span className="text-sm font-medium text-white">
                Parking rota
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
