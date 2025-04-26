import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar'
import { IoIosCreate } from "react-icons/io";
import '../PostManagement/AllPost.css'; // Import the same CSS for consistent styling

// Add custom styles for achievements dropdown only
const achievementStyles = {
  dropdownMenu: {
    minWidth: '200px', // Increase width to prevent text wrapping
  },
  dropdownItem: {
    whiteSpace: 'nowrap', // Prevent text from wrapping
  }
};

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data); // Initially show all data
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter achievements based on title or description
    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievement deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievement.');
        }
      } catch (error) {
        console.error('Error deleting Achievement:', error);
      }
    }
  };

  return (
    <div className="alt-posts-container">
      <NavBar />
      <div className="alt-content-wrapper">
        <div className="alt-header">
          <h1 className="alt-title">Achievements</h1>
          <div className="alt-actions">
            <div className="alt-search-wrapper">
              <input
                type="text"
                className="alt-search-input"
                placeholder="Search achievements..."
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
              onClick={() => (window.location.href = '/addAchievements')}
            >
              <IoIosCreate className="create-btn-icon" />
              New Achievement
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="alt-empty-container">
            <div className="alt-empty-illustration">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 13H7V14H17V13ZM17 9H7V12H17V9Z" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="alt-empty-title">No achievements found</h2>
            <p className="alt-empty-desc">Start by creating your first achievement</p>
            <button 
              className="alt-empty-btn"
              onClick={() => (window.location.href = '/addAchievements')}
            >
              Create New Achievement
            </button>
          </div>
        ) : (
          <div className="alt-posts">
            {filteredData.map((achievement) => (
              <div key={achievement.id} className="alt-post">
                <div className="alt-post-header">
                  <div className="alt-post-user">
                    <div className="alt-user-avatar">
                      {achievement.postOwnerName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="alt-user-name">{achievement.postOwnerName || 'Anonymous'}</p>
                      <p className="alt-post-category">{achievement.date || 'No date'}</p>
                    </div>
                  </div>
                  
                  {achievement.postOwnerID === userId && (
                    <div className="alt-post-options">
                      <div className="alt-dropdown">
                        <div className="alt-dropdown-toggle">
                          <span className="alt-dots">•••</span>
                        </div>
                        <div className="alt-dropdown-menu" style={achievementStyles.dropdownMenu}>
                          <div 
                            className="alt-dropdown-item" 
                            onClick={() => (window.location.href = `/updateAchievements/${achievement.id}`)}
                            style={achievementStyles.dropdownItem}
                          >
                            <FaEdit className="alt-item-icon" />
                            <span>Edit Achievement</span>
                          </div>
                          <div 
                            className="alt-dropdown-item delete" 
                            onClick={() => handleDelete(achievement.id)}
                            style={achievementStyles.dropdownItem}
                          >
                            <RiDeleteBin6Fill className="alt-item-icon" />
                            <span>Delete Achievement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="alt-post-body">
                  <h3 className="alt-post-title">{achievement.title}</h3>
                  <p className="alt-post-text" style={{ whiteSpace: "pre-line" }}>{achievement.description}</p>
                </div>
                
                {achievement.imageUrl && (
                  <div className="alt-media-container media-count-1">
                    <div className="alt-media-item">
                      <div className="alt-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <img 
                          src={`http://localhost:8080/achievements/images/${achievement.imageUrl}`}
                          alt="Achievement" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllAchievements;
