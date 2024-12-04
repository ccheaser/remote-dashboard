import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const SetupPage = () => {
  const { currentUser, setFirebaseConfig } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const fields = [
    { name: "apiKey", label: "API Key", placeholder: "Enter your API Key" },
    { name: "authDomain", label: "Auth Domain", placeholder: "Enter your Auth Domain" },
    { name: "databaseURL", label: "Database URL", placeholder: "Enter your Database URL" },
    { name: "projectId", label: "Project ID", placeholder: "Enter your Project ID" },
    { name: "storageBucket", label: "Storage Bucket", placeholder: "Enter your Storage Bucket" },
    { name: "messagingSenderId", label: "Messaging Sender ID", placeholder: "Enter your Messaging Sender ID" },
    { name: "appId", label: "App ID", placeholder: "Enter your App ID" },
  ];

  const onSubmit = async (data) => {
    try {
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await setDoc(userDocRef, { firebaseConfig: data }, { merge: true });
      setFirebaseConfig(data);
      alert("Kurulum başarıyla tamamlandı!");
    } catch (error) {
      console.error("Kurulum sırasında bir hata oluştu:", error);
    }
  };

  const handleNextStep = () => {
    if (currentStep < fields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Firebase Kurulum</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.name}
            className={`transition-all duration-300 ${
              index <= currentStep ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <label className="block text-lg font-medium text-gray-700">{field.label}</label>
            <input
              {...register(field.name, { required: true })}
              className="mt-2 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.placeholder}
              type="text"
            />
            {errors[field.name] && (
              <span className="text-red-500 text-sm">{field.label} gereklidir.</span>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          {currentStep < fields.length - 1 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
            >
              Sonraki
            </button>
          )}
          {currentStep === fields.length - 1 && (
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 text-lg font-semibold"
            >
              Kaydet ve Devam Et
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SetupPage;
