import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
function UpdatePost() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [existingMedia, setExistingMedia] = useState([]); // Initialize as an empty array
  const [newMedia, setNewMedia] = useState([]); // New media files to upload
  const [newMediaPreviews, setNewMediaPreviews] = useState([]); // Add state for new media previews
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || ''); // Ensure title is not undefined
        setDescription(post.description || ''); // Ensure description is not undefined
        setCategory(post.category || ''); // Set category
        setExistingMedia(post.media || []); // Ensure media is an array
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false); // Set loading to false even if there's an error
      }

    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl)); // Remove from UI
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;
    
    // Count already added new media files
    const currentNewImages = newMedia.filter(file => file.type.startsWith('image/')).length;
    const currentNewVideos = newMedia.filter(file => file.type === 'video/mp4').length;
    imageCount += currentNewImages;
    videoCount += currentNewVideos;

    const validatedFiles = [];
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
      
      validatedFiles.push(file);
      previews.push({
        type: file.type,
        url: URL.createObjectURL(file)
      });
    }

    // Update state with new files and previews
    setNewMedia([...newMedia, ...validatedFiles]);
    setNewMediaPreviews([...newMediaPreviews, ...previews]);
  };
  
  // Add function to remove new media
  const handleRemoveNewMedia = (index) => {
    const updatedNewMedia = [...newMedia];
    const updatedPreviews = [...newMediaPreviews];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index].url);
    
    updatedNewMedia.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewMedia(updatedNewMedia);
    setNewMediaPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category); // Include category in the update
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
    
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="add-post-container">
      <NavBar />
      <div className="add-post-content">
        <div className="post-form-card">
          <h1 className="post-form-title">Update Post</h1>
          <p className="post-form-subtitle">Edit your post information</p>
          
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              {existingMedia.length > 0 && (
                <div className="media-previews">
                  {existingMedia.map((mediaUrl, index) => (
                    <div key={index} className="media-preview-item">
                      {mediaUrl.endsWith('.mp4') ? (
                        <video controls className="preview-content video-preview">
                          <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="preview-content image-preview" src={`http://localhost:8080${mediaUrl}`} alt={`Media ${index}`} />
                      )}
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => handleDeleteMedia(mediaUrl)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add preview section for new media files */}
              {newMediaPreviews.length > 0 && (
                <div className="media-previews">
                  {newMediaPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="media-preview-item">
                      {preview.type.startsWith('video/') ? (
                        <video controls className="preview-content video-preview">
                          <source src={preview.url} type={preview.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="preview-content image-preview" src={preview.url} alt={`New Media ${index}`} />
                      )}
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => handleRemoveNewMedia(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="media-upload-container">
                <div className="media-upload-box">
                  <input
                    className="media-input"
                    type="file"
                    id="media-upload"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleNewMediaChange}
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
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
