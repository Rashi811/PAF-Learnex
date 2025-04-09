import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, User as UserIcon, Loader, Search, X } from 'lucide-react';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users whenever the search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(lowercasedSearch) || 
        user.username?.toLowerCase().includes(lowercasedSearch) ||
        user.email?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/users');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched users:', data);
      setUsers(data);
      setFilteredUsers(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const generatePDF = () => {
    // We'll use a different approach without jsPDF autoTable
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('User List', 14, 22);
      
      // Set smaller font for table
      doc.setFontSize(10);
      
      // Table header
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(66, 133, 244);
      doc.rect(14, 30, 182, 10, 'F');
      doc.text('ID', 16, 37);
      doc.text('Name', 40, 37);
      doc.text('Username', 90, 37);
      doc.text('Email', 140, 37);
      
      // Reset text color for data
      doc.setTextColor(0, 0, 0);
      
      // Table data
      let y = 45;
      // Use filtered users instead of all users
      filteredUsers.forEach((user, i) => {
        const rowY = y + (i * 10);
        
        // Alternate row background for readability
        if (i % 2 === 1) {
          doc.setFillColor(240, 240, 240);
          doc.rect(14, rowY - 5, 182, 10, 'F');
        }
        
        doc.text(String(user.id), 16, rowY);
        doc.text(user.name || 'N/A', 40, rowY);
        doc.text(user.username || 'N/A', 90, rowY);
        doc.text(user.email || 'N/A', 140, rowY);
      });
      
      // Save the PDF
      doc.save('user-list.pdf');
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 my-6">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
        <button
          onClick={generatePDF}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name, username or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          {users.length === 0 ? (
            <p className="text-blue-600">No users found in the system.</p>
          ) : (
            <p className="text-blue-600">No users match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li 
                key={user.id} 
                onClick={() => handleUserClick(user.id)}
                className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                    {user.name ? (
                      <span>{user.name.split(' ').map(n => n[0]).join('')}</span>
                    ) : (
                      <UserIcon size={18} />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-blue-800">{user.name}</div>
                    <div className="text-sm text-purple-600">@{user.username}</div>
                    {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Show result count when searching */}
      {searchTerm && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default UserListPage;