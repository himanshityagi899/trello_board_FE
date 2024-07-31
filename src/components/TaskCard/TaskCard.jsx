// src/components/KanbanBoard/TaskCard.jsx

import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task }) => (
    <div className="task-card">
        <h4>{task.name}</h4>
        <p>{task.description}</p>
        <p><strong>Due:</strong> {task.dueDate}</p>
        <p><strong>Assigned to:</strong> {task.assignedUser}</p>
    </div>
);

export default TaskCard;
