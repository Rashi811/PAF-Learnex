import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, Edit, Save, X, Trash2, Shield, Link as LinkIcon, LogOut } from 'lucide-react';
import { generateProfilePDF } from '../utils/pdfGenerator';

const AccountPage = () => {
  const { currentUser, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ ...currentUser });
  const [loading, setLoading] = useState(false);
  
  // Fetch user data on initial render (or reload user after update)
  useEffect(() => {
    setUserData({ ...currentUser });
  }, [currentUser]);
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/userupdate/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Update user data in context after successful update
        updateUser(userData);
        setIsEditing(false);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData({ ...currentUser });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/usersdelete/${currentUser.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Account deleted');
          logout();
        } else {
          console.error('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account', error);
      }
    }
  };

  const generatePDF = () => {
    generateProfilePDF(currentUser);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-50">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 px-3 py-1.5 border border-blue-300 rounded-md hover:bg-blue-50 shadow-sm"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md hover:border-red-300 hover:bg-red-50 shadow-sm"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-1 px-3 py-1.5 border border-green-300 rounded-md hover:bg-green-50 shadow-sm"
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-4 border border-white shadow-sm">
              <div className="text-lg font-bold text-purple-600">
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : ''}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{currentUser.name}</h3>
              <p className="text-sm text-purple-600">@{currentUser.username}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full mb-4 md:mb-0 md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
                />
              ) : (
                <p className="text-gray-900 py-2 border-b border-blue-100">{currentUser.name}</p>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className="w-full border border-blue-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
                />
              ) : (
                <p className="text-gray-900 py-2 border-b border-blue-100">{currentUser.username}</p>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <p className="text-gray-900 py-2 capitalize border-b border-blue-100">
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-md text-sm">
                  {currentUser.provider || 'Email'}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
              />
            ) : (
              <p className="text-gray-900 py-2 border-b border-blue-100">{currentUser.email}</p>
            )}
          </div>

          {isEditing && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                className="w-full border border-blue-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                For security reasons, we don't display your current password.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-blue-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Security Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-transparent rounded-md">
            <div className="flex">
              <Shield size={20} className="text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Two-factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors shadow-sm">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-purple-50 to-transparent rounded-md">
            <div className="flex">
              <LinkIcon size={20} className="text-purple-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Connected Accounts</h3>
                <p className="text-sm text-gray-500">Link your accounts for easier login</p>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50 transition-colors shadow-sm">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-md">
            <div className="flex">
              <LogOut size={20} className="text-green-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Session Management</h3>
                <p className="text-sm text-gray-500">Manage your active sessions</p>
              </div>
            </div>
            <button className="px-3 py-1.5 border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors shadow-sm">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;