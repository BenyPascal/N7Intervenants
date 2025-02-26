import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../config/auth';
import { createNewUser } from '../config/firebase';
import { UserPlus } from 'lucide-react';

// Constantes pour les options
const FILIERES = ['SN', '3EA', 'MF2E'] as const;
const ANNEES = ['1A', '2A', '3A'] as const;

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    filiere: FILIERES[0], // Valeur par défaut
    annee: ANNEES[0] // Valeur par défaut
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      // Création du compte Firebase Auth
      const result = await signUp(formData.email, formData.password);
      
      if (result.user) {
        // Création du profil utilisateur dans Firestore
        await createNewUser(
          result.user.uid,
          formData.email,
          formData.firstname,
          formData.lastname,
          formData.filiere,
          formData.annee
        );
        
        navigate('/intervenant');
      }
    } catch (err) {
      console.error('Erreur lors de la création du compte:', err);
      setError('Échec de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Prénom</label>
                <input
                  name="firstname"
                  type="text" 
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label className="block mb-2">Nom</label>
                <input
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange} 
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="********"
                />
              </div>

              <div>
                <label className="block mb-2">Confirmer</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="********"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Filière</label>
                <select
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white"
                  required
                >
                  {FILIERES.map((filiere) => (
                    <option key={filiere} value={filiere}>
                      {filiere}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Année</label>
                <select
                  name="annee"
                  value={formData.annee}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white"
                  required
                >
                  {ANNEES.map((annee) => (
                    <option key={annee} value={annee}>
                      {annee}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => navigate('/')}
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                  >
                    Connectez-vous
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
