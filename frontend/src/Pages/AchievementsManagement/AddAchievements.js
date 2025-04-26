import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css'; // Reusing the same CSS

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const MAX_IMAGES = 3;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setErrorMessage('');
      
      // Check if adding new files would exceed the limit
      if (images.length + files.length > MAX_IMAGES) {
        const remainingSlots = MAX_IMAGES - images.length;
        
        // Alert the user about the image limit
        if (remainingSlots > 0) {
          alert(`You can only upload a maximum of ${MAX_IMAGES} images. Adding only ${remainingSlots} more.`);
          
          // Only add files up to the limit
          const filesToAdd = files.slice(0, remainingSlots);
          
          // Add new images to existing ones (up to the limit)
          setImages(prevImages => [...prevImages, ...filesToAdd]);
          
          // Create preview URLs for new images and add to existing previews
          const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
          setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        } else {
          // No more slots available
          alert(`You have reached the maximum limit of ${MAX_IMAGES} images.`);
        }
      } else {
        // Add new images to existing ones
        setImages(prevImages => [...prevImages, ...files]);
        
        // Create preview URLs for new images and add to existing previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      }
    }
  };
  
  const removeImage = (index) => {
    // Remove image from images array
    setImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    
    // Remove preview and revoke object URL to prevent memory leaks
    setImagePreviews(prevPreviews => {
      const updatedPreviews = [...prevPreviews];
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrls = [];
      
      // Upload each image and collect URLs
      if (images.length > 0) {
        for (const imageFile of images) {
          const formData = new FormData();
          formData.append('file', imageFile);
          const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
            method: 'POST',
            body: formData,
          });
          const imageUrl = await uploadResponse.text();
          imageUrls.push(imageUrl);
        }
      }

      const response = await fetch('http://localhost:8080/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrls }), // Send array of image URLs
      });
      
      if (response.ok) {
        alert('Achievement added successfully!');
        navigate('/myAchievements');
      } else {
        alert('Failed to add achievement.');
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert('An error occurred while adding the achievement.');
    }
  };

  return (
    <div className="add-post-container">
      <NavBar />
      <div className="add-post-content">
        <div className="post-form-card">
          <h1 className="post-form-title">Add Achievement</h1>
          <p className="post-form-subtitle">Share your accomplishments with the community</p>
          
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="Enter the title of your achievement"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                name="description"
                placeholder="Describe your achievement..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
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
              <label className="form-label">Date</label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Images</label>
              <div className="media-upload-container">
                <div className="media-upload-box">
                  <input
                    className="media-input"
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    onChange={handleImageChange}
                    multiple
                  />
                  <label htmlFor="image-upload" className="media-upload-label">
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className="upload-text">
                      <span>Drag & drop images or click to browse</span>
                      <p className="upload-hint">
                        Support: JPG, PNG (At least one required, maximum {MAX_IMAGES})
                        <br />
                        {images.length < MAX_IMAGES ? 
                          `${MAX_IMAGES - images.length} more ${MAX_IMAGES - images.length === 1 ? 'image' : 'images'} can be added` : 
                          'Maximum number of images reached'}
                      </p>
                    </div>
                  </label>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="media-previews">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="media-preview-item">
                        <img className="preview-content image-preview" src={preview} alt={`Preview ${index + 1}`} />
                        <button 
                          type="button" 
                          className="remove-media-btn"
                          onClick={() => removeImage(index)}
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
              <button 
                type="submit" 
                className="submit-button"
                disabled={images.length === 0}
              >
                Add Achievement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
