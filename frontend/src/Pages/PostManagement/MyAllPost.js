import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidLike, BiLike } from "react-icons/bi";
import Modal from 'react-modal';
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { FiSave } from "react-icons/fi";
import { TbPencilCancel } from "react-icons/tb";
import { FaCommentAlt } from "react-icons/fa";
import './AllPost.css'; // Make sure to use the same CSS file
Modal.setAppElement('#root');


function MyAllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]); // State to track followed users
  const [newComment, setNewComment] = useState({}); // State for new comments
  const [editingComment, setEditingComment] = useState({}); // State for editing comments
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem('userID'); // Get the logged-in user's ID

  useEffect(() => {
    // Fetch all posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts');
        const userID = localStorage.getItem('userID'); // Get the logged-in user's ID

        // Filter posts to include only those with the logged-in user's ID
        const userPosts = response.data.filter((post) => post.userID === userID);

        setPosts(userPosts);
        setFilteredPosts(userPosts); // Initially show filtered posts

        // Fetch post owners' names
        const userIDs = [...new Set(userPosts.map((post) => post.userID))]; // Get unique userIDs
        const ownerPromises = userIDs.map((userID) =>
          axios.get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              console.error(`Error fetching user details for userID ${userID}:`, error);
              return { userID, fullName: 'Anonymous' };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log('Post Owners Map:', ownerMap); // Debug log to verify postOwners map
        setPostOwners(ownerMap);
      } catch (error) {
        console.error('Error fetching posts:', error); // Log error for fetching posts
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem('userID');
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userID}/followedUsers`);
          setFollowedUsers(response.data);
        } catch (error) {
          console.error('Error fetching followed users:', error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId)); // Remove the deleted post from the UI
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId)); // Update filtered posts
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`); // Navigate to the UpdatePost page with the post ID
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      // Show all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts by logged-in user ID
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts); // Toggle the state
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/posts/${postId}/like`, null, {
        params: { userID },
      });

      // Update the specific post's likes in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to follow/unfollow users.');
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        // Unfollow logic
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, { unfollowUserID: postOwnerID });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        // Follow logic
        await axios.put(`http://localhost:8080/user/${userID}/follow`, { followUserID: postOwnerID });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId] || ''; // Get the comment content for the specific post
    if (!content.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, {
        userID,
        content,
      });

      // Update the specific post's comments in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data.comments } : post
        )
      );

      setNewComment({ ...newComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem('userID');
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        params: { userID },
      });

      // Update state to remove the deleted comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem('userID');
      await axios.put(`http://localhost:8080/posts/${postId}/comment/${commentId}`, {
        userID,
        content,
      });

      // Update the comment in state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
            : post
        )
      );

      setEditingComment({}); // Clear editing state
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter posts based on title, description, or category
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
    );
    setFilteredPosts(filtered);
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <div className="alt-posts-container">
      <NavBar />
      <div className="alt-content-wrapper">
        <div className="alt-header">
          <h1 className="alt-title">My Posts</h1>
          <div className="alt-actions">
            <div className="alt-search-wrapper">
              <input
                type="text"
                className="alt-search-input"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="alt-search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <button 
              className="create-btn"
              onClick={() => (window.location.href = '/addNewPost')}
            >
              <IoIosCreate className="create-btn-icon" />
              New Post
            </button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="alt-empty-container">
            <div className="alt-empty-illustration">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 13H7V14H17V13ZM17 9H7V12H17V9Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="alt-empty-title">No posts found</h2>
            <p className="alt-empty-desc">Start by creating your first post</p>
            <button 
              className="alt-empty-btn"
              onClick={() => (window.location.href = '/addNewPost')}
            >
              Create New Post
            </button>
          </div>
        ) : (
          <div className="alt-posts">
            {filteredPosts.map((post) => (
              <div key={post.id} className="alt-post">
                <div className="alt-post-header">
                  <div className="alt-post-user">
                    <div className="alt-user-avatar">
                      {postOwners[post.userID]?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="alt-user-name">{postOwners[post.userID] || 'Anonymous'}</p>
                      <p className="alt-post-category">{post.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                  
                  <div className="alt-post-options">                    
                    <div className="alt-dropdown">
                      <div className="alt-dropdown-toggle">
                        <span className="alt-dots">•••</span>
                      </div>
                      <div className="alt-dropdown-menu">
                        <div 
                          className="alt-dropdown-item" 
                          onClick={() => handleUpdate(post.id)}
                        >
                          <FaEdit className="alt-item-icon" />
                          <span>Edit Post</span>
                        </div>
                        <div 
                          className="alt-dropdown-item delete" 
                          onClick={() => handleDelete(post.id)}
                        >
                          <RiDeleteBin6Fill className="alt-item-icon" />
                          <span>Delete Post</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alt-post-body">
                  <h3 className="alt-post-title">{post.title}</h3>
                  <p className="alt-post-text">{post.description}</p>
                </div>
                
                {post.media.length > 0 && (
                  <div className={`alt-media-container media-count-${Math.min(post.media.length, 4)}`}>
                    {post.media.slice(0, 4).map((mediaUrl, index) => (
                      <div
                        key={index}
                        className="alt-media-item"
                        onClick={() => openModal(mediaUrl)}
                      >
                        {mediaUrl.endsWith('.mp4') ? (
                          <div className="alt-video-wrapper">
                            <video>
                              <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                            </video>
                            <div className="alt-play-button">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="alt-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <img 
                              src={`http://localhost:8080${mediaUrl}`} 
                              alt="Post Media" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }} 
                            />
                          </div>
                        )}
                        
                        {post.media.length > 4 && index === 3 && (
                          <div className="alt-more-overlay">
                            <span>+{post.media.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="alt-engagement">
                  <div 
                    className={`alt-like-button ${post.likes?.[localStorage.getItem('userID')] ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes?.[localStorage.getItem('userID')] ? (
                      <BiSolidLike className="alt-like-icon" />
                    ) : (
                      <BiLike className="alt-like-icon" />
                    )}
                    <span>
                      {Object.values(post.likes || {}).filter(liked => liked).length > 0 
                        ? Object.values(post.likes || {}).filter(liked => liked).length 
                        : 'Like'}
                    </span>
                  </div>
                  
                  <div className="alt-comment-count">
                    <FaCommentAlt className="alt-comment-icon" />
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
                
                <div className="alt-divider"></div>
                
                <div className="alt-comment-section">
                  <div className="alt-comment-form">
                    <div className="alt-current-user-avatar">
                      {localStorage.getItem('userName')?.charAt(0) || 'U'}
                    </div>
                    <div className="alt-comment-input-wrapper">
                      <input
                        type="text"
                        className="alt-comment-input"
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button 
                        className="alt-send-btn"
                        onClick={() => handleAddComment(post.id)}
                      >
                        <IoSend className="alt-send-icon" />
                      </button>
                    </div>
                  </div>
                  
                  {post.comments?.length > 0 && (
                    <div className="alt-comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="alt-comment-item">
                          <div className="alt-comment-user-avatar">
                            {comment.userFullName.charAt(0)}
                          </div>
                          <div className="alt-comment-content">
                            <div className="alt-comment-header">
                              <span className="alt-commenter-name">{comment.userFullName}</span>
                              
                              {(comment.userID === loggedInUserID || post.userID === loggedInUserID) && (
                                <div className="alt-comment-actions">
                                  {comment.userID === loggedInUserID && (
                                    <>
                                      {editingComment.id === comment.id ? (
                                        <>
                                          <button 
                                            className="alt-comment-action save"
                                            onClick={() => handleSaveComment(post.id, comment.id, editingComment.content)}
                                          >
                                            Save
                                          </button>
                                          <button 
                                            className="alt-comment-action cancel"
                                            onClick={() => setEditingComment({})}
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <button 
                                          className="alt-comment-action edit"
                                          onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                                        >
                                          Edit
                                        </button>
                                      )}
                                    </>
                                  )}
                                  
                                  {(comment.userID === loggedInUserID || post.userID === loggedInUserID) && (
                                    <button 
                                      className="alt-comment-action delete"
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {editingComment.id === comment.id ? (
                              <textarea
                                className="alt-edit-textarea"
                                value={editingComment.content}
                                onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                                autoFocus
                              />
                            ) : (
                              <p className="alt-comment-text">{comment.content}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alternative Modal for displaying full media */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Viewer"
        className="alt-modal"
        overlayClassName="alt-modal-overlay"
      >
        <button 
          className="alt-close-modal"
          onClick={closeModal}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
          </svg>
        </button>
        {selectedMedia && selectedMedia.endsWith('.mp4') ? (
          <video controls className="alt-modal-video">
            <source src={`http://localhost:8080${selectedMedia}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={`http://localhost:8080${selectedMedia}`} 
            alt="Full Media" 
            className="alt-modal-image" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '90vh', 
              objectFit: 'contain' 
            }} 
          />
        )}
      </Modal>
    </div>
  );
}

export default MyAllPost;
