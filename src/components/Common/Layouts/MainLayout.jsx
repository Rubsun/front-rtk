import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

// --- Placeholder Icons ---
const DashboardIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>;
const CourseIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z"></path></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const Sidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const commonLinkClasses = "flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-primary-dark hover:text-white rounded-md transition-colors duration-200";
    const activeLinkClasses = "bg-primary-dark text-white"; // Add this class for active link

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary-dark shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-center h-16 bg-primary-dark">
                     <span className="text-white text-xl font-semibold">Skill Tracker</span>
                     {/* Close button for mobile */}
                     <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-200 hover:text-white lg:hidden">
                         <CloseIcon />
                     </button>
                </div>
                <nav className="mt-6 px-2">
                    {user?.role === 'manager' && (
                        <>
                            <Link to="/manager/dashboard" className={commonLinkClasses} onClick={isOpen ? toggleSidebar : undefined}>
                                <DashboardIcon /><span className="mx-3">Dashboard</span>
                            </Link>
                            <Link to="/manager/course/new" className={commonLinkClasses} onClick={isOpen ? toggleSidebar : undefined}>
                                <CourseIcon /><span className="mx-3">Create Course</span>
                            </Link>
                             {/* Add links for Course List, Assignment, Stats */}
                        </>
                    )}
                    {user?.role === 'employee' && (
                        <>
                            <Link to="/employee/dashboard" className={commonLinkClasses} onClick={isOpen ? toggleSidebar : undefined}>
                                <DashboardIcon /><span className="mx-3">My Courses</span>
                            </Link>
                            {/* Add other employee links if needed */}
                        </>
                    )}

                    {/* Logout always available */}
                    <button onClick={onLogout} className={`${commonLinkClasses} w-full text-left`}>
                        <LogoutIcon /><span className="mx-3">Logout</span>
                    </button>
                </nav>
                <div className="absolute bottom-0 left-0 w-full p-4 text-center text-gray-400 text-sm">
                    Logged in as: {user?.name} ({user?.role})
                </div>
            </div>
        </>
    );
};


const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
        if (isSidebarOpen) setIsSidebarOpen(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (!user) {
        // This should ideally not be reached due to ProtectedRoute, but as a safeguard:
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar based on role */}
            <Sidebar user={user} onLogout={handleLogout} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                 {/* Mobile Header */}
                 <header className="lg:hidden p-4 bg-surface shadow flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">{user.role === 'manager' ? 'Manager View' : 'Employee View'}</span>
                    <button onClick={toggleSidebar} className="text-secondary-dark hover:text-primary">
                         <MenuIcon />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
                    {/* Outlet renders the matched child route component */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

