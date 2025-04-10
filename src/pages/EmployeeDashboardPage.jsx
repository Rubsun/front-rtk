import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Mock data for assigned courses (replace with API call)
const mockAssignedCourses = [
    { id: 'c1', name: 'Introduction to React', progress: 30, deadline: '2024-06-15' },
    { id: 'c3', name: 'Advanced CSS Techniques', progress: 0, deadline: '2024-07-01' },
    { id: 'c5', name: 'Project Management Basics', progress: 100, deadline: '2024-05-20' },
];

const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

const EmployeeDashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace with actual API call: GET /api/employee/courses
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                setCourses(mockAssignedCourses);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setError('Could not load your courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-error p-4">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary-dark mb-6">My Assigned Courses</h1>
            {courses.length === 0 ? (
                <p className="text-secondary">You have no courses assigned yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-surface rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                            <div>
                                <h2 className="text-xl font-semibold text-secondary-dark mb-2">{course.name}</h2>
                                <p className="text-sm text-secondary mb-1">Deadline: {course.deadline}</p>
                                <div className="mt-4 mb-2">
                                     <ProgressBar progress={course.progress} />
                                     <p className="text-sm text-right text-primary font-medium mt-1">{course.progress}% Complete</p>
                                </div>
                            </div>
                            <Link
                                to={`/employee/course/${course.id}`}
                                className={`mt-4 inline-block text-center px-4 py-2 rounded-md text-white font-medium transition duration-150 ease-in-out ${course.progress === 100 ? 'bg-secondary hover:bg-secondary-dark cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                                aria-disabled={course.progress === 100}
                                onClick={(e) => course.progress === 100 && e.preventDefault()} // Prevent click if completed
                            >
                                {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Completed' : 'Continue Course'}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboardPage;