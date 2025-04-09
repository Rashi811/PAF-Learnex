import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Callback = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);

        const token = params.get('token');
        const userId = params.get('userId');
        const username = params.get('username');
        const email = params.get('email');
        const name = params.get('name');

        if (username) {
            // Create a user object from URL parameters
            const user = {
                id: userId,
                username,
                email,
                name
            };
            login(user);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Processing your login...</h2>
                <p className="mt-2">Please wait while we authenticate you.</p>
            </div>
        </div>
    );
};

export default OAuth2Callback;