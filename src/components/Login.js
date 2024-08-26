import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); 

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lengthOtp = 6;
        let captcha = '';
        for (let i = 0; i < lengthOtp; i++) {
            const index = Math.floor(Math.random() * charsArray.length);
            captcha += charsArray[index];
        }
        setCaptcha(captcha);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (captchaInput !== captcha) {
            setMessage('Invalid CAPTCHA. Please try again.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                email,
                password,
            });

            setMessage('Login successful!');
            localStorage.setItem('token', response.data.token);
            navigate('/home'); 

        } catch (error) {
            const statusCode = error.response?.status;
            if (statusCode === 401) {
                setMessage('Invalid email or password.');
            } else if (statusCode === 500) {
                setMessage('Server error. Please try again later.');
            } else {
                setMessage(error.response?.data?.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glow">
            <div className='login-container' id='glow'>
                <h2>Login</h2>
                <form className='auth-form' onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            aria-label="Email Address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password :</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            aria-label="Password"
                        />
                    </div>
                    <div className="captcha">
                        <label htmlFor="captchaInput">Enter CAPTCHA:</label>
                        <div className="captcha-display">{captcha}</div>
                        <input
                            type="text"
                            id="captchaInput"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            placeholder="Enter CAPTCHA"
                            required
                            disabled={loading}
                            aria-label="CAPTCHA"
                        />
                        <button type="button" id="captcha-btn" onClick={generateCaptcha} disabled={loading} aria-label="Refresh CAPTCHA">
                            <i className="uil uil-sync"></i>
                        </button>
                    </div>

                    <button className="btn" type="submit" id="Login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="check">
                        <input type="checkbox" id="login-check" disabled={loading} aria-label="Remember Me" />
                        <label htmlFor="login-check"> Remember Me</label>
                    </div>

                    <label className="lab">
                        Don't have an account?
                    </label>
                    <Link to="/register" className="register-link">
                        <button className="btn" id="main" disabled={loading}>Register</button>
                    </Link>

                    <div className="quick-btn-group">
                        <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="btn" disabled={loading}>
                                <i className="uim uim-google"></i>
                                <span>Login with Google</span>
                            </button>
                        </a>
                        <a href="https://appleid.apple.com/sign-in" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="btn" disabled={loading}>
                                <i className="uim uim-apple"></i>
                                <span>Login with Apple</span>
                            </button>
                        </a>
                    </div>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
