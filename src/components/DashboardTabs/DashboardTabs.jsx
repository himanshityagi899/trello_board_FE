import React, { useState, useEffect } from 'react';
import Projects from '../Projects/Projects'; // Ensure the correct path to Projects component
import './DashboardTabs.css';
import axios from "../../axiosConfig";
import TaskManager from '../TaskManager/TaskManager';

const DashboardTabs = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [view, setView] = useState('buttons'); // 'buttons', 'create', 'list', 'details'
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                console.log("Projects response:", response.data); // Debugging line
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setView('buttons');
    };

    const handleBack = () => {
        setView('buttons');
        setSelectedProjectId(null);
    };

    const handleProjectSelect = (projectId) => {
        setSelectedProjectId(projectId);
        setView('details');
    };

    const handleProjectCreated = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
            setView('list');
        } catch (error) {
            console.error('Error fetching updated projects:', error);
        }
    };

    const renderProjectsSection = () => (
        <div className="projects-tabs">
            {view === 'buttons' && (
                <>
                    <button className="fixed-create-project-button" onClick={() => setView('create')}>Create Project</button>
                    <div className="tabs-buttons">
                        <button onClick={() => setView('list')}>List of Projects</button>
                    </div>
                </>
            )}
            {view === 'create' && <CreateProjectForm onProjectCreated={handleProjectCreated} />}
            {view === 'list' && (
                <Projects 
                    projects={projects} 
                    onProjectSelect={handleProjectSelect} 
                    onBack={handleBack}
                />
            )}
            {view === 'details' && <ProjectDetails projectId={selectedProjectId} setView={setView} setActiveTab={setActiveTab} />}
        </div>
    );

    const renderTasksSection = () => (
        <div className="tasks-tabs">
            <TaskManager />
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="tab-nav">
                <button 
                    className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('projects')}
                >
                    Projects
                </button>
                <button 
                    className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('tasks')}
                >
                    Tasks
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'projects' && renderProjectsSection()}
                {activeTab === 'tasks' && renderTasksSection()}
            </div>
        </div>
    );
};

const CreateProjectForm = ({ onProjectCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        try {
            await axios.post('/api/projects', { name, description });
            onProjectCreated(); // Fetch updated projects list after creation
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="create-project-form">
            <h3>Create Project</h3>
            <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreate}>Create</button>
            <button onClick={() => onProjectCreated()}>Close</button>
        </div>
    );
};

const ProjectDetails = ({ projectId, setView, setActiveTab }) => {
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                // const response = await axios.get(`/api/projects/${projectId}`);
                // setProject(response.data);
                // const tasksResponse = await axios.get(`/api/projects/${projectId}/tasks`);
                // setTasks(tasksResponse.data);

                const response = await axios.get(`/api/projects/${projectId}`);
                const projectData = {
                    id: response.data.id,
                    name: response.data.name, // Correctly map name
                    description: response.data.description // Correctly map description
                };
                setProject(projectData);

                const tasksResponse = await axios.get(`/api/projects/${projectId}/tasks`);
                setTasks(tasksResponse.data);
                
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (!project) return <div>Loading...</div>;

    const handleCreateTaskClick = () => {
        setActiveTab('tasks');
        setShowCreateTaskForm(true);
    };

    const handleCreateTask = async (taskName) => {
        try {
            await axios.post('/api/tasks', { projectId, name: taskName });

            const tasksResponse = await axios.get(`/api/projects/${projectId}/tasks`);
            setTasks(tasksResponse.data);
            setShowCreateTaskForm(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="project-details">
            <h3>{project.name}</h3>
            {showCreateTaskForm ? (
                <CreateTaskForm onCreateTask={handleCreateTask} onCancel={() => setShowCreateTaskForm(false)} />
            ) : (
                <>
                    <button className="create-task-button" onClick={handleCreateTaskClick}>
                        Create Task
                    </button>
                    <button onClick={() => setView('list')}>Back to List</button>
                    {tasks.length > 0 }
                </>
            )}
        </div>
    );
};

const CreateTaskForm = ({ onCreateTask, onCancel }) => {
    const [name, setName] = useState('');

    const handleCreate = () => {
        onCreateTask(name);
    };

    return (
        <div className="create-task-form">
            <input
                type="text"
                placeholder="Task Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleCreate}>Create</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default DashboardTabs;
