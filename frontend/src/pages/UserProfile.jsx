import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin, Calendar, Mail, Link as LinkIcon } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data based on the userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-blue-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 rounded"></div>
                <div className="h-4 bg-blue-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm max-w-md mx-auto mt-8">
        <p className="text-center">No user data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-40"></div>
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row">
            <div className="relative -mt-20 mb-4">
              <div className="h-28 w-28 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-white shadow-md flex items-center justify-center">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User size={36} className="text-purple-600" />
                )}
              </div>
            </div>
            <div className="sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                  <p className="text-purple-600 font-medium">@{userData.username}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                    Follow
                  </button>
                  <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-md hover:bg-purple-50 transition-colors">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-700">This is a sample bio for {userData.name}. Users can add their personal description here.</p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2 text-blue-500" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2 text-green-500" />
                <span>New York, USA</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2 text-orange-500" />
                <span>Joined January 2023</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <LinkIcon size={16} className="mr-2 text-purple-500" />
                <a href={`http://localhost:5173/users/${userId}`} className="text-blue-600 hover:underline">http://localhost:5173/users/{userId}</a>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-6">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="font-bold text-blue-600">256</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="font-bold text-purple-600">124</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="font-bold text-green-600">43</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <div className="space-y-4">
          <div className="p-4 border border-blue-100 rounded-md bg-gradient-to-r from-blue-50 to-purple-50">
            <p className="text-gray-600">No recent activity to show</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Create your first post
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Photos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <p className="text-purple-400">Photo</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;