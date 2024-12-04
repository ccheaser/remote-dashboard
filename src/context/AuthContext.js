import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseConfig, setFirebaseConfig] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false); // İlk giriş kontrolü
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setFirebaseConfig(userDoc.data().firebaseConfig || null);
          setIsFirstLogin(false); // Kullanıcı daha önce giriş yapmış
        } else {
          setIsFirstLogin(true); // İlk defa giriş yapıyor
        }
      } else {
        setFirebaseConfig(null);
        setIsFirstLogin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setFirebaseConfig(null);
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, firebaseConfig, setFirebaseConfig, isFirstLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
