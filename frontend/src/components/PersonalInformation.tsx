import React, { useState } from 'react';
import { User } from '../type';
import { Pencil } from 'lucide-react';

interface PersonalInformationProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => Promise<void>;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(user);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!editingData.firstname || !editingData.lastname || !editingData.email || !editingData.filiere || !editingData.annee) {
        setError("Tous les champs sont obligatoires");
        return;
      }

      await onUpdateUser(editingData);
      setIsEditing(false);
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between pr-8">
          <h2 className="text-lg font-semibold text-gray-900">Informations Personnelles</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={editingData.firstname}
                onChange={(e) => setEditingData({ ...editingData, firstname: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={editingData.lastname}
                onChange={(e) => setEditingData({ ...editingData, lastname: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editingData.email}
                onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filière
              </label>
              <input
                type="text"
                value={editingData.filiere}
                onChange={(e) => setEditingData({ ...editingData, filiere: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <input
                type="text"
                value={editingData.annee}
                onChange={(e) => setEditingData({ ...editingData, annee: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingData(user);
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Prénom</dt>
              <dd className="mt-1 text-base text-gray-900">{user.firstname}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-base text-gray-900">{user.lastname}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-base text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Filière</dt>
              <dd className="mt-1 text-base text-gray-900">{user.filiere}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Année</dt>
              <dd className="mt-1 text-base text-gray-900">{user.annee}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}; 