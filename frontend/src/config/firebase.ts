// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { Availability, User } from '../type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

import { getStorage } from 'firebase/storage';

const storage = getStorage(app);


export const createNewUser = async (uid: string, email: string, firstname: string, lastname: string, filiere: string, annee: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const newUser: User = {
      id: uid,
      uid: uid,
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

    await setDoc(userRef, newUser);
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `profilePhotos/${userId}/${Date.now()}-${file.name}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
};

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
