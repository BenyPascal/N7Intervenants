import React, { useState } from 'react';
import { User, Availability, Project } from '../type';
import { UserCircle, Award, Briefcase, Calendar, Search, X, Github, Clock, CheckCircle } from 'lucide-react';
import { SkillScore } from './SkillScore';
import { ProfilePhoto } from './ProfilePhoto';

interface ValidatedAccountsProps {
  users: User[];
}

const availabilityStates = {
  'available': { label: 'Disponible', color: 'bg-green-100 text-green-800' },
  'busy': { label: 'Un peu occupé', color: 'bg-yellow-100 text-yellow-800' },
  'unavailable': { label: 'Pas disponible', color: 'bg-red-100 text-red-800' }
};

interface AvailabilityDetailsProps {
  availability: Availability;
  onClose: () => void;
}

const AvailabilityDetails: React.FC<AvailabilityDetailsProps> = ({ availability, onClose }) => {
  const monthDate = new Date(availability.month + '-01');
  const monthDisplay = monthDate.toLocaleDateString('fr-FR', { 
    month: 'long',
    year: 'numeric'
  });

  // Gestionnaire pour empêcher la propagation du clic depuis le contenu du modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Fermeture lors du clic sur l'arrière-plan
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-lg w-full m-4"
        onClick={handleModalClick} // Empêche la fermeture lors du clic sur le contenu
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Disponibilités - {monthDisplay}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className={`p-3 rounded ${availabilityStates[availability.status].color}`}>
            <p className="font-medium">Statut du mois</p>
            <p>{availabilityStates[availability.status].label}</p>
          </div>

          {availability.weeks && availability.weeks.length > 0 && (
            <div>
              <p className="font-medium mb-2">Détail par semaine :</p>
              <div className="space-y-2">
                {availability.weeks.map((weekStatus, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded ${availabilityStates[weekStatus].color}`}
                  >
                    <p>Semaine {index + 1}</p>
                    <p className="font-medium">{availabilityStates[weekStatus].label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  const statusColors = {
    'in progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'halted': 'bg-red-100 text-red-800',
    'almost': 'bg-yellow-100 text-yellow-800'
  };

  const statusLabels = {
    'in progress': 'En cours',
    'completed': 'Terminé',
    'halted': 'Arrêté',
    'almost': 'Presque terminé'
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full m-4"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>Durée : {project.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Année : {project.year}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compétences utilisées</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-gray-400" />
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[project.completionStatus]}`}>
              {statusLabels[project.completionStatus]}
            </span>
          </div>

          {project.githubUrl && (
            <div>
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Github className="h-5 w-5" />
                <span>Voir sur GitHub</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PhotoModalProps {
  photoURL: string;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photoURL, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl max-h-[90vh] mx-4"
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={photoURL} 
          alt="Photo de profil" 
          className="rounded-lg object-contain max-h-[90vh]"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export const ValidatedAccounts: React.FC<ValidatedAccountsProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Fonction pour obtenir les 6 prochains mois
  const getNextSixMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + 1 +i);
      months.push(month.toISOString().substring(0, 7)); // Format: "2024-03"
    }
    return months;
  };

  // Fonction pour obtenir la disponibilité d'un mois donné
  const getMonthAvailability = (user: User, monthStr: string): Availability => {
    const existingAvailability = user.availability.find(av => av.month === monthStr);
    if (existingAvailability) {
      return existingAvailability;
    }
    
    // Créer une disponibilité par défaut si elle n'existe pas
    return {
      id: monthStr,
      month: monthStr,
      status: 'available',
      weeks: Array(4).fill('available')
    };
  };

  const validatedUsers = users.filter(user => 
    user.status === 'approved' &&
    user.role !== 'admin' &&
    (
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (
      filterSkill === '' ||
      user.skills.some(skill => 
        skill.name.toLowerCase().includes(filterSkill.toLowerCase())
      )
    )
  );

  const nextSixMonths = getNextSixMonths();

  const ProjectSkillsPreview: React.FC<{ skills: string[] }> = ({ skills }) => {
    const maxDisplayed = 3;
    const displayedSkills = skills.slice(0, maxDisplayed);
    const remainingCount = skills.length - maxDisplayed;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {displayedSkills.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {selectedPhoto && (
        <PhotoModal 
          photoURL={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
      
      {selectedAvailability && (
        <AvailabilityDetails
          availability={selectedAvailability}
          onClose={() => setSelectedAvailability(null)}
        />
      )}
      
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un intervenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filtrer par compétence..."
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {validatedUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  onClick={() => user.photoURL && setSelectedPhoto(user.photoURL)}
                  className={user.photoURL ? "cursor-pointer" : ""}
                >
                  <ProfilePhoto
                    photoURL={user.photoURL}
                    firstname={user.firstname}
                    lastname={user.lastname}
                    size="sm"
                    onPhotoChange={async () => Promise.resolve()}
                    readonly={true}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    {user.filiere} - {user.annee}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Compétences</h4>
                  </div>
                  <div className="space-y-2">
                    {user.skills.sort((a, b) => b.score - a.score).map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{skill.name}</span>
                        <SkillScore score={skill.score} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Projets</h4>
                  </div>
                  <div className="space-y-2">
                    {user.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {project.description}
                        </div>
                        <ProjectSkillsPreview skills={project.skills} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Disponibilités</h4>
                  </div>
                  <div className="space-y-2">
                    {nextSixMonths.map((monthStr) => {
                      const availability = getMonthAvailability(user, monthStr);
                      const monthDate = new Date(monthStr + '-01');
                      const monthDisplay = monthDate.toLocaleDateString('fr-FR', { 
                        month: 'long',
                        year: 'numeric'
                      });

                      return (
                        <button
                          key={monthStr}
                          onClick={() => setSelectedAvailability(availability)}
                          className={`w-full text-left p-2 rounded ${availabilityStates[availability.status].color} hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{monthDisplay}</span>
                            <span className="text-sm">
                              {availabilityStates[availability.status].label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 