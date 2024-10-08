// src/components/Register/Register.jsx

import React, { useState } from 'react';
import './Register.css';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }
        
        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }

        if (password.length < 5) {
            setError('Password must be at least 5 characters long.');
            return;
        }

        try {
            const response = await axios.post('/api/users/register', { name, email, password });
            console.log('Server response:', response); // Log response for debugging
            if (response.data) {
                navigate('/login'); // Redirect to login page after successful registration
            }
        } catch (error) {
            console.error('Registration failed:', error);
            console.error('Error response:', error.response); // Log error response for debugging
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="bubble bubble-top-left"></div>
            <div className="bubble bubble-bottom-right"></div>
        </div>
    );
};

export default Register;
