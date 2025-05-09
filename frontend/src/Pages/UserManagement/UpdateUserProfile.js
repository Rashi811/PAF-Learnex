import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import './UpdateUserProfile.css'; // We'll create this CSS file

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    skills: [], // Added skills field
    bio: '', // Added bio field
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // State for previewing the selected image
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };
  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        if (profilePicture) {
          const formData = new FormData();
          formData.append('file', profilePicture);
          await fetch(`http://localhost:8080/user/${id}/uploadProfilePicture`, {
            method: 'PUT',
            body: formData,
          });
        }
        alert('Profile updated successfully!');
        navigate('/userProfile'); // Use navigate instead of window.location
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-post-container">
      <NavBar />
      <div className="add-post-content">
        <div className="post-form-card">
          <h1 className="post-form-title">Update Profile</h1>
          <p className="post-form-subtitle">Manage your personal information</p>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
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
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-input form-textarea"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <span className="form-label">Skills</span>
              <div className="tags-container">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="tag">
                    #{skill}
                    <button 
                      type="button" 
                      className="remove-tag"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-input-container">
                <input
                  className="form-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button type="button" className="add-tag-btn" onClick={handleAddSkill}>
                  <IoMdAdd />
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Profile Picture</label>
              <div className="media-upload-container">
                <div className="media-upload-box">
                  <input
                    className="media-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" className="media-upload-label">
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className="upload-text">
                      <span>Drag & drop image or click to browse</span>
                      <p className="upload-hint">Support: JPG, PNG (Max: 5MB)</p>
                    </div>
                  </label>
                </div>
                
                {(previewImage || formData.profilePicturePath) && (
                  <div className="media-previews">
                    <div className="media-preview-item">
                      {previewImage ? (
                        <img 
                          className="preview-content image-preview" 
                          src={previewImage} 
                          alt="Profile Preview" 
                        />
                      ) : formData.profilePicturePath ? (
                        <img 
                          className="preview-content image-preview" 
                          src={`http://localhost:8080/uploads/profile/${formData.profilePicturePath}`} 
                          alt="Current Profile" 
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;
