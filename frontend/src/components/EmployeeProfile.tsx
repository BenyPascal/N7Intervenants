import React, { useState } from 'react';
import { User } from '../type';
import { SkillsList } from './SkillsList';
import { ProjectsList } from './ProjectsList';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { LogOut, User as UserIcon, Briefcase, Calendar, Award, ChevronRight, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PersonalInformation } from './PersonalInformation';
import { ProfilePhoto } from './ProfilePhoto';
import { uploadProfilePhoto } from '../config/firebase';

interface EmployeeProfileProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => Promise<void>;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ user, onUpdateUser }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleUpdatePersonalInfo = async (updates: Partial<User>) => {
    try {
      await onUpdateUser(updates);
      setShowPersonalInfo(false); // Ferme la modale après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      default:
        return 'bg-red-50 text-red-700 ring-red-600/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      default:
        return 'Rejeté';
    }
  };

  const handlePhotoChange = async (file: File) => {
    try {
      console.log('Début de l\'upload de la photo');
      const photoURL = await uploadProfilePhoto(user.id, file);
      console.log('Photo uploadée:', photoURL);
      
      await onUpdateUser({ photoURL });
      console.log('Profil mis à jour avec la nouvelle photo');
    } catch (error) {
      console.error('Erreur lors du changement de photo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/75 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Profil Intervenant
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPersonalInfo(true)}
                className="group inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Informations personnelles
              </button>
              <button
                onClick={handleLogout}
                className="group inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showPersonalInfo && (
        <PersonalInformation
          user={user}
          onClose={() => setShowPersonalInfo(false)}
          onUpdate={handleUpdatePersonalInfo}
        />
      )}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* En-tête du profil */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 -mt-12">
                  <div className="flex items-center justify-center h-24 w-24">
                    <ProfilePhoto 
                      photoURL={user.photoURL}
                      onPhotoChange={handlePhotoChange}
                      size="lg"
                      firstname={user.firstname}
                      lastname={user.lastname}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.firstname}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections avec design amélioré */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Section Compétences */}
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02] duration-300">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Compétences</h3>
                    <p className="mt-1 text-sm text-gray-500">Gérez vos expertises techniques</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6">
                <SkillsList
                  skills={user.skills}
                  onAddSkill={(skill) => onUpdateUser({ skills: [...user.skills, skill] })}
                  onRemoveSkill={(skillId) => 
                    onUpdateUser({ skills: user.skills.filter(s => s.id !== skillId) })
                  }
                  onUpdateSkill={(updatedSkill) => {
                    const updatedSkills = user.skills.map(skill => 
                      skill.id === updatedSkill.id ? updatedSkill : skill
                    );
                    onUpdateUser({ skills: updatedSkills });
                  }}
                />
              </div>
            </section>

            {/* Section Projets */}
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02] duration-300">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Projets</h3>
                    <p className="mt-1 text-sm text-gray-500">Vos réalisations principales</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6">
                <ProjectsList
                  projects={user.projects}
                  onAddProject={(project) => onUpdateUser({ projects: [...user.projects, project] })}
                  onRemoveProject={(projectId) =>
                    onUpdateUser({ projects: user.projects.filter(p => p.id !== projectId) })
                  }
                  onUpdateProject={(updatedProject) => {
                    const updatedProjects = user.projects.map(project =>
                      project.id === updatedProject.id ? updatedProject : project
                    );
                    onUpdateUser({ projects: updatedProjects });
                  }}
                />
              </div>
            </section>

            {/* Section Disponibilités */}
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:scale-[1.02] duration-300">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-100">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Disponibilités</h3>
                    <p className="mt-1 text-sm text-gray-500">Planning des 6 prochains mois</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6">
              <AvailabilityCalendar
                availabilities={user.availability || []}
                onUpdateAvailability={(updatedAvailability) => {
                  const newAvailabilities = [...(user.availability || [])];
                  const index = newAvailabilities.findIndex(a => a.month === updatedAvailability.month);
                  
                  if (index >= 0) {
                    newAvailabilities[index] = updatedAvailability;
                  } else {
                    newAvailabilities.push(updatedAvailability);
                  }
                  
                  onUpdateUser({ availability: newAvailabilities });
                }}
                readonly={false}
              />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeProfile