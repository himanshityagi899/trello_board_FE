// src/components/KanbanBoard/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import './TaskForm.css';

const TaskForm = ({ setTasks, toggleTaskForm }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('BACKLOG');
    const [assignedUserEmail, setAssignedUserEmail] = useState('');
    const [projectName, setProjectName] = useState('');
    const [tags, setTags] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/tasks', {
                name,
                description,
                status,
                assignedUserEmail,
                projectName,
                tags: tags.split(',').map(tag => tag.trim()), // Assuming tags are comma-separated
                dueDate,
            });
            setTasks(prevTasks => [...prevTasks, response.data]);
            toggleTaskForm();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="task-form">
            <h4>Create New Task</h4>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="BACKLOG">Backlog</option>
                    <option value="IN_DISCUSSION">InDiscussion</option>
                    <option value="IN_PROGRESS">InProgress</option>
                    <option value="DONE">Done</option>
                </select>
                <input
                    type="email"
                    placeholder="Assigned User Email"
                    value={assignedUserEmail}
                    onChange={(e) => setAssignedUserEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select value={projectName} onChange={(e) => setProjectName(e.target.value)} required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.name}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Create Task</button>
            </form>
            <button className="cancel-button" onClick={toggleTaskForm}>Cancel</button>
        </div>
    );
};

export default TaskForm;
