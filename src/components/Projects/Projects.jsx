import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Projects.css'; // Ensure the correct path to your CSS file

const Projects = ({ projects = [], onProjectSelect, onBack }) => {
    const [projectList, setProjectList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Projects prop received:", projects); // Log the received prop
        setLoading(true);

        if (Array.isArray(projects)) {
            // Flatten the project data if needed
            const flattenedProjects = projects.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                // Optionally, flatten other nested data if needed
            }));

            setProjectList(flattenedProjects);
        } else {
            console.error("Expected an array but got:", projects);
            setProjectList([]);
        }
        setLoading(false);
    }, [projects]);

    return (
        <div className="projects-container">
            <h2>Projects</h2>
            <button className="back-button" onClick={onBack}>Back</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="projects-list">
                    {projectList.length === 0 ? (
                        <p>No projects available.</p>
                    ) : (
                        projectList.map((project) => (
                            <div
                                key={project.id}
                                className="project-item"
                            >
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                                <button
                                    className="open-button"
                                    onClick={() => onProjectSelect(project.id)}
                                >
                                    Open
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

Projects.propTypes = {
    projects: PropTypes.array.isRequired,
    onProjectSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default Projects;
