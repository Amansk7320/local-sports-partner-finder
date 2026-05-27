// 1. Register/Login
// Simple form.

import React, { useState } from 'react';
import { userlogin, userrregister } from '../api';

export default function project() {
    const [username, setusername] = useState(' ');
    const [password, setpassword] = usestate(' ');

    const handlelogin = async () => {
        try {
            const response = await userlogin(username, password);
            console.log(response);
        } catch (error){
            console.error('Login failed:', error);
        }
        }
        const handleregister = async () => {
            try {
                const response = await userrregister(username, password);
                console.log(response);
            } catch (error){
                console.error('Registration failed:', error);
            }
            }
            return (
                <div>
                    <h2>Login/Register</h2>
                    <input type="text" placeholder="Username" value={username} onchange={(e) => setusername(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onchange={(e) => setpassword(e.target.value)} />
                    <button onclick={handlelogin}>Login</button>
                    <button onclick={handleregister}>Register</button>
                </div>
            )
        }