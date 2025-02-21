import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface ProfilePhotoProps {
  photoURL?: string;
  onPhotoChange: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  firstname?: string;
  lastname?: string;
  readonly?: boolean;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ 
  photoURL, 
  onPhotoChange,
  size = 'md',
  firstname = '',
  lastname = '',
  readonly = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const getInitials = () => {
    const firstInitial = firstname?.charAt(0) || '';
    const lastInitial = lastname?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Fichier sélectionné:', file.name);
      try {
        await onPhotoChange(file);
        console.log('Photo changée avec succès');
      } catch (error) {
        console.error('Erreur lors du changement de photo:', error);
      }
    }
  };

  const handleClick = () => {
    if (!readonly) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative group ${!readonly && 'cursor-pointer'}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 relative`}
        onClick={handleClick}
      >
        {photoURL ? (
          <img 
            src={photoURL} 
            alt="Photo de profil"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <span className={`${textSizeClasses[size]} font-medium text-blue-600`}>
                {getInitials()}
              </span>
            </div>
            {!readonly && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-50 transition-all duration-200" />
                <Camera className="h-6 w-6 text-white z-10" />
              </div>
            )}
          </>
        )}
      </div>

      {!readonly && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
}; 