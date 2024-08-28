import React, { useState } from 'react';
import './Login.css';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email) {
            setErrorMessage('Email is required.');
            return false;
        }
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email.');
            return false;
        }
        if (password.length < 5) {
            setErrorMessage('Password must be at least 5 characters.');
            return false;
        }
        setErrorMessage(''); // Clear error if all validations pass
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Stop submission if form validation fails
        }

        try {
            const response = await axios.post('/api/users/login', { email, password });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="background-shape">
                <div className="styled-text">Trello!</div>
            </div>
            <div className="form-side">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
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
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;
