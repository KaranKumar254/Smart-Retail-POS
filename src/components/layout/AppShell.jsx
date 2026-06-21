import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function AppShell() {
  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />
      <main className="min-h-screen px-4 pb-8 pt-4 lg:ml-[302px] lg:px-6">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
