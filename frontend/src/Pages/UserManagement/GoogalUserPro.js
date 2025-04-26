import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTools, FaEdit, FaTrash, FaGraduationCap, FaBookOpen, FaTrophy } from 'react-icons/fa';
import './UserProfile.css'
import Pro from './img/img.png';
import NavBar from '../../Components/NavBar/NavBar';
export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};
function GoogalUserPro() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);
    
    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            fetchUserDetails(userId).then((data) => setUserData(data));
        }
    }, []);
    
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
    
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            const userId = localStorage.getItem('userID');
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <div className="profile-page">
            <NavBar />
            <div className="profile-container">
                {userData && userData.id === localStorage.getItem('userID') && (
                    <div className="profile-content">
                        <div className="profile-header">
                            <div className="profile-avatar-container">
                                {googleProfileImage ? (
                                    <img
                                        src={googleProfileImage}
                                        alt="Profile"
                                        className="profile-avatar"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = Pro;
                                        }}
                                    />
                                ) : userProfileImage ? (
                                    <img
                                        src={userProfileImage}
                                        alt="Profile"
                                        className="profile-avatar"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = Pro;
                                        }}
                                    /> 
                                ) : (
                                    <div className="profile-avatar-placeholder">
                                        {userData.fullname ? userData.fullname.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <h1 className="profile-name">{userData.fullname}</h1>
                                <div className="color-tag-container">
                                    <span className="color-tag">Google User</span>
                                    {userData.skills && userData.skills.length > 0 && 
                                        <span className="color-tag accent">{userData.skills[0]}</span>
                                    }
                                </div>
                                <p className="profile-bio">{userData.bio || "No bio available"}</p>
                                <div className="profile-actions">
                                    <button onClick={handleDelete} className="profile-delete-button">
                                        <FaTrash /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="profile-details-card">
                            <h2 className="section-title">Contact Information</h2>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon"><FaEnvelope /></div>
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{userData.email}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><FaPhone /></div>
                                    <div className="detail-content">
                                        <span className="detail-label">Phone</span>
                                        <span className="detail-value">{userData.phone || "Not provided"}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><FaTools /></div>
                                    <div className="detail-content">
                                        <span className="detail-label">Skills</span>
                                        <span className="detail-value">
                                            {userData.skills && userData.skills.length > 0 
                                                ? userData.skills.join(', ') 
                                                : "No skills listed"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className="section-title">My Activities</h2>
                        <div className="activities-grid">
                            <div className="activity-card" onClick={() => (window.location.href = '/myLearningPlan')}>
                                <div className="activity-icon"><FaBookOpen /></div>
                                <h3 className="activity-title">My Learning Plan</h3>
                                <p className="activity-description">View and manage your learning journey</p>
                            </div>
                            <div className="activity-card" onClick={() => (window.location.href = '/myAllPost')}>
                                <div className="activity-icon"><FaGraduationCap /></div>
                                <h3 className="activity-title">My SkillPost</h3>
                                <p className="activity-description">See all your skill posts</p>
                            </div>
                            <div className="activity-card" onClick={() => (window.location.href = '/myAchievements')}>
                                <div className="activity-icon"><FaTrophy /></div>
                                <h3 className="activity-title">My Achievements</h3>
                                <p className="activity-description">Track your progress and milestones</p>
                            </div>
                        </div>
                    </div>
                )}
                {!userData && (
                    <div className="loading-profile">
                        <div className="loading-spinner"></div>
                        <p>Loading profile information...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GoogalUserPro;
