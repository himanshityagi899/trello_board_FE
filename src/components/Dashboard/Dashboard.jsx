
import React, { useState, useEffect } from 'react';
import { AiOutlineAppstore, AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import { MdMale, MdFemale } from 'react-icons/md';
import './Dashboard.css';
import DashboardTabs from '../DashboardTabs/DashboardTabs';

const Dashboard = () => {
    const [username, setUsername] = useState(''); // Default to empty string
    const [showTabs, setShowTabs] = useState(false);

    useEffect(() => {
        // Fetch the logged-in user's name from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
            setUsername(user.name);
        } else {
            // Handle case where user is not found
            setUsername('Guest');
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="navbar">
                <div className="navbar-content">
                    <div className="logo-section">
                        <div className="logo-icon"><AiOutlineAppstore /></div>
                        <div className="logo-text">Sprint Plans</div>
                    </div>
                    <div className="profile-section">
                        <MdMale className="avatar male-avatar" />
                        <MdFemale className="avatar female-avatar" />
                        <div className="search-add-section">
                            <input type="text" className="search-box" placeholder="Search..." />
                            <AiOutlinePlus className="add-icon" />
                        </div>
                    </div>
                </div>
                <div className="nav-links">
                    <ul className="nav-links-list">
                        <li>Overview</li>
                        <li>List</li>
                        <li>Calendar</li>
                        <li onClick={() => setShowTabs(true)}>Dashboard</li>
                        <li>More...</li>
                    </ul>
                </div>
            </div>
            {showTabs && <DashboardTabs />}
            {!showTabs && (
                <div className="greeting-container">
                    <div className="greeting-message">Hello, {username}!</div>
                    <div className="welcome-message">Welcome to TrelloBoard</div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
