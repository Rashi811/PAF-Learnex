import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css'; // Import the Templates css
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";
import { FaVideo, FaImage } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { RiCalendarEventLine } from "react-icons/ri";

function UpdateLearningPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'preview'
  const [showContentURLInput, setShowContentURLInput] = useState(true);
  const [showImageUploadInput, setShowImageUploadInput] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningPlan/${id}`);
        const { title, description, contentURL, tags, imageUrl, templateID, startDate, endDate, category } = response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
        setExistingImage(imageUrl);
        setTemplateID(templateID);
        setStartDate(startDate);
        setEndDate(endDate);
        setCategory(category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = existingImage;

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        return;
      }
    }

    const updatedPost = { title, description, contentURL, tags, imageUrl, postOwnerID: localStorage.getItem('userID'), templateID, startDate, endDate, category };
    try {
      await axios.put(`http://localhost:8080/learningPlan/${id}`, updatedPost);
      alert('Post updated successfully!');
      window.location.href = '/allLearningPlan';
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
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
            Update Plan
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
              <h2 className="page-title">Update Learning Plan</h2>
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
                              onClick={() => handleDeleteTag(index)}
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
                          onChange={(e) => setTemplateID(Number(e.target.value))}
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
                    <h3>Media</h3>
                    <div className="media-buttons">
                      <button
                        type="button"
                        className={`media-button ${showContentURLInput ? 'active' : ''}`}
                        onClick={() => setShowContentURLInput(!showContentURLInput)}
                      >
                        <FaVideo className="icon" />
                        <span>Video</span>
                      </button>
                      <button
                        type="button"
                        className={`media-button ${showImageUploadInput ? 'active' : ''}`}
                        onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                      >
                        <FaImage className="icon" />
                        <span>Image</span>
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
                            <span className="file-name">{image ? image.name : existingImage || 'No file chosen'}</span>
                          </div>
                          {imagePreview ? (
                            <div className="image-preview">
                              <img src={imagePreview} alt="Preview" />
                            </div>
                          ) : existingImage && (
                            <div className="image-preview">
                              <img src={`http://localhost:8080/learningPlan/planImages/${existingImage}`} alt="Existing" />
                            </div>
                          )}
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Update Learning Plan
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
                <div className={`template-card ${templateID === 1 ? 'selected' : ''}`} onClick={() => setTemplateID(1)}>
                  <div className="template-header">
                    <span className="template-badge">Template 1</span>
                    {templateID === 1 && <span className="selected-badge">Selected</span>}
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
                    {(imagePreview || existingImage) && (
                      <img 
                        src={imagePreview || `http://localhost:8080/learningPlan/planImages/${existingImage}`} 
                        alt="Preview" 
                        className="iframe_preview" 
                      />
                    )}
                    {contentURL && (
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        className="iframe_preview"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>

                <div className={`template-card ${templateID === 2 ? 'selected' : ''}`} onClick={() => setTemplateID(2)}>
                  <div className="template-header">
                    <span className="template-badge">Template 2</span>
                    {templateID === 2 && <span className="selected-badge">Selected</span>}
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
                        {(imagePreview || existingImage) ? 
                          <img 
                            src={imagePreview || `http://localhost:8080/learningPlan/planImages/${existingImage}`} 
                            alt="Preview" 
                            className="iframe_preview_new" 
                          /> :
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

                <div className={`template-card ${templateID === 3 ? 'selected' : ''}`} onClick={() => setTemplateID(3)}>
                  <div className="template-header">
                    <span className="template-badge">Template 3</span>
                    {templateID === 3 && <span className="selected-badge">Selected</span>}
                  </div>
                  <div className="template template-3">
                    {/* Show image if available */}
                    {(imagePreview || existingImage) && (
                      <img 
                        src={imagePreview || `http://localhost:8080/learningPlan/planImages/${existingImage}`} 
                        alt="Preview" 
                        className="iframe_preview" 
                      />
                    )}
                    
                    {/* Show video if available */}
                    {contentURL && (
                      <iframe
                        src={getEmbedURL(contentURL)}
                        title="Content Preview"
                        className="iframe_preview"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                    
                    {/* Show placeholder only if neither image nor video is available */}
                    {!imagePreview && !existingImage && !contentURL && (
                      <div className="placeholder-banner">Media Banner</div>
                    )}
                    
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

export default UpdateLearningPost;


