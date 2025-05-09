import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css'; // Create this CSS file for styling

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    // Create copies of current media and previews
    const updatedMedia = [...media];
    const updatedPreviews = [...mediaPreviews];
    
    // Count existing media types
    let imageCount = updatedMedia.filter(file => file.type.startsWith('image/')).length;
    let videoCount = updatedMedia.filter(file => file.type === 'video/mp4').length;
    
    for (const file of newFiles) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return; // Exit early instead of reloading
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > 3) {
          alert('You can upload a maximum of 3 images.');
          return; // Exit early
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return; // Exit early
        }

        // Validate video duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            return; // Instead of reloading, just exit
          }
        };
        
        
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return; // Exit early
      }

      // Add file to updated arrays
      updatedMedia.push(file);
      updatedPreviews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    // Update state with combined arrays
    setMedia(updatedMedia);
    setMediaPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div className="add-post-container">
      <NavBar />
      <div className="add-post-content">
        <div className="post-form-card">
          <h1 className="post-form-title">Create New Post</h1>
          <p className="post-form-subtitle">Share your knowledge with the community</p>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter an engaging title for your post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Share your thoughts, ideas, or knowledge..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Tech">Tech</option>
                <option value="Programming">Programming</option>
                <option value="Cooking">Cooking</option>
                <option value="Photography">Photography</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Media</label>
              <div className="media-upload-container">
                <div className="media-upload-box">
                  <input
                    className="media-input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleMediaChange}
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="media-upload-label">
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className="upload-text">
                      <span>Drag & drop files or click to browse</span>
                      <p className="upload-hint">Support: JPG, PNG, MP4 (Max: 3 images, 1 video)</p>
                    </div>
                  </label>
                </div>
                
                {mediaPreviews.length > 0 && (
                  <div className="media-previews">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="media-preview-item">
                        {preview.type.startsWith('video/') ? (
                          <video controls className="preview-content video-preview">
                            <source src={preview.url} type={preview.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img className="preview-content image-preview" src={preview.url} alt={`Preview ${index}`} />
                        )}
                        <button 
                          type="button" 
                          className="remove-media-btn"
                          onClick={() => {
                            const newMedia = [...media];
                            newMedia.splice(index, 1);
                            setMedia(newMedia);
                            
                            const newPreviews = [...mediaPreviews];
                            newPreviews.splice(index, 1);
                            setMediaPreviews(newPreviews);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
