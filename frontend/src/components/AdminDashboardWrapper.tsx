import React, { useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { AdminDashboard } from './AdminDashboard';
import { ValidatedAccounts } from './ValidatedAccounts';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminNavigation } from './AdminNavigation';

export const AdminDashboardWrapper = () => {
  const { users, handleApproveUser, handleRejectUser } = useFirestore();
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.role !== 'admin') {
      navigate('/intervenant');
    }
  }, [userData, navigate]);

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <div>
      <AdminNavigation />
      <Routes>
        <Route 
          path="validation" 
          element={
            <AdminDashboard
              users={users}
              onApproveUser={handleApproveUser}
              onRejectUser={handleRejectUser}
            />
          }
        />
        <Route 
          path="accounts" 
          element={<ValidatedAccounts users={users} />}
        />
      </Routes>
    </div>
  );
}; 