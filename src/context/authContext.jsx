import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { dataDecrypt } from '@/utils/data-decrypt';
import { dataEncrypt } from '@/utils/data-encrypt';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const saveUserToLocalStorage = (user) => {
    window.localStorage.setItem("user", dataEncrypt(user));
  };

  const loadUserFromLocalStorage = () => {
    const storedUser = window.localStorage.getItem("user");
    return storedUser ? dataDecrypt(storedUser) : null;
  };

  // Cargar usuario desde localStorage
  useEffect(() => {
    setUser(loadUserFromLocalStorage());
  }, []);

  // Función para registrar usuarios
  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserFirestore(result.user);
      return result;
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const signin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateSignInTime(result.user);
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  // Cerrar sesión
  const signout = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          disabled: true,
          lastSignOutTime: new Date().toISOString(),
        });
      }
      await signOut(auth);
      setUser(null);
      window.localStorage.removeItem("user");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserFirestore(result.user);
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  // Guardar usuario en Firestore
  const saveUserFirestore = async (newUser) => {
    await setDoc(doc(db, 'users', newUser.uid), {
      email: newUser.email,
      uid: newUser.uid,
      displayName: newUser.displayName,
      lastSignInTime: new Date().toISOString(),
      disabled: false,
      photoURL: newUser.photoURL || '/Images/13.png',
    });
  };

  // Actualizar el último tiempo de inicio de sesión
  const updateSignInTime = async (currentUser) => {
    await setDoc(doc(db, 'users', currentUser.uid), {
      lastSignInTime: new Date().toISOString(),
      disabled: false,
    }, { merge: true });
  };

  // Función para resetear la contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      throw error;
    }
  };

  // Manejo del estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        await updateSignInTime(currentUser);
        if (!user || currentUser.uid !== user.uid) {
          setUser(currentUser);
        }
        saveUserToLocalStorage(currentUser);
        if (location.pathname === '/') navigate('/app');
      } else {
        setUser(null);
        window.localStorage.removeItem("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Memoize el contexto para evitar renderizados innecesarios
  const contextValue = useMemo(() => ({
    signup,
    signin,
    user,
    signout,
    loading,
    signInWithGoogle,
    resetPassword,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
