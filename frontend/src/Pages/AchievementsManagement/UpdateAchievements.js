import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateAchievements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  // Changed to handle multiple files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImage, setExistingImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setExistingImage(data.imageUrl);
          setPreviewImages([]);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Updated to handle multiple files with a maximum limit of 3
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Calculate how many more images we can add
      const existingCount = existingImage ? 1 : 0;
      const currentNewCount = selectedFiles.length;
      const totalExisting = existingCount + currentNewCount;
      const maxMoreAllowed = 3 - totalExisting;
      
      if (maxMoreAllowed <= 0) {
        alert('Maximum of 3 images allowed.');
        return;
      }
      
      // Only add up to the maximum allowed
      const filesToAdd = files.slice(0, maxMoreAllowed);
      
      if (files.length > maxMoreAllowed) {
        alert(`Only added ${maxMoreAllowed} out of ${files.length} images. Maximum of 3 images allowed.`);
      }
      
      // Add new files to selected files array
      setSelectedFiles(prev => [...prev, ...filesToAdd]);
      
      // Create new preview URLs
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));  
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };
  
  // New function to remove an image from preview
  const handleRemoveImage = (index) => {
    // Remove from selectedFiles array
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    // Remove from previewImages and revoke object URL to prevent memory leaks
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };
  
  // Function to remove the existing image
  const handleRemoveExistingImage = () => {
    setExistingImage('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new images if selected
      if (selectedFiles.length > 0) {
        // For simplicity, we'll just use the first selected file
        // In a real app, you might want to handle multiple uploads
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFiles[0]);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      } else if (!existingImage) {
        // If no existing image and no new files, set imageUrl to empty
        imageUrl = '';
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        navigate('/allAchievements');
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-post-container">
      <NavBar />
      <div className="add-post-content">
        <div className="post-form-card">
          <h1 className="post-form-title">Update Achievement</h1>
          <p className="post-form-subtitle">Edit your achievement information</p>
          
          <form onSubmit={handleSubmit} className="post-form">
            {/* Image Upload Section */}
            <div className="form-group">
              <label className="form-label">Images</label>
              
              <div className="media-previews">
                {/* Show existing image if available */}
                {existingImage && (
                  <div className="media-preview-item">
                    <img 
                      className="preview-content image-preview" 
                      src={`http://localhost:8080/achievements/images/${existingImage}`} 
                      alt="Current Achievement" 
                    />
                    <button 
                      type="button" 
                      className="remove-media-btn"
                      onClick={handleRemoveExistingImage}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* Show all newly selected images */}
                {previewImages.map((preview, index) => (
                  <div key={`new-${index}`} className="media-preview-item">
                    <img 
                      className="preview-content image-preview" 
                      src={preview} 
                      alt={`Preview ${index}`} 
                    />
                    <button 
                      type="button" 
                      className="remove-media-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="media-upload-container">
                <div className="media-upload-box">
                  <input
                    className="media-input"
                    type="file"
                    id="media-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                  />
                  <label htmlFor="media-upload" className="media-upload-label">
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className="upload-text">
                      <span>Drag & drop files or click to browse</span>
                      <p className="upload-hint">Support: JPG, PNG (Max: 3 images, Max size: 50MB)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Rest of the form */}
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                name="title"
                placeholder="Enter achievement title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* ... existing code for other form fields ... */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                name="description"
                placeholder="Describe your achievement"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input form-select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Achievement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;