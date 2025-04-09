import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Settings, Bell } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/', name: 'Home', icon: <Home size={20} />, color: 'blue' },
    { path: '/friends', name: 'Friends', icon: <Users size={20} />, color: 'green' },
    { path: '/notifications', name: 'Notifications', icon: <Bell size={20} />, color: 'orange' },
    { path: '/account', name: 'Account', icon: <Settings size={20} />, color: 'purple' }
  ];
  
  const getMenuItemColors = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-100 text-blue-600' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-100 text-green-600' : 'text-green-600 hover:bg-green-50',
      orange: isActive ? 'bg-orange-100 text-orange-600' : 'text-orange-600 hover:bg-orange-50',
      purple: isActive ? 'bg-purple-100 text-purple-600' : 'text-purple-600 hover:bg-purple-50'
    };
    
    return colors[color];
  };
  
  return (
    <aside className={`bg-white border-r border-blue-100 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="py-6 px-3 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="text-center mb-4">
          {isOpen ? (
            <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <span className="font-bold">M</span>
              </div>
            </div>
          )}
        </div>
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition-all p-3 ${
                      getMenuItemColors(item.color, isActive)
                    } ${isOpen ? '' : 'justify-center'}`
                  }
                >
                  <span className={`flex-shrink-0 ${!isOpen && 'mr-0'}`}>{item.icon}</span>
                  {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;