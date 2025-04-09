import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  
  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/users');
      if (response.ok) {
        const users = await response.json();
        const filteredUsers = users.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
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
    fetchUsers();
  }, []);
  
  // Dummy data for feed posts
  const feedPosts = [
    {
      id: 1,
      userId: 2,
      username: "jane_smith",
      name: "Jane Smith",
      content: "Just launched a new design portfolio! Check it out: designportfolio.com",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      userId: 3,
      username: "alex_j",
      name: "Alex Johnson",
      content: "Excited to announce I'm joining the team at TechCorp! #NewBeginnings",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 12
    },
    {
      id: 3,
      userId: 5,
      username: "emily_c",
      name: "Emily Chen",
      content: "Sharing my thoughts on the latest digital marketing trends in my new blog post.",
      timestamp: "Yesterday",
      likes: 18,
      comments: 3
    },
    {
      id: 4,
      userId: 5,
      username: "emily_c",
      name: "Emily Chen",
      content: "Sharing my thoughts on the latest digital marketing trends in my new blog post.",
      timestamp: "Yesterday",
      likes: 18,
      comments: 3
    },
    {
      id: 5,
      userId: 5,
      username: "emily_c",
      name: "Emily Chen",
      content: "Sharing my thoughts on the latest digital marketing trends in my new blog post.",
      timestamp: "Yesterday",
      likes: 18,
      comments: 3
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar - user profile summary */}
        {/* <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-white shadow-md flex items-center justify-center mb-4">
                {currentUser?.name ? (
                  <span className="font-medium text-xl text-purple-600">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                ) : (
                  <User size={32} className="text-purple-600" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{currentUser?.name}</h2>
              <p className="text-purple-600">@{currentUser?.username}</p>
              
              <div className="mt-4 w-full">
                <Link 
                  to="/account" 
                  className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition shadow-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2 text-gray-800">Stats</h3>
              <div className="flex justify-between text-sm">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="font-bold text-blue-600">235</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <p className="font-bold text-purple-600">114</p>
                  <p className="text-gray-600">Following</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="font-bold text-green-600">18</p>
                  <p className="text-gray-600">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Center - feed posts */}
        <div className="w-full md:w-2/4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-4">
                {currentUser?.name ? (
                  <span className="font-medium text-sm text-purple-600">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                ) : (
                  <User size={20} className="text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <textarea 
                  className="w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What's on your mind?"
                  rows="3"
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 shadow-sm">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feed posts */}
          <div className="space-y-6">
            {feedPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-sm text-purple-600">
                      {post.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <Link to={`/users/${post.userId}`} className="font-medium hover:underline text-gray-800">
                      {post.name}
                    </Link>
                    <p className="text-xs text-purple-600">@{post.username} · {post.timestamp}</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-700">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <button className="flex items-center hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5.0 000 6.364L12 20.364l7.682-7.682a4.5 4.5.0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5.0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center hover:text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right sidebar - suggested users */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">People you may know</h2>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-sm text-purple-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Link to={`/users/${user.id}`} className="font-medium hover:underline text-gray-800">
                      {user.name}
                    </Link>
                    {/* <p className="text-xs text-purple-600">@{user.username}</p> */}
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to={`/users`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View more
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Trending Topics</h2>
            <div className="space-y-2">
              <div className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-sm font-medium text-purple-600">#WebDevelopment</p>
                <p className="text-xs text-gray-500">4.5k posts</p>
              </div>
              <div className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-sm font-medium text-purple-600">#ReactJS</p>
                <p className="text-xs text-gray-500">3.2k posts</p>
              </div>
              <div className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-sm font-medium text-purple-600">#UIDesign</p>
                <p className="text-xs text-gray-500">2.8k posts</p>
              </div>
              <div className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="text-sm font-medium text-purple-600">#TailwindCSS</p>
                <p className="text-xs text-gray-500">1.9k posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;