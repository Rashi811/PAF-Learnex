import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavbarSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/users');
      if (response.ok) {
        const users = await response.json();
        return users;
      } else {
        console.error('Failed to fetch users');
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Fetch and filter users based on the search term
    const searchUsers = async () => {
      const users = await fetchUsers();

      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    };

    searchUsers();
  }, [searchTerm]);

  const handleUserSelect = (userId) => {
    navigate(`/users/${userId}`);
    setSearchTerm('');
    setIsSearching(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearching(true)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-purple-100 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer border-b border-purple-100 last:border-b-0 transition-colors"
              onClick={() => handleUserSelect(user.id)}
            >
              <div className="font-medium text-blue-800">{user.name}</div>
              <div className="text-sm text-purple-600">@{user.username}</div>
            </div>
          ))}
        </div>
      )}

      {isSearching && searchTerm && searchResults.length === 0 && (
        <div className="absolute w-full mt-1 bg-white border border-purple-100 rounded-lg shadow-lg z-10">
          <div className="p-3 text-gray-500">No users found</div>
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
