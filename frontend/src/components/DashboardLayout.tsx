// src/components/DashboardLayout.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EmployeeProfile } from './EmployeeProfile';
import { getUserData, updateUserProfile } from '../config/firebase';
import { User } from '../type';

export const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          if (data) {
            setUserData(data as User);
          } else {
            setError("Profil utilisateur non trouvé");
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des données:", err);
          setError("Erreur lors du chargement du profil");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!currentUser || !userData) return;

    try {
      await updateUserProfile(currentUser.uid, updates);
      setUserData(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError("Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
          <p className="text-gray-600">Impossible de charger votre profil.</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard Intervenant</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {userData.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmployeeProfile 
            user={userData}
            onUpdateUser={handleUpdateUser}
          />
        </div>
      </main>
    </div>
  );
};