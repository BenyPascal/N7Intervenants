import React, { useState } from 'react';
import { User } from '../type';
import { SkillScore } from './SkillScore';
import { UserCircle, CheckCircle, XCircle, Calendar, Award, Briefcase, X } from 'lucide-react';
import { ProfilePhoto } from './ProfilePhoto';

interface AdminDashboardProps {
  users: User[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
}

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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  onApproveUser,
  onRejectUser,
}) => {
  const [skillFilter, setSkillFilter] = useState('');
  const [showPending, setShowPending] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    if (user.role === 'admin') return false;
    
    const matchesSkill = skillFilter
      ? user.skills.some(skill =>
          skill.name.toLowerCase().includes(skillFilter.toLowerCase())
        )
      : true;
    
    const matchesStatus = showPending ? user.status === 'pending' : true;
    
    return matchesSkill && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">Approuvé</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">Rejeté</span>;
      default:
        return <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {selectedPhoto && (
        <PhotoModal 
          photoURL={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Administrateur</h1>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Filtrer par compétence..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPending}
              onChange={(e) => setShowPending(e.target.checked)}
              className="rounded"
            />
            Afficher uniquement les demandes en attente
          </label>
        </div>

        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => user.photoURL && setSelectedPhoto(user.photoURL)}
                    className={user.photoURL ? "cursor-pointer" : ""}
                  >
                    <ProfilePhoto
                      photoURL={user.photoURL}
                      firstname={user.firstname}
                      lastname={user.lastname}
                      size="sm"
                      onPhotoChange={() => Promise.resolve()}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.firstname} {user.lastname}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-1">
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                
                {user.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveUser(user.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Approuver"
                    >
                      <CheckCircle className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => onRejectUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Rejeter"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Award className="h-5 w-5" />
                    <h4 className="font-medium">Compétences</h4>
                  </div>
                  <div className="grid gap-2">
                    {user.skills.map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{skill.name}</span>
                        <SkillScore score={skill.score} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Briefcase className="h-5 w-5" />
                    <h4 className="font-medium">Projets</h4>
                  </div>
                  <div className="grid gap-2">
                    {user.projects.map((project) => (
                      <div key={project.id} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-600">{project.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Calendar className="h-5 w-5" />
                    <h4 className="font-medium">Disponibilités</h4>
                  </div>
                  <div className="grid gap-2">
                    {user.availability.map((av) => (
                      <div key={av.id} className="p-2 bg-gray-50 rounded">
                        <div>{av.month}</div>
                        <div className="text-sm text-gray-600">{av.status}</div>
                      </div>
                    ))}
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