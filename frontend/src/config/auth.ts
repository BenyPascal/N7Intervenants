// src/firebase/auth.ts
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
  } from 'firebase/auth';
  import app from './firebase';
  
  const auth = getAuth(app);
  
  export const signUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };
  
  export const logIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  
  export const logOut = async () => {
    return await signOut(auth);
  };
  
  export default auth;
  