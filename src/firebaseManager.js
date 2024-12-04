import { initializeApp, getApps, getApp } from "firebase/app";

// Kullanıcı Firebase App'lerini dinamik olarak yönetmek için bir referans
const userApps = {};

// Ana Firebase App (Login ve genel işlemler için)
const mainApp = (() => {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp(); // Zaten başlatılmış bir App varsa onu kullan
  }
  return initializeApp({
    apiKey: "AIzaSyBwXdQWx9YufEC3GCicd1fYVf6gQmC-UCI",
    authDomain: "ally-information.firebaseapp.com",
    databaseURL: "https://ally-information-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ally-information",
    storageBucket: "ally-information.appspot.com",
    messagingSenderId: "467596901931",
    appId: "1:467596901931:web:1a12fa2f4104dcad78b46e"
  });
})();

// Kullanıcıya özel Firebase App başlatma veya mevcut App'i alma
export const getUserApp = (config) => {
  if (!userApps[config.projectId]) {
    userApps[config.projectId] = initializeApp(config, `userApp-${config.projectId}`);
  }
  return userApps[config.projectId];
};

// Ana App'i de gerektiğinde dışa aktarabiliriz
export { mainApp };
