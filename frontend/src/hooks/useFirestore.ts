import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  setDoc 
} from 'firebase/firestore';
import { User, Skill, Project, Availability } from '../type';
import { toast } from 'react-hot-toast';

export const useFirestore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'approved',
        isApproved: true
      });
      toast.success('Utilisateur approuvé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation de l\'utilisateur');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'rejected',
        isApproved: false
      });
      toast.success('Utilisateur rejeté');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet de l\'utilisateur');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const createNewUser = async (uid: string, email: string, firstname: string, lastname: string, filiere: string, annee: string) => {
    try {
      const newUser: Omit<User, 'id'> & { uid: string } = {
        uid,
        email,
        firstname,
        lastname,
        filiere,
        annee,
        role: 'employee',
        status: 'pending',
        isApproved: false,
        skills: [],
        projects: [],
        availability: []
      };

      await setDoc(doc(db, 'users', uid), newUser);
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData: User[] = [];
      snapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { 
    users, 
    loading,
    getUserData, 
    handleApproveUser, 
    handleRejectUser, 
    handleUpdateUser,
    createNewUser 
  };
};