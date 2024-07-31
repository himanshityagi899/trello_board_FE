import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import TaskForm from '../TaskForm/TaskForm'; // Update the path as needed
import KanbanBoard from '../KanbanBoard/KanbanBoard'; // Update the path as needed
import './TaskManager.css';

const TaskManager = () => {

   

    const [tasks, setTasks] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const toggleTaskForm = () => {
        setShowTaskForm(!showTaskForm);
    };

    return (
        <div className="task-manager">
            <button onClick={toggleTaskForm}>Create New Task</button>
            {showTaskForm && <TaskForm setTasks={setTasks} toggleTaskForm={toggleTaskForm} />}
            <KanbanBoard tasks={tasks} setTasks={setTasks} />
        </div>
    );
};

export default TaskManager;
