import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import './KanbanBoard.css'; // Import your CSS file for styling
import imgTask1 from '../../assets/task1.jpeg';
import imgTask2 from '../../assets/task2.jpeg';
import imgTrello1 from '../../assets/trello1.png';
import imgTrello2 from '../../assets/trello2.jpeg';
import imgTech1 from '../../assets/tech1.jpeg';
import imgTech2 from '../../assets/tech2.jpeg';

const KanbanBoard = ({ tasks, setTasks }) => {
    const [projects, setProjects] = useState({});
    const statuses = ['BACKLOG', 'IN_DISCUSSION', 'IN_PROGRESS', 'DONE'];

    const images = {
        tasks: [imgTask1, imgTask2],
        trello: [imgTrello1, imgTrello2],
        technology: [imgTech1, imgTech2],
    };

    const getRandomImage = (category) => {
        const categoryImages = images[category] || [];
        return categoryImages[Math.floor(Math.random() * categoryImages.length)];
    };

    const getAvatar = () => {
        const avatars = [
            'https://randomuser.me/api/portraits/men/1.jpg',
            'https://randomuser.me/api/portraits/women/1.jpg'
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        try {
            // Update task status on backend
            await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });

            // Fetch updated tasks
            const response = await axios.get('/api/tasks/with-projects');
            setTasks(response.data);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/tasks/with-projects');
                const tasksWithProjects = response.data;
                const projectsMap = tasksWithProjects.reduce((acc, task) => {
                    acc[task.projectId] = task.projectName;
                    return acc;
                }, {});
                setProjects(projectsMap);
                setTasks(tasksWithProjects);
            } catch (error) {
                console.error('Error fetching tasks with projects:', error);
            }
        };

        fetchProjects();
    }, [setTasks]);

    return (
        <div className="kanban-board">
            {statuses.map(status => (
                <div
                    key={status}
                    className="kanban-column"
                    onDrop={(e) => handleDrop(e, status)}
                    onDragOver={allowDrop}
                >
                    <h3>{status.replace('_', ' ')}</h3>
                    {tasks.filter(task => task.status === status).map(task => (
                        <div
                            key={task.id}
                            className="kanban-card"
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                        >
                            <div className="card-content">
                                <div className="card-header">
                                    <h5 className="project-name">{task.projectName || 'Unknown Project'}</h5>
                                </div>
                                <div className="card-image">
                                    <img src={getRandomImage('technology')} alt="Random" />
                                </div>
                                <div className="card-details">
                                    <h4 className="task-name">{task.name}</h4>
                                    <div className="card-footer">
                                        <span className="tags">{task.tags.join(', ')}</span>
                                        <div className="date-and-avatar">
                                            <img className="avatar" src={getAvatar()} alt="Avatar" />
                                            <span className="due-date">{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
