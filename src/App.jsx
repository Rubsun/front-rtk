import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

// --- Page Components ---
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage')); 
const EmployeeDashboardPage = React.lazy(() => import('./pages/EmployeeDashboardPage'));
const ManagerDashboardPage = React.lazy(() => import('./pages/ManagerDashboardPage'));
const CourseEditorPage = React.lazy(() => import('./pages/CourseEditorPage')); 
const CourseAssignmentPage = React.lazy(() => import('./pages/CourseAssignmentPage'));
const CourseViewerPage = React.lazy(() => import('./pages/CourseViewerPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const HomePage = React.lazy(() => import('./pages/HomePage')); 

// --- Common Components ---
import LoadingSpinner from './components/Common/LoadingSpinner'; 

// --- Layout Component ---
import MainLayout from './components/Common/Layouts/MainLayout';

// --- Mock Auth Hook (Replace with actual API calls later) ---
const useMockAuth = () => {
    const getInitialUser = () => {
        try {
            const storedUser = localStorage.getItem('skillTrackerUser');
            if (storedUser) {
                return JSON.parse(storedUser);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('skillTrackerUser');
        }
        return null;
    };

    const [user, setUser] = useState(getInitialUser()); 

    const login = async (email, password) => {
        console.log("Simulating login for:", email);
        await new Promise(resolve => setTimeout(resolve, 500));
        const role = email.includes('manager') ? 'manager' : 'employee';
        const mockUser = { token: `fake-token-${Date.now()}`, role: role, name: email.split('@')[0] };
        localStorage.setItem('skillTrackerUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
    };

    const register = async (email, name, password, role) => {
        console.log("Simulating register:", { email, name, role });
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser = { token: `fake-token-${Date.now()}`, role: role, name: name };
        localStorage.setItem('skillTrackerUser', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
    }

    const logout = () => {
        console.log("Simulating logout");
        localStorage.removeItem('skillTrackerUser');
        setUser(null);
    };

    const authContextValue = useMemo(() => ({ user, login, register, logout }), [user]);

    return authContextValue;
};

// --- Protected Route Component ---
function ProtectedRoute({ allowedRoles }) {
    const { user } = React.useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />; 
}

function App() {
    const auth = useMockAuth();

    return (
        <AuthContext.Provider value={auth}>
            <React.Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> 

                    {/* Routes requiring authentication */}
                    <Route element={<ProtectedRoute allowedRoles={['employee', 'manager']} />}>
                        <Route element={<MainLayout />}> 
                            <Route path="/" element={<HomePage />} />

                            {/* Employee Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                                <Route path="employee/dashboard" element={<EmployeeDashboardPage />} />
                                <Route path="employee/course/:courseId" element={<CourseViewerPage />} />
                            </Route>

                            {/* Manager Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                                <Route path="manager/dashboard" element={<ManagerDashboardPage />} />
                                <Route path="manager/course/new" element={<CourseEditorPage key="new" mode="create" />} /> 
                                <Route path="manager/course/edit/:courseId" element={<CourseEditorPage key="edit" mode="edit" />} /> 
                                <Route path="manager/course/assign/:courseId" element={<CourseAssignmentPage />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* Catch-all Not Found Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </React.Suspense>
        </AuthContext.Provider>
    );
}

export default App;