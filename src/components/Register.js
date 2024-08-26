import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateContact = (contact) => {
        return /^\d{10}$/.test(contact); // Ensure it's a 10-digit number
    };

    const validatePassword = (password) => {
        return password.length >= 8; // Ensure password is at least 8 characters long
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !contact || !password || !confirmPassword || !termsAccepted) {
            setError('All fields are required, and you must accept the terms & conditions');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (!validateContact(contact)) {
            setError('Please enter a valid 10-digit contact number');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/auth/Register', {
                username,
                email,
                contact,
                password
            });
            alert(response.data.message);
            navigate('/login');
            setUsername('');
            setEmail('');
            setContact('');
            setPassword('');
            setConfirmPassword('');
            setTermsAccepted(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div>
                    <label>Username :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Contact :</label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Password :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Confirm Password :</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="check">
                    <input 
                        type="checkbox" 
                        id="login-check"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        disabled={loading}
                    />
                    <label>Accept Terms & conditions</label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <div className="lab1">
                    <label>Already have an account?</label>
                    <Link to="/login" className="register-link">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
