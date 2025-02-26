export interface Skill {
    id: string;
    name: string;
    score: number;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    skills: string[];
    githubUrl?: string;
    year: string;
    duration: string;
    completionStatus: 'in progress' | 'halted' | 'almost' | 'completed';
  }
  
  export interface Availability {
    id: string;
    month: string;
    status: 'available' | 'busy' | 'unavailable';
    weeks?: ('available' | 'busy' | 'unavailable')[];
  }
  
  export interface User {
    id: string;
    uid: string;
    email: string;
    firstname: string;
    lastname: string;
    filiere: 'SN' | '3EA' | 'MF2E';
    annee: '1A' | '2A' | '3A';
    role: 'admin' | 'employee';
    status : 'pending' | 'approved' | 'rejected';
    isApproved: boolean;
    skills: Skill[];
    projects: Project[];
    availability: Availability[];
    photoURL?: string;
  }

  export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  } 