import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// --- Mock Data Fetching ---
const mockCourseData = {
    c1: {
        name: 'Introduction to React',
        description: 'Learn the fundamentals of React.',
        deadline: '2024-12-31',
        lessons: [
            { id: 'l1', title: 'What is React?', content: 'React is a JavaScript library...' },
            { id: 'l2', title: 'Components and Props', content: 'Components let you split the UI...' }
        ],
        tasks: [
            { id: 't1', question: 'What function renders a React element into the DOM?', answer: 'ReactDOM.render' }
        ]
    },
    // Add more mock courses if needed for editing
};

const fetchCourseDetails = async (courseId) => {
    console.log("Fetching course details for:", courseId);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    if (mockCourseData[courseId]) {
        return mockCourseData[courseId];
    } else {
        throw new Error("Course not found");
    }
};

const saveCourse = async (courseData) => {
    console.log("Saving course:", courseData);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    // In a real app, this would return the saved course data (possibly with generated IDs)
    const newId = courseData.id || `c${Date.now()}`; // Mock ID generation
    return { ...courseData, id: newId };
};

const deleteLesson = async (courseId, lessonId) => {
     console.log(`Deleting lesson ${lessonId} from course ${courseId}`);
     await new Promise(resolve => setTimeout(resolve, 200));
     return true; // Simulate success
}

const deleteTask = async (courseId, taskId) => {
     console.log(`Deleting task ${taskId} from course ${courseId}`);
     await new Promise(resolve => setTimeout(resolve, 200));
     return true; // Simulate success
}


// --- Helper Components ---
const LessonItem = ({ lesson, onEdit, onDelete }) => (
    <div className="flex justify-between items-center p-3 bg-gray-50 border rounded mb-2">
        <span>{lesson.title}</span>
        <div>
            <button onClick={() => onEdit(lesson)} className="text-sm text-blue-600 hover:underline mr-2">Edit</button>
            <button onClick={() => onDelete(lesson.id)} className="text-sm text-red-600 hover:underline">Delete</button>
        </div>
    </div>
);

const TaskItem = ({ task, onEdit, onDelete }) => (
    <div className="flex justify-between items-center p-3 bg-gray-50 border rounded mb-2">
        <span>{task.question.substring(0, 50)}...</span>
        <div>
            <button onClick={() => onEdit(task)} className="text-sm text-blue-600 hover:underline mr-2">Edit</button>
            <button onClick={() => onDelete(task.id)} className="text-sm text-red-600 hover:underline">Delete</button>
        </div>
    </div>
);

// --- Main Component ---
const CourseEditorPage = ({ mode }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isEditMode = mode === 'edit';

    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    // const [deadline, setDeadline] = useState(''); // Add later if needed
    const [lessons, setLessons] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [currentLesson, setCurrentLesson] = useState({ id: null, title: '', content: '' });
    const [currentTask, setCurrentTask] = useState({ id: null, question: '', answer: '' });
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode && courseId) {
            setLoading(true);
            fetchCourseDetails(courseId)
                .then(data => {
                    setCourseName(data.name);
                    setDescription(data.description);
                    // setDeadline(data.deadline);
                    setLessons(data.lessons || []);
                    setTasks(data.tasks || []);
                    setError('');
                })
                .catch(err => {
                    console.error("Error fetching course:", err);
                    setError('Failed to load course data.');
                })
                .finally(() => setLoading(false));
        } else {
             // Reset form for 'create' mode
             setCourseName('');
             setDescription('');
             setLessons([]);
             setTasks([]);
             setError('');
             setLoading(false);
        }
        // Ensure modals are closed when switching between create/edit or loading new data
        setIsLessonModalOpen(false);
        setIsTaskModalOpen(false);
    }, [mode, courseId, isEditMode]); // Depend on mode and courseId

    const handleSaveLesson = () => {
        if (!currentLesson.title || !currentLesson.content) return; // Basic validation
        if (currentLesson.id) { // Editing existing
            setLessons(lessons.map(l => l.id === currentLesson.id ? { ...currentLesson } : l));
        } else { // Adding new
            setLessons([...lessons, { ...currentLesson, id: `l${Date.now()}` }]); // Mock ID
        }
        closeLessonModal();
    };

     const handleSaveTask = () => {
        if (!currentTask.question || !currentTask.answer) return; // Basic validation
        if (currentTask.id) { // Editing existing
            setTasks(tasks.map(t => t.id === currentTask.id ? { ...currentTask } : t));
        } else { // Adding new
            setTasks([...tasks, { ...currentTask, id: `t${Date.now()}` }]); // Mock ID
        }
        closeTaskModal();
    };

    const openLessonModal = (lesson = null) => {
        setCurrentLesson(lesson ? { ...lesson } : { id: null, title: '', content: '' });
        setIsLessonModalOpen(true);
    };

    const closeLessonModal = () => {
        setIsLessonModalOpen(false);
        setCurrentLesson({ id: null, title: '', content: '' });
    };

    const openTaskModal = (task = null) => {
        setCurrentTask(task ? { ...task } : { id: null, question: '', answer: '' });
        setIsTaskModalOpen(true);
    };

    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
        setCurrentTask({ id: null, question: '', answer: '' });
    };

    const handleDeleteLesson = async (lessonId) => {
        try {
            await deleteLesson(courseId, lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
        } catch (err) {
            console.error("Error deleting lesson:", err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(courseId, taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const courseData = {
                name: courseName,
                description: description,
                lessons: lessons,
                tasks: tasks
            };
            const savedCourse = await saveCourse(courseData);
            console.log("Course saved:", savedCourse);
            navigate(`/manager/course/edit/${savedCourse.id}`);
        } catch (err) {
            console.error("Error saving course:", err);
            setError('Failed to save course data.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner />
                </div>
            ) : (
                <form onSubmit={handleSubmitCourse}>
                    <div className="mb-4">
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input
                            type="text"
                            id="courseName"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Lessons</h3>
                        <ul>
                            {lessons.map((lesson) => (
                                <LessonItem key={lesson.id} lesson={lesson} onEdit={openLessonModal} onDelete={handleDeleteLesson} />
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => openLessonModal()}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New Lesson
                        </button>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Tasks</h3>
                        <ul>
                            {tasks.map((task) => (
                                <TaskItem key={task.id} task={task} onEdit={openTaskModal} onDelete={handleDeleteTask} />
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => openTaskModal()}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New Task
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {saving ? 'Saving...' : 'Save Course'}
                    </button>
                </form>
            )}
            {isLessonModalOpen && (
                <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-md p-4">
                        <h2 className="text-xl font-bold mb-2">Edit Lesson</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700">Lesson Title</label>
                                <input
                                    type="text"
                                    id="lessonTitle"
                                    value={currentLesson.title}
                                    onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-700">Lesson Content</label>
                                <textarea
                                    id="lessonContent"
                                    value={currentLesson.content}
                                    onChange={(e) => setCurrentLesson({ ...currentLesson, content: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveLesson}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Save Lesson
                            </button>
                            <button
                                type="button"
                                onClick={closeLessonModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-md p-4">
                        <h2 className="text-xl font-bold mb-2">Edit Task</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="taskQuestion" className="block text-sm font-medium text-gray-700">Task Question</label>
                                <input
                                    type="text"
                                    id="taskQuestion"
                                    value={currentTask.question}
                                    onChange={(e) => setCurrentTask({ ...currentTask, question: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="taskAnswer" className="block text-sm font-medium text-gray-700">Task Answer</label>
                                <input
                                    type="text"
                                    id="taskAnswer"
                                    value={currentTask.answer}
                                    onChange={(e) => setCurrentTask({ ...currentTask, answer: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveTask}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Save Task
                            </button>
                            <button
                                type="button"
                                onClick={closeTaskModal}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseEditorPage;