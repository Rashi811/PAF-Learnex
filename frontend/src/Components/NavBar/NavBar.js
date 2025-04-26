import React, { useEffect, useState } from 'react';
import { FaUserGraduate } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import './NavBar.css';
import Pro from './img/img.png';
import { fetchUserDetails } from '../../Pages/UserManagement/UserProfile';

function NavBar() {
    const [allRead, setAllRead] = useState(true);
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = React.useRef(null);
    const userId = localStorage.getItem('userID');
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadNotifications = response.data.some(notification => !notification.read);
                setAllRead(!unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setIsVisible(false); // Hide navbar on scroll down
            } else {
                setIsVisible(true); // Show navbar on scroll up
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const currentPath = window.location.pathname;

    // Helper function for navigation
    const navigateTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className={`card-navbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="navbar-inner">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigateTo('/')}>
                    <div className="logo-mark">L</div>
                    <div className="logo-text">Learnex</div>
                </div>
                
                {/* Navigation Links */}
                <div className="nav-links">
                    <button 
                        className={`nav-link ${currentPath === '/allPost' ? 'active' : ''}`}
                        onClick={() => navigateTo('/allPost')}
                    >
                        Skill Post
                    </button>
                    <button 
                        className={`nav-link ${currentPath === '/allLearningPlan' ? 'active' : ''}`}
                        onClick={() => navigateTo('/allLearningPlan')}
                    >
                        Learning Plan
                    </button>
                    <button 
                        className={`nav-link ${currentPath === '/allAchievements' ? 'active' : ''}`}
                        onClick={() => navigateTo('/allAchievements')}
                    >
                        Achievements
                    </button>
                </div>
                
                {/* User Actions */}
                <div className="user-actions">
                    <button 
                        className={`icon-button ${currentPath === '/notifications' ? 'active' : ''}`}
                        onClick={() => navigateTo('/notifications')}
                    >
                        {allRead ? (
                            <MdNotifications />
                        ) : (
                            <div className="notification-indicator">
                                <MdNotificationsActive />
                                <span className="indicator-dot"></span>
                            </div>
                        )}
                    </button>
                    
                    {/* Profile Button with Submenu */}
                    <div className="profile-dropdown" ref={profileMenuRef}>
                        <button 
                            className="user-profile"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            {googleProfileImage ? (
                                <img
                                    src={googleProfileImage}
                                    alt="Profile"
                                    onError={(e) => { e.target.onerror = null; e.target.src = Pro; }}
                                />
                            ) : userProfileImage ? (
                                <img
                                    src={userProfileImage}
                                    alt="Profile"
                                    onError={(e) => { e.target.onerror = null; e.target.src = Pro; }}
                                />
                            ) : (
                                <FaUserGraduate />
                            )}
                        </button>
                        
                        {isProfileMenuOpen && (
                            <div className="profile-menu">
                                <div 
                                    className="menu-item"
                                    onClick={() => navigateTo(googleProfileImage ? '/googalUserPro' : '/userProfile')}
                                >
                                    <FaUserGraduate className="menu-icon" />
                                    <span>My Profile</span>
                                </div>
                                <div className="menu-divider"></div>
                                <div 
                                    className="menu-item logout"
                                    onClick={() => {
                                        localStorage.clear();
                                        navigateTo('/');
                                    }}
                                >
                                    <IoLogOut className="menu-icon" />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Mobile menu toggle */}
                <button 
                    className={`menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <button 
                        className={`mobile-nav-link ${currentPath === '/allPost' ? 'active' : ''}`}
                        onClick={() => {
                            navigateTo('/allPost');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Skill Post
                    </button>
                    <button 
                        className={`mobile-nav-link ${currentPath === '/allLearningPlan' ? 'active' : ''}`}
                        onClick={() => {
                            navigateTo('/allLearningPlan');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Learning Plan
                    </button>
                    <button 
                        className={`mobile-nav-link ${currentPath === '/allAchievements' ? 'active' : ''}`}
                        onClick={() => {
                            navigateTo('/allAchievements');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Achievements
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
