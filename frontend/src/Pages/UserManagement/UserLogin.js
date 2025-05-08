import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css'
import GoogalLogo from './img/glogo.png'
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="elegant-login-page">
      <div className="elegant-background">
        <div className="elegant-shape"></div>
        <div className="elegant-shape"></div>
      </div>
      
      <div className="elegant-container">
        <div className="elegant-welcome-panel">
          <div className="elegant-welcome-content">
            <h1>Learnex</h1>
            <p>Your journey to knowledge begins here.</p>
            <div className="elegant-decoration">
              <div className="elegant-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="elegant-form-panel">
          <div className="elegant-form-wrapper">
            <h2 className="elegant-title">Welcome back</h2>
            <p className="elegant-subtitle">Please sign in to your account</p>
            
            <form onSubmit={handleSubmit} className="elegant-form">
              <div className="elegant-field">
                <label htmlFor="email">Email</label>
                <div className="elegant-input-group">
                  <FaEnvelope className="elegant-field-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="elegant-field">
                <div className="elegant-label-row">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="elegant-forgot">Forgot password?</a>
                </div>
                <div className="elegant-input-group">
                  <FaLock className="elegant-field-icon" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <label className="elegant-remember">
                <div className="elegant-check-wrapper">
                  <input type="checkbox" />
                  <span className="elegant-check-mark"></span>
                </div>
                <span>Remember me</span>
              </label>
              
              <button type="submit" className="elegant-button">
                <span>Sign In</span>
                <FaArrowRight className="btn-icon" />
              </button>
              
              <div className="elegant-alt-login">
                <span>Or sign in with</span>
              </div>
              
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="elegant-social-button"
              >
                <img src={GoogalLogo} alt="Google" />
                <span>Google</span>
              </button>
              
              <div className="elegant-signup">
                <p>
                  Don't have an account?
                  <span onClick={() => (window.location.href = '/register')}>
                    Create account
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



export default UserLogin;
