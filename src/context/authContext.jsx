import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc} from "firebase/firestore";
import { dataDecrypt } from "@/utils/data-decrypt";
import { dataEncrypt } from "@/utils/data-encrypt";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = location.pathname.split("/")[1];

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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
      
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  // Cerrar sesión
  const signout = async () => {
    try {
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
    await setDoc(doc(db, "users", newUser.uid), {
      email: newUser.email,
      uid: newUser.uid,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL || "/Images/13.png",
    });
  };

  // Actualizar el último tiempo de inicio de sesión
 

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
      setRedirecting(false);

      if (currentUser) {
        if (!user || currentUser.uid !== user.uid) {
          setUser(currentUser);
        }
        saveUserToLocalStorage(currentUser);

        if (location.pathname === `/${currentLang}`) {
          // Muestra un Spinner mientras redirige
          setRedirecting(true);
          setTimeout(() => {
            navigate(`/${currentLang}/Panel`, { replace: true });
          }, 300); // Puedes ajustar este tiempo para que la transición sea más fluida
        }
      } else {
        setUser(null);
        window.localStorage.removeItem("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname, currentLang]);

  // Memoize el contexto para evitar renderizados innecesarios
  const contextValue = useMemo(
    () => ({
      signup,
      signin,
      user,
      signout,
      loading,
      signInWithGoogle,
      resetPassword,
    }),
    [user, loading]
  );

  if (loading || redirecting) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "95vw",
        }}
      >
        <Spinner size="xl" />
      </div>
    ); // Muestra el Spinner si está cargando o redirigiendo
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
