import React, { useState } from 'react';
import { Plus, X, Github, Pencil, Trash2 } from 'lucide-react';
import { Project } from '../type';

interface ProjectsListProps {
  projects: Project[];
  onAddProject?: (project: Project) => void;
  onRemoveProject?: (projectId: string) => void;
  onUpdateProject?: (project: Project) => void;
  readonly?: boolean;
}

type CompletionStatus = 'in progress' | 'halted' | 'almost' | 'completed';

// Définition des états de complétion possibles
const completionStates = {
  'in progress': { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
  'halted': { label: 'Arrêté', color: 'bg-red-100 text-red-800' },
  'almost': { label: 'Presque fini', color: 'bg-green-100 text-green-600' },
  'completed': { label: 'Abouti', color: 'bg-green-100 text-green-800' }
};

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onAddProject,
  onRemoveProject,
  onUpdateProject,
  readonly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    skills: [],
    githubUrl: '',
    year: new Date().getFullYear().toString(),
    duration: '',
    completionStatus: 'in progress'
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name) {
      setError("Le nom du projet est requis");
      return;
    }
    if (!newProject.description) {
      setError("La description du projet est requise");
      return;
    }
    if (!newProject.year || !newProject.duration) {
      setError("L'année et la durée sont requises");
      return;
    }

    if (onAddProject) {
      onAddProject({
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        skills: newProject.skills || [],
        githubUrl: newProject.githubUrl || '',
        year: newProject.year,
        duration: newProject.duration,
        completionStatus: newProject.completionStatus || 'in progress'
      });
      setNewProject({
        name: '',
        description: '',
        skills: [],
        githubUrl: '',
        year: new Date().getFullYear().toString(),
        duration: '',
        completionStatus: 'in progress'
      });
      setError(null);
      setIsAdding(false);
    }
  };

  const removeSkillFromNew = (e: React.MouseEvent, skillToRemove: string) => {
    e.preventDefault();
    e.stopPropagation();
    setNewProject(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const value = input.value.trim();
      if (value && !newProject.skills?.includes(value)) {
        setNewProject(prev => ({
          ...prev,
          skills: [...(prev.skills || []), value]
        }));
        input.value = '';
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        skills: editingProject.skills?.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handleEdit = (project: Project) => {
    setIsEditing(project.id);
    setEditingProject(project);
  };

  const handleUpdate = () => {
    if (onUpdateProject && editingProject && editingProject.name && editingProject.description && editingProject.year && editingProject.duration) {
      onUpdateProject({
        id: editingProject.id || Date.now().toString(),
        name: editingProject.name,
        description: editingProject.description,
        skills: editingProject.skills || [],
        githubUrl: editingProject.githubUrl || '',
        year: editingProject.year,
        duration: editingProject.duration,
        completionStatus: editingProject.completionStatus || 'in progress'
      });
      setIsEditing(null);
      setEditingProject(null);
      setNewSkill('');
    }
  };

  const handleEditingSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleEditingSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const value = newSkill.trim();
      if (value && !editingProject?.skills?.includes(value)) {
        setEditingProject(prev => ({
          ...prev,
          skills: [...(prev?.skills || []), value]
        }));
        setNewSkill('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
          {isEditing === project.id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={editingProject?.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingProject?.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description du projet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies utilisées
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {editingProject?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => removeSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={handleEditingSkillInputChange}
                    onKeyDown={handleEditingSkillKeyDown}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Appuyez sur Entrée, Espace ou Virgule pour ajouter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année de réalisation
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={editingProject?.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject!, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée <br />
                    <br />
                  </label>
                  <input
                    type="text"
                    value={editingProject?.duration || ''}
                    onChange={(e) => setEditingProject({ ...editingProject!, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 3 mois"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    État d'avancement
                  </label>
                  <select
                    value={editingProject?.completionStatus || 'in progress'}
                    onChange={(e) => setEditingProject({ 
                      ...editingProject!, 
                      completionStatus: e.target.value as CompletionStatus 
                    })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(completionStates).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien Projet (GitHub/Drive...) (optionnel)
                </label>
                <input
                  type="url"
                  value={editingProject?.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject!, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setNewSkill('');
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
            <>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      completionStates[project.completionStatus || 'in progress'].color
                    }`}>
                      {completionStates[project.completionStatus || 'in progress'].label}
                    </span>
                  </div>
                  <p className="text-gray-600">{project.description}</p>
                  
                  {project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {project.year} • {project.duration}
                    </span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemoveProject?.(project.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Formulaire d'ajout */}
      {!readonly && isAdding ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du projet
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom du projet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description du projet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies utilisées
              </label>
              <div className="space-y-2">
                {newProject.skills && newProject.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newProject.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => removeSkillFromNew(e, skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  onKeyDown={handleSkillsChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Appuyez sur Entrée, Espace ou Virgule pour ajouter"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année de réalisation
                </label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={newProject.year}
                  onChange={(e) => setNewProject(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée <br />
                  <br />
                </label>
                <input
                  type="text"
                  value={newProject.duration}
                  onChange={(e) => setNewProject(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 3 mois"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  État d'avancement
                </label>
                <select
                  value={newProject.completionStatus}
                  onChange={(e) => setNewProject(prev => ({ 
                    ...prev, 
                    completionStatus: e.target.value as CompletionStatus 
                  }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(completionStates).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lien Projet (Github/Drive...) (optionnel)
              </label>
              <input
                type="url"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/..."
              />
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
                setNewProject({
                  name: '',
                  description: '',
                  skills: [],
                  githubUrl: '',
                  year: new Date().getFullYear().toString(),
                  duration: '',
                  completionStatus: 'in progress'
                });
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
            Ajouter un projet
          </button>
        )
      )}
    </div>
  );
};