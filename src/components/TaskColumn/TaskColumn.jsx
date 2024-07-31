// src/components/KanbanBoard/TaskColumn.jsx

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import './Kanban.css';

const TaskColumn = ({ columnId, tasks }) => (
    <Droppable droppableId={columnId}>
        {(provided) => (
            <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                <h3>{columnId}</h3>
                {tasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);

export default TaskColumn;
