import React, { useState } from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import { Skill } from '../type';
import { SkillScore } from './SkillScore';

interface SkillsListProps {
  skills: Skill[];
  onAddSkill?: (skill: Skill) => void;
  onRemoveSkill?: (skillId: string) => void;
  onUpdateSkill?: (skill: Skill) => void;
  readonly?: boolean;
}

export const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  onUpdateSkill,
  readonly = false,
}) => {
  const [newSkill, setNewSkill] = useState({ name: '', score: 5 });
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) {
      setError("Le nom de la compétence est requis");
      return;
    }
    if (newSkill.score < 1 || newSkill.score > 10) {
      setError("Le score doit être entre 1 et 10");
      return;
    }
    if (onAddSkill) {
      onAddSkill({
        id: Date.now().toString(),
        ...newSkill,
      });
      setNewSkill({ name: '', score: 5 });
      setError(null);
      setIsAdding(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setIsEditing(skill.id);
    setEditingSkill(skill);
  };

  const handleUpdate = () => {
    if (onUpdateSkill && editingSkill && editingSkill.name) {
      onUpdateSkill({
        id: editingSkill.id,
        name: editingSkill.name,
        score: editingSkill.score
      });
      setIsEditing(null);
      setEditingSkill(null);
    }
  };

  // Trier les skills par score décroissant
  const sortedSkills = [...skills].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Liste des compétences */}
      {sortedSkills.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {sortedSkills.map((skill) => (
            <div key={skill.id}>
              {isEditing === skill.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la compétence
                      </label>
                      <input
                        type="text"
                        value={editingSkill?.name || ''}
                        onChange={(e) => setEditingSkill({ ...editingSkill!, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Niveau (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={editingSkill?.score || 5}
                        onChange={(e) => setEditingSkill({ ...editingSkill!, score: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-center mt-1 text-sm text-gray-600">
                        {editingSkill?.score}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </form>
              ) : (
                <div className="inline-flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <SkillScore score={skill.score} />
                    {!readonly && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-gray-400 hover:text-blue-500 focus:outline-none"
                        >
                          <Pencil size={18} />
                        </button>
                        {onRemoveSkill && (
                          <button
                            onClick={() => onRemoveSkill(skill.id)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout */}
      {!readonly && isAdding ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la compétence
              </label>
              <input
                type="text"
                placeholder="Ex: React, Java, FPGA..."
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={newSkill.score}
                onChange={(e) => setNewSkill(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center mt-1 text-sm text-gray-600">
                {newSkill.score}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 text-red-600 text-sm">{error}</div>
          )}
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setError(null);
                setNewSkill({ name: '', score: 5 });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ajouter
            </button>
          </div>
        </form>
      ) : (
        !readonly && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter une compétence
          </button>
        )
      )}
    </div>
  );
};