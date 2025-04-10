import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Mock data for courses created by the manager (replace with API call)
const mockOwnedCourses = [
    { id: 'c1', name: 'Introduction to React', assigned: 15, completed: 8 },
    { id: 'c2', name: 'Advanced TypeScript', assigned: 10, completed: 2 },
    { id: 'c4', name: 'Docker Fundamentals', assigned: 20, completed: 18 },
];

// Mock general stats (replace with API call)
const mockStats = {
    totalEmployees: 50,
    activeCourses: 3,
    overallCompletion: 65, // Percentage
};

const EditIcon = () => <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>;
const AssignIcon = () => <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>;
const ChartBarIcon = () => <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a1 1 0 001 1h1.172l1.513 1.513a1 1 0 001.414 0l4-4a1 1 0 000-1.414l-1.586-1.586a1 1 0 00-1.414 0L10 10.586 8.707 9.293a1 1 0 00-1.414 0L3 13.586V5a1 1 0 00-.293-.707L2 3.586A1 1 0 001 4v9a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1zm14-1a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V3a1 1 0 00-1-1h-1z" clipRule="evenodd"></path></svg>;


const ManagerDashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API calls
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace with actual API calls
                // GET /api/manager/courses
                // GET /api/manager/stats
                await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
                setCourses(mockOwnedCourses);
                setStats(mockStats);
            } catch (err) {
                console.error("Failed to fetch manager data:", err);
                setError('Could not load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-error p-4">{error}</div>;
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-secondary-dark">Manager Dashboard</h1>
                <Link
                    to="/manager/course/new"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    Create New Course
                </Link>
            </div>

            {/* Statistics Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-surface p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-secondary-dark">Total Employees</h3>
                        <p className="text-3xl font-bold text-primary">{stats.totalEmployees}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-secondary-dark">Active Courses</h3>
                        <p className="text-3xl font-bold text-primary">{stats.activeCourses}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-secondary-dark">Overall Completion</h3>
                        <p className="text-3xl font-bold text-primary">{stats.overallCompletion}%</p>
                         {/* Consider adding a small progress bar here too */}
                    </div>
                </div>
            )}

            {/* Course List */}
            <h2 className="text-2xl font-semibold text-secondary-dark mb-4">My Courses</h2>
            {courses.length === 0 ? (
                <p className="text-secondary bg-surface p-4 rounded-lg shadow">You haven't created any courses yet.</p>
            ) : (
                <div className="bg-surface rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Course Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Assigned</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Completed</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-dark">{course.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{course.assigned}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{course.completed}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link to={`/manager/course/edit/${course.id}`} className="text-primary hover:text-primary-dark" title="Edit Course"><EditIcon /> Edit</Link>
                                        <Link to={`/manager/course/assign/${course.id}`} className="text-green-600 hover:text-green-800" title="Assign Course"><AssignIcon /> Assign</Link>
                                        {/* Add link/button for viewing detailed stats per course */}
                                        <button onClick={() => alert(`TODO: Show stats for ${course.name}`)} className="text-indigo-600 hover:text-indigo-800" title="View Stats"><ChartBarIcon/>Stats</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboardPage;