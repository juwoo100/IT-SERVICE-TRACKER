import { set } from 'mongoose';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('username');
        if (savedUser) {
            setIsLoggedIn(true);
            setUsername(savedUser);
        }
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        if (!username || !email || !password) {
            alert("Please fill in all fields");
            return;
        }
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
        alert(` ${username}Login successful`);
        navigate('/dashboard');

    }

    function handleLogout() {
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        setEmail('');
        setPassword('');
        alert('Logout successful');
        navigate('/login');
    }

    if (isLoggedIn) {
        return (
            <div className='container'>
                <p>Welcome,<b>{username}</b></p>
                <button type='button' onClick={handleLogout}>Logout</button>
            </div>
        );
    } else {
        return (
            <div className='container'>
                <div className='header'>
                    <div className='text'>Login</div>
                </div>
                <br />
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">username:</label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <button type="submit" onClick={handleLogin}>Login</button>
                    <button type="submit" >Sign up</button>
                </form>
            </div>
        );
    }
}