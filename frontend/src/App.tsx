import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import SignUp from './components/SignUp';
import { PrivateRoute } from './routes/PrivateRoute';
import { EmployeeProfile } from './components/EmployeeProfile';
import { useAuth } from './contexts/AuthContext';
import { getUserData, updateUserProfile } from './config/firebase';
import { useState, useEffect } from 'react';
import { User } from './type';
import { AdminDashboardWrapper } from './components/AdminDashboardWrapper';
import { Toaster } from 'react-hot-toast';

const EmployeeProfileWrapper = () => {
  const { currentUser } = useAuth();
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

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-gray-600">{error || "Profil non trouvé"}</p>
        </div>
      </div>
    );
  }

  return <EmployeeProfile user={userData} onUpdateUser={handleUpdateUser} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/intervenant" 
            element={
              <PrivateRoute>
                <EmployeeProfileWrapper />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboardWrapper />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;