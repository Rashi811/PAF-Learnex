import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import GoogalLogo from './img/glogo.png'
import { IoMdAdd } from "react-icons/io";
import './user.css';

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
        bio: '', // Added bio field
    });
    const [currentStep, setCurrentStep] = useState(1); // Track current step (1 or 2)
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for previewing the selected image
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [skillInput, setSkillInput] = useState('');
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    // Go to next step if validation passes
    const goToNextStep = () => {
        let isValid = true;

        // Validate fields for step 1
        if (currentStep === 1) {
            if (!formData.fullname) {
                alert("Full name is required");
                isValid = false;
            }
            if (!formData.email) {
                alert("Email is required");
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                alert("Email is invalid");
                isValid = false;
            }
            if (!formData.password) {
                alert("Password is required");
                isValid = false;
            }
            if (!profilePicture) {
                alert("Profile picture is required");
                isValid = false;
            }
        }

        if (isValid && currentStep === 1) {
            setCurrentStep(2);
        }
    };

    // Go back to previous step
    const goToPrevStep = () => {
        setCurrentStep(1);
    };

    const sendVerificationCode = async (email) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', code);
        try {
            await fetch('http://localhost:8080/sendVerificationCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }
        
        if (!isValid) {
            return; // Stop execution if validation fails
        }

        try {
            // Step 1: Create the user
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    skills: formData.skills,
                    bio: formData.bio, // Include bio in the request
                }),
            });

            if (response.ok) {
                const userId = (await response.json()).id; // Get the user ID from the response

                // Step 2: Upload the profile picture
                if (profilePicture) {
                    const profileFormData = new FormData();
                    profileFormData.append('file', profilePicture);
                    await fetch(`http://localhost:8080/user/${userId}/uploadProfilePicture`, {
                        method: 'PUT',
                        body: profileFormData,
                    });
                }

                sendVerificationCode(formData.email); // Send verification code
                setIsVerificationModalOpen(true); // Open verification modal
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = () => {
        const savedCode = localStorage.getItem('verificationCode');
        if (userEnteredCode === savedCode) {
            alert('Verification successful!');
            localStorage.removeItem('verificationCode');
            window.location.href = '/';
        } else {
            alert('Invalid verification code. Please try again.');
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
                        <p>Start your learning journey today.</p>
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
                        <h2 className="elegant-title">Create Account</h2>
                        <p className="elegant-subtitle">Please fill in your details</p>
                        
                        {/* Stepper UI */}
                        <div className="elegant-stepper">
                            <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''}`}>
                                <div className="step-number">1</div>
                                <div className="step-label">Basic Info</div>
                            </div>
                            <div className="stepper-line"></div>
                            <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <div className="step-label">Additional Info</div>
                            </div>
                        </div>
                        
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <form className="elegant-form">
                                <div className="elegant-field profile-upload">
                                    <label>Profile Picture</label>
                                    <div className="elegant-profile-upload" onClick={triggerFileInput}>
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Selected Profile"
                                                className="profile-preview"
                                            />
                                        ) : (
                                            <FaUserCircle className="profile-placeholder" />
                                        )}
                                    </div>
                                    <input
                                        id="profilePictureInput"
                                        className="hidden-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                    />
                                </div>
                                
                                <div className="elegant-field">
                                    <label htmlFor="fullname">Full Name</label>
                                    <div className="elegant-input-group">
                                        <input
                                            id="fullname"
                                            type="text"
                                            name="fullname"
                                            placeholder="Enter your full name"
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
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
                                    <label htmlFor="password">Password</label>
                                    <div className="elegant-input-group">
                                        <FaLock className="elegant-field-icon" />
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <button type="button" className="elegant-button" onClick={goToNextStep}>
                                    <span>Next</span>
                                    <FaArrowRight className="btn-icon" />
                                </button>
                            </form>
                        )}
                        
                        {/* Step 2: Additional Information */}
                        {currentStep === 2 && (
                            <form onSubmit={handleSubmit} className="elegant-form">
                                <div className="elegant-field">
                                    <label htmlFor="phone">Phone</label>
                                    <div className="elegant-input-group">
                                        <FaPhone className="elegant-field-icon" />
                                        <input
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                const re = /^[0-9\b]{0,10}$/;
                                                if (re.test(e.target.value)) {
                                                    handleInputChange(e);
                                                }
                                            }}
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            title="Please enter exactly 10 digits."
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="elegant-field">
                                    <label>Skills</label>
                                    <div className="elegant-skills-container">
                                        <div className="elegant-skills-list">
                                            {formData.skills.map((skill, index) => (
                                                <span key={index} className="elegant-skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="elegant-skill-input-group">
                                            <input
                                                type="text"
                                                placeholder="Add a skill"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            />
                                            <button type="button" onClick={handleAddSkill} className="elegant-add-button">
                                                <IoMdAdd />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="elegant-field">
                                    <label htmlFor="bio">Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        required
                                        className="elegant-textarea"
                                    />
                                </div>
                                
                                <div className="elegant-button-group">
                                    <button type="button" className="elegant-button secondary" onClick={goToPrevStep}>
                                        <FaArrowLeft className="btn-icon" />
                                        <span>Back</span>
                                    </button>
                                    <button type="submit" className="elegant-button">
                                        <span>Register</span>
                                        <FaArrowRight className="btn-icon" />
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        <div className="elegant-alt-login">
                            <span>Or sign up with</span>
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
                                Already have an account?
                                <span onClick={() => (window.location.href = '/')}>
                                    Sign in
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {isVerificationModalOpen && (
                <div className="verification-modal elegant-modal">
                    <div className="modal-content">
                        <h3>Verify Your Email</h3>
                        <p>Please enter the verification code sent to your email.</p>
                        <div className="elegant-input-group verification-input-group">
                            <input
                                type="text"
                                value={userEnteredCode}
                                onChange={(e) => setUserEnteredCode(e.target.value)}
                                placeholder="Enter verification code"
                                className="elegant-input"
                            />
                        </div>
                        <button onClick={handleVerifyCode} className="elegant-button">
                            <span>Verify</span>
                            <FaArrowRight className="btn-icon" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default UserRegister;
