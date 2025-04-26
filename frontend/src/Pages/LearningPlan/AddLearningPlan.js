import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css'; // Import the updated CSS file
import NavBar from '../../Components/NavBar/NavBar';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import { MdOutlineCategory } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { RiCalendarEventLine } from "react-icons/ri";

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'preview'

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date.");
      setIsSubmitting(false);
      return;
    }

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    if (!templateID) {
      alert("Please select a template.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      }

      // Create the new post object
      const newPost = {
        title,
        description,
        contentURL,
        tags,
        postOwnerID,
        postOwnerName,
        imageUrl,
        templateID,
        startDate, // New field
        endDate,   // New field
        category   // New field
      };

      // Submit the post data
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  return (
    <div className="learning-plan-page">
      <NavBar />
      <div className="learning-plan-container">
        <div className="tabs-container">
          <div 
            className={`tab ${activeTab === 'form' ? 'active' : ''}`} 
            onClick={() => setActiveTab('form')}
          >
            Create Plan
          </div>
          <div 
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`} 
            onClick={() => setActiveTab('preview')}
          >
            Preview Templates
          </div>
        </div>
        
        <div className="content-area">
          {activeTab === 'form' && (
            <div className="form-container">
              <h2 className="page-title">Create Learning Plan</h2>
              <div className="form-card">
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-text">Title</span>
                      <input
                        className="modern-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter a title for your learning plan"
                      />
                    </label>
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-text"><FaTags className="icon" /> Tags</span>
                      <div className="tags-container">
                        {tags.map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                            <button 
                              type="button" 
                              className="remove-tag"
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-container">
                        <input
                          className="modern-input"
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <button type="button" className="add-tag-btn" onClick={handleAddTag}>
                          <IoMdAdd />
                        </button>
                      </div>
                    </label>
                  </div>

                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-text">Description</span>
                      <textarea
                        className="modern-input textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        placeholder="Describe your learning plan"
                      />
                    </label>
                  </div>

                  <div className="two-column-grid">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text"><RiCalendarEventLine className="icon" /> Start Date</span>
                        <input
                          className="modern-input"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </label>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text"><RiCalendarEventLine className="icon" /> End Date</span>
                        <input
                          className="modern-input"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="two-column-grid">
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text"><MdOutlineCategory className="icon" /> Category</span>
                        <select
                          className="modern-input"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Category</option>
                          <option value="Tech">Tech</option>
                          <option value="Programming">Programming</option>
                          <option value="Cooking">Cooking</option>
                          <option value="Photography">Photography</option>
                        </select>
                      </label>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-text">Template Style</span>
                        <select
                          className="modern-input"
                          value={templateID}
                          onChange={(e) => setTemplateID(e.target.value)}
                          required
                        >
                          <option value="">Select Template</option>
                          <option value="1">Template 1</option>
                          <option value="2">Template 2</option>
                          <option value="3">Template 3</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  
                  <div className="media-section">
                    <h3>Add Media <span className="optional">(Optional)</span></h3>
                    <div className="media-buttons">
                      <button
                        type="button"
                        className={`media-button ${showContentURLInput ? 'active' : ''}`}
                        onClick={() => setShowContentURLInput(!showContentURLInput)}
                      >
                        <FaVideo className="icon" />
                        <span>Add Video</span>
                      </button>
                      <button
                        type="button"
                        className={`media-button ${showImageUploadInput ? 'active' : ''}`}
                        onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                      >
                        <FaImage className="icon" />
                        <span>Add Image</span>
                      </button>
                    </div>

                    {showContentURLInput && (
                      <div className="input-group slide-down">
                        <label className="input-label">
                          <span className="label-text">Video URL (YouTube)</span>
                          <input
                            className="modern-input"
                            type="url"
                            value={contentURL}
                            onChange={(e) => setContentURL(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </label>
                      </div>
                    )}

                    {showImageUploadInput && (
                      <div className="input-group slide-down">
                        <label className="input-label">
                          <span className="label-text">Upload Image</span>
                          <div className="file-upload-container">
                            <input
                              type="file"
                              id="image-upload"
                              className="file-input"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload" className="file-upload-button">
                              Choose File
                            </label>
                            <span className="file-name">{image ? image.name : 'No file chosen'}</span>
                          </div>
                          {imagePreview && (
                            <div className="image-preview">
                              <img src={imagePreview} alt="Preview" />
                            </div>
                          )}
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Create Learning Plan'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="templates-container">
              <h2 className="page-title">Template Preview</h2>
              <p className="template-instruction">Select a template that best presents your learning plan</p>
              
              <div className="templates-grid">
                <div className={`template-card ${templateID === '1' ? 'selected' : ''}`} onClick={() => setTemplateID('1')}>
                  <div className="template-header">
                    <span className="template-badge">Template 1</span>
                    {templateID === '1' && <span className="selected-badge">Selected</span>}
                  </div>
                  <div className="template template-1">
                    <p className='template_title'>{title || "Title Preview"}</p>
                    <p className='template_dates'><HiCalendarDateRange /> {startDate || "Start Date"} to {endDate || "End Date"} </p>
                    <p className='template_description'>{category || "Category"}</p>
                    <hr></hr>
                    <p className='template_description'>{description || "Description Preview"}</p>
                    <div className="tags_preview">
                      {tags.length > 0 ? 
                        tags.map((tag, index) => (
                          <span key={index} className="tagname">#{tag}</span>
                        )) : 
                        <>
                          <span className="tagname">#tag1</span>
                          <span className="tagname">#tag2</span>
                        </>
                      }
                    </div>
                    
                    {/* Display image preview first */}
                    {imagePreview ? 
                      <img src={imagePreview} alt="Preview" className="iframe_preview" style={{ marginTop: "10px" }} /> :
                      <div className="placeholder-image" style={{ marginTop: "10px" }}>Image Preview</div>
                    }
                    
                    {/* Add a gap between media elements */}
                    <div style={{ marginTop: "20px" }}></div>
                    
                    {/* Display video preview below image */}
                    {contentURL ? 
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        className="iframe_preview"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe> :
                      <div className="placeholder-video">Video Preview</div>
                    }
                  </div>
                </div>

                <div className={`template-card ${templateID === '2' ? 'selected' : ''}`} onClick={() => setTemplateID('2')}>
                  <div className="template-header">
                    <span className="template-badge">Template 2</span>
                    {templateID === '2' && <span className="selected-badge">Selected</span>}
                  </div>
                  <div className="template template-2">
                    <p className='template_title'>{title || "Title Preview"}</p>
                    <p className='template_dates'><HiCalendarDateRange /> {startDate || "Start Date"} to {endDate || "End Date"} </p>
                    <p className='template_description'>{category || "Category"}</p>
                    <hr></hr>
                    <p className='template_description'>{description || "Description Preview"}</p>
                    <div className="tags_preview">
                      {tags.length > 0 ? 
                        tags.map((tag, index) => (
                          <span key={index} className="tagname">#{tag}</span>
                        )) : 
                        <>
                          <span className="tagname">#tag1</span>
                          <span className="tagname">#tag2</span>
                        </>
                      }
                    </div>
                    <div className='preview_part'>
                      <div className='preview_part_sub'>
                        {imagePreview ? 
                          <img src={imagePreview} alt="Preview" className="iframe_preview_new" /> :
                          <div className="placeholder-image">Image Preview</div>
                        }
                      </div>
                      <div className='preview_part_sub'>
                        {contentURL ? 
                          <iframe
                            src={getEmbedURL(contentURL)}
                            title="Content Preview"
                            className="iframe_preview_new"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe> :
                          <div className="placeholder-video">Video Preview</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`template-card ${templateID === '3' ? 'selected' : ''}`} onClick={() => setTemplateID('3')}>
                  <div className="template-header">
                    <span className="template-badge">Template 3</span>
                    {templateID === '3' && <span className="selected-badge">Selected</span>}
                  </div>
                  <div className="template template-3">
                    <div className='preview_part'>
                      <div className='preview_part_sub'>
                        {imagePreview ? 
                          <img src={imagePreview} alt="Preview" className="iframe_preview_new" /> :
                          <div className="placeholder-image">Image Preview</div>
                        }
                      </div>
                      <div className='preview_part_sub'>
                        {contentURL ? 
                          <iframe
                            src={getEmbedURL(contentURL)}
                            title="Content Preview"
                            className="iframe_preview_new"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe> :
                          <div className="placeholder-video">Video Preview</div>
                        }
                      </div>
                    </div>
                    
                    <p className='template_title'>{title || "Title Preview"}</p>
                    <p className='template_dates'><HiCalendarDateRange /> {startDate || "Start Date"} to {endDate || "End Date"} </p>
                    <p className='template_description'>{category || "Category"}</p>
                    <hr></hr>
                    <p className='template_description'>{description || "Description Preview"}</p>
                    <div className="tags_preview">
                      {tags.length > 0 ? 
                        tags.map((tag, index) => (
                          <span key={index} className="tagname">#{tag}</span>
                        )) : 
                        <>
                          <span className="tagname">#tag1</span>
                          <span className="tagname">#tag2</span>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddLearningPlan;