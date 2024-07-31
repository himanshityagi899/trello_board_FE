import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../../axiosConfig';
import './Kanban.css';

const Kanban = () => {
    const [tasks, setTasks] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        dueDate: '',
        assignedUserEmail: '',
        tags: [],
        status: 'Backlog' // Default status
    });

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

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.index === source.index && destination.droppableId === source.droppableId) return;

        const updatedTasks = [...tasks];
        const movedTask = updatedTasks.find(task => task.id === draggableId);
        movedTask.status = destination.droppableId;
        updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, movedTask);

        setTasks(updatedTasks);

        try {
            await axios.put(`/api/tasks/${movedTask.id}`, movedTask);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const addTask = async () => {
        try {
            const response = await axios.post('/api/tasks', newTask);
            setTasks(prevTasks => [...prevTasks, response.data]);
            setNewTask({
                name: '',
                description: '',
                dueDate: '',
                assignedUserEmail: '',
                tags: [],
                status: 'Backlog'
            });
            setShowTaskForm(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

    return (
        <div className="kanban-board">
            <div className="create-task-container">
                <button onClick={() => setShowTaskForm(!showTaskForm)}>+ Add Task</button>
                {showTaskForm && (
                    <div className="create-task-form">
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newTask.name}
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Task Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Assigned User Email"
                            value={newTask.assignedUserEmail}
                            onChange={(e) => setNewTask({ ...newTask, assignedUserEmail: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma-separated)"
                            value={newTask.tags}
                            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                        />
                        <select
                            value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        >
                            <option value="Backlog">Backlog</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                        <button onClick={addTask}>Add Task</button>
                        <button onClick={() => setShowTaskForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-columns">
                    {['Backlog', 'In Discussion', 'In Progress', 'Done'].map(status => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="kanban-column"
                                >
                                    <h3>{status}</h3>
                                    {getTasksByStatus(status).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="task-card"
                                                >
                                                    <h4>{task.name}</h4>
                                                    <p>{task.description}</p>
                                                    <p><strong>Due:</strong> {task.dueDate}</p>
                                                    <p><strong>Assigned to:</strong> {task.assignedUserEmail}</p>
                                                    <p><strong>Tags:</strong> {task.tags.join(', ')}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Kanban;
