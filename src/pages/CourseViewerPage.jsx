import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// --- Mock Data & API Calls ---

// Combine lesson/task data similar to CourseEditorPage's mock for structure
const mockCourseContent = {
    c1: {
        name: 'Introduction to React',
        items: [
            { id: 'l1', type: 'lesson', title: 'What is React?', content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.' },
            { id: 't1', type: 'task', question: 'What function renders a React element into the DOM?', answer: 'ReactDOM.render' },
            { id: 'l2', type: 'lesson', title: 'Components and Props', content: 'Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. Props are inputs to components.' },
            { id: 't2', type: 'task', question: 'How do you pass data from a parent component to a child component?', answer: 'props' },
        ]
    },
    c3: {
        name: 'Advanced CSS Techniques',
        items: [
            { id: 'l10', type: 'lesson', title: 'CSS Grid Layout', content: 'CSS Grid Layout is a two-dimensional layout system for the web...' },
            { id: 'l11', type: 'lesson', title: 'Flexbox vs Grid', content: 'Flexbox is mainly for one-dimensional layouts, while Grid is for two-dimensional layouts...' },
            { id: 't10', type: 'task', question: 'Which CSS property defines the columns and rows of the grid?', answer: 'grid-template-columns' }, // Example answer might need refinement for real use
        ]
    },
    // Add course c5 if needed
    c5: {
        name: 'Project Management Basics',
        items: [
             { id: 'l20', type: 'lesson', title: 'What is Project Management?', content: 'It\'s the application of processes, methods, skills, knowledge and experience to achieve specific project objectives...' },
             { id: 't20', type: 'task', question: 'What does "Scope Creep" mean in project management?', answer: 'Uncontrolled changes or continuous growth in a project\'s scope' },
        ]
    }
};

// Simulate fetching course content for the employee
const fetchCourseForEmployee = async (courseId) => {
    console.log("Fetching course content for employee:", courseId);
    await new Promise(resolve => setTimeout(resolve, 400));
    if (mockCourseContent[courseId]) {
        return mockCourseContent[courseId];
    } else {
        throw new Error("Course content not found");
    }
};

// Simulate fetching employee progress for this course
const fetchEmployeeProgress = async (courseId) => {
    console.log("Fetching progress for course:", courseId);
    await new Promise(resolve => setTimeout(resolve, 150));
    // Mock: Return the index of the item the employee is currently on, and completed task IDs
    // Let's say for c1, they completed t1 but are currently on l2 (index 2)
    if (courseId === 'c1') return { currentItemIndex: 2, completedTasks: ['t1'] };
    // For c3, they are at the start
    if (courseId === 'c3') return { currentItemIndex: 0, completedTasks: [] };
    // For c5, they completed everything (index beyond last item)
    if (courseId === 'c5') return { currentItemIndex: mockCourseContent.c5.items.length, completedTasks: ['t20'] };

    return { currentItemIndex: 0, completedTasks: [] }; // Default start
};

// Simulate submitting an answer
const submitTaskAnswer = async (courseId, taskId, answer) => {
    console.log("Submitting answer for task:", taskId, "in course:", courseId, "Answer:", answer);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Find the task in mock data to check the answer
    const course = mockCourseContent[courseId];
    const task = course?.items.find(item => item.id === taskId && item.type === 'task');
    if (task) {
        // Simple case-insensitive comparison for mock
        const isCorrect = task.answer.toLowerCase() === answer.toLowerCase();
        console.log("Mock check:", isCorrect ? "Correct" : "Incorrect");
        return { correct: isCorrect };
    }
    return { correct: false }; // Task not found
};

// Simulate updating progress (e.g., moving to next item)
const updateEmployeeProgress = async (courseId, newIndex, completedTaskId = null) => {
    console.log("Updating progress for course:", courseId, "to index:", newIndex, "Completed task:", completedTaskId);
    // In a real app, this would update the backend state.
    // For mock, we don't need to do anything here as state is managed locally after fetch.
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
};


const CourseViewerPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState(null); // { name, items: [] }
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: 'success' or 'error'
    const [isTaskCorrect, setIsTaskCorrect] = useState(false); // Track if current task answer was correct
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch course content and progress
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                const [course, progress] = await Promise.all([
                    fetchCourseForEmployee(courseId),
                    fetchEmployeeProgress(courseId)
                ]);
                setCourseData(course);
                setCurrentItemIndex(progress.currentItemIndex);
                setCompletedTasks(new Set(progress.completedTasks));
            } catch (err) {
                console.error("Error loading course viewer data:", err);
                setError('Failed to load course content or progress. Please try again.');
                setCourseData(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    // Derived state for the current item being viewed
    const currentItem = useMemo(() => {
        if (!courseData || !courseData.items || currentItemIndex >= courseData.items.length) {
             // Handle course completion or edge cases
             if (courseData && currentItemIndex >= courseData.items.length) return { type: 'completed' };
             return null;
        }
        return courseData.items[currentItemIndex];
    }, [courseData, currentItemIndex]);

    // Reset feedback and answer when navigating
    useEffect(() => {
        setUserAnswer('');
        setFeedback({ message: '', type: '' });
        setIsTaskCorrect(false); // Reset correctness flag
    }, [currentItemIndex]); // Run when item changes

    const handleCheckAnswer = async () => {
        if (!currentItem || currentItem.type !== 'task' || submitting) return;

        setSubmitting(true);
        setFeedback({ message: '', type: '' });
        try {
            const result = await submitTaskAnswer(courseId, currentItem.id, userAnswer);
            if (result.correct) {
                setFeedback({ message: 'Correct!', type: 'success' });
                setIsTaskCorrect(true);
                // Mark task as completed locally and potentially update backend
                const newCompleted = new Set(completedTasks).add(currentItem.id);
                setCompletedTasks(newCompleted);
                // Update overall progress if needed (e.g., tell backend task is done)
                // await updateEmployeeProgress(courseId, currentItemIndex, currentItem.id); // Optional fine-grained update
            } else {
                setFeedback({ message: 'Incorrect. Please try again.', type: 'error' });
                setIsTaskCorrect(false);
            }
        } catch (err) {
            console.error("Error submitting answer:", err);
            setFeedback({ message: 'Error checking answer. Please try again later.', type: 'error' });
            setIsTaskCorrect(false);
        } finally {
            setSubmitting(false);
        }
    };

    const goToItem = async (newIndex) => {
        // Prevent going past the end or before the beginning
        if (!courseData || newIndex < 0 || newIndex > courseData.items.length) return;

         // Prevent moving forward from an uncompleted task
        if (currentItem && currentItem.type === 'task' && newIndex > currentItemIndex && !isTaskCorrect && !completedTasks.has(currentItem.id)) {
            setFeedback({ message: 'Please answer the current task correctly before proceeding.', type: 'error'});
            return;
        }

        setCurrentItemIndex(newIndex);
        // Update backend about the new position
        await updateEmployeeProgress(courseId, newIndex);
    };

    const handleNext = () => {
        goToItem(currentItemIndex + 1);
    };

    const handlePrevious = () => {
        goToItem(currentItemIndex - 1);
    };

    // Calculate progress percentage
    const progressPercent = useMemo(() => {
        if (!courseData || !courseData.items || courseData.items.length === 0) return 0;
         // Progress based on reaching the end, or current index relative to total items
        if (currentItemIndex >= courseData.items.length) return 100;
        return Math.floor((currentItemIndex / courseData.items.length) * 100);
    }, [courseData, currentItemIndex]);


    if (loading) {
        return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-error p-4">{error}</div>;
    }

    if (!courseData || !currentItem) {
         return <div className="text-center text-secondary p-4">Course data not available. <Link to="/employee/dashboard" className="text-primary hover:underline">Back to Dashboard</Link></div>;
    }


    const isLastItem = currentItemIndex === courseData.items.length - 1;
    // Enable Next if it's a lesson, or if it's a task that's already completed OR just answered correctly
    const canGoNext = currentItem.type === 'lesson' || completedTasks.has(currentItem?.id) || isTaskCorrect;


    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-dark mb-1">{courseData.name}</h1>
                     {currentItem.type !== 'completed' && (
                        <p className="text-sm text-secondary">
                             Item {currentItemIndex + 1} of {courseData.items.length}
                        </p>
                     )}
                </div>
                <Link
                    to="/employee/dashboard"
                    className="text-sm text-primary hover:underline whitespace-nowrap ml-4"
                >
                    &larr; Back to My Courses
                </Link>
            </div>

             {/* Progress Bar */}
            <div className="mb-6">
                 <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-width duration-300 ease-in-out"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <p className="text-sm text-right text-primary font-medium mt-1">{progressPercent}% Complete</p>
            </div>


            <div className="bg-surface p-6 rounded-lg shadow-md min-h-[300px] flex flex-col justify-between">
                {/* Content Area */}
                <div>
                    {currentItem.type === 'lesson' && (
                        <>
                            <h2 className="text-xl font-semibold text-secondary-dark mb-3">{currentItem.title}</h2>
                            <div className="prose max-w-none text-secondary-dark">
                                <p>{currentItem.content}</p> {/* Use markdown renderer here in real app */}
                            </div>
                        </>
                    )}

                    {currentItem.type === 'task' && (
                        <>
                            <h2 className="text-xl font-semibold text-secondary-dark mb-3">Task</h2>
                            <p className="text-secondary-dark mb-4">{currentItem.question}</p>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                                placeholder="Enter your answer"
                            />
                            {feedback.message && (
                                <p className={`text-sm mt-2 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{feedback.message}</p>
                            )}
                            <button
                                type="button"
                                onClick={handleCheckAnswer}
                                disabled={submitting}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md mt-4"
                            >
                                {submitting ? 'Checking...' : 'Submit Answer'}
                            </button>
                        </>
                    )}

                    {currentItem.type === 'completed' && (
                        <p className="text-xl font-bold text-secondary-dark">Congratulations, you have completed the course!</p>
                    )}
                </div>
                <div className="mt-4 flex justify-between">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentItemIndex === 0}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded-md"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseViewerPage;