import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, Users } from 'lucide-react';

export const AdminNavigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <NavLink
            to="/admin/validation"
            className={({ isActive }) =>
              `flex items-center px-3 py-4 text-sm font-medium ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <UserCheck className="h-5 w-5 mr-2" />
            Validation des comptes
          </NavLink>
          
          <NavLink
            to="/admin/accounts"
            className={({ isActive }) =>
              `flex items-center px-3 py-4 text-sm font-medium ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Users className="h-5 w-5 mr-2" />
            Comptes validés
          </NavLink>
        </div>
      </div>
    </nav>
  );
}; 