import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import './AllLearningPlan.css';
import { FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";

function MyLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        const userPosts = response.data.filter(post => post.postOwnerID === userId); // Filter posts by userID
        setPosts(userPosts);
        setFilteredPosts(userPosts); // Initially show filtered posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Ensure this runs only once on component mount

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id)); // Update the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderPostByTemplate = (post) => {
    console.log('Rendering post:', post);
    if (!post.templateID) {
      console.warn('Missing templateID for post:', post);
      return <div className="template template-default">Invalid template ID</div>;
    }

    const ownerInitials = getInitials(post.postOwnerName || 'User');
    
    const actionButtons = post.postOwnerID === localStorage.getItem('userID') ? (
      <div className="actions-container">
        <div 
          className="action-btn edit-btn"
          onClick={() => handleUpdate(post.id)}
          data-tooltip="Edit"
        >
          <FaEdit size={18} />
        </div>
        <div 
          className="action-btn delete-btn"
          onClick={() => handleDelete(post.id)}
          data-tooltip="Delete"
        >
          <RiDeleteBin6Fill size={18} />
        </div>
      </div>
    ) : null;

    switch (post.templateID) {
      case 1:
        return (
          <div className="template-1">
            <div className="user-header">
              <div className="owner-name">
                <div className="owner-avatar">{ownerInitials}</div>
                {post.postOwnerName}
              </div>
              {actionButtons}
            </div>
            <h2 className="plan-title">{post.title}</h2>
            <div className="plan-dates">
              <HiCalendarDateRange size={16} />
              <span>{post.startDate} to {post.endDate}</span>
            </div>
            <div className="category-badge">{post.category}</div>
            <hr className="plan-divider" />
            <p className="plan-description" style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            
            <div className="tags-container">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            
            {(post.imageUrl || post.contentURL) && (
              <div className="media-content">
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                  />
                )}
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="template-2">
            <div className="user-header">
              <div className="owner-name">
                <div className="owner-avatar">{ownerInitials}</div>
                {post.postOwnerName}
              </div>
              {actionButtons}
            </div>
            <h2 className="plan-title">{post.title}</h2>
            <div className="plan-dates">
              <HiCalendarDateRange size={16} />
              <span>{post.startDate} to {post.endDate}</span>
            </div>
            <div className="category-badge">{post.category}</div>
            <hr className="plan-divider" />
            <p className="plan-description" style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            
            <div className="tags-container">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            
            {(post.imageUrl || post.contentURL) && (
              <div className="media-grid">
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                  />
                )}
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="template-3">
            <div className="user-header">
              <div className="owner-name">
                <div className="owner-avatar">{ownerInitials}</div>
                {post.postOwnerName}
              </div>
              {actionButtons}
            </div>
            
            {(post.imageUrl || post.contentURL) && (
              <div className="media-content">
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                  />
                )}
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
            
            <h2 className="plan-title">{post.title}</h2>
            <div className="plan-dates">
              <HiCalendarDateRange size={16} />
              <span>{post.startDate} to {post.endDate}</span>
            </div>
            <div className="category-badge">{post.category}</div>
            <hr className="plan-divider" />
            <p className="plan-description" style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            
            <div className="tags-container">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        );
        
      default:
        console.warn('Unknown templateID:', post.templateID);
        return (
          <div className="template-1">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="learning-plan-container">
        <NavBar />
        <div className="learning-plan-content">
          <div className="learning-plan-header">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search your learning plans"
                value={searchOwnerName}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchOwnerName(value);
                  setFilteredPosts(
                    posts.filter((post) =>
                      post.title.toLowerCase().includes(value.toLowerCase())
                    )
                  );
                }}
                className="search-input"
              />
            </div>
            
            <button 
              className="create-btn" 
              onClick={() => (window.location.href = '/addLearningPlan')}
            >
              <IoIosCreate className="create-btn-icon" />
              Create Learning Plan
            </button>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-image"></div>
              <p className="empty-message">No learning plans found. Create a new one to get started.</p>
              <button 
                className="create-new-btn"
                onClick={() => (window.location.href = '/addLearningPlan')}
              >
                Create New Plan
              </button>
            </div>
          ) : (
            <div className="plans-grid">
              {filteredPosts.map((post) => (
                <div key={post.id} className="plan-card">
                  {renderPostByTemplate(post)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLearningPlan;
