// src/pages/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import loginImage from "../assests/images/loginimage.jpg"; // Resmi import edin

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Giriş başarılı olduğunda yönlendirme yapabilirsiniz
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      {/* Sol Taraf - Login Form */}
      <div className="flex flex-col justify-center flex-1 px-12 py-24 sm:px-16 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-lg mx-auto">
          <div>
            <h2 className="text-5xl font-extrabold text-gray-900 animate-fade-in">
              Giriş Yap
            </h2>
            <p className="mt-6 text-xl text-gray-600 animate-fade-in-delay">
              Hesabınız yok mu?{" "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Kayıt Olun
              </a>
            </p>
          </div>
          {error && (
            <div className="p-4 mt-8 text-red-700 bg-red-100 border border-red-400 rounded animate-fade-in">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-12 space-y-6 animate-slide-in">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-3 text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email adresinizi girin"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-3 text-lg font-medium text-gray-700">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-6 py-4 text-2xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Sağ Taraf - Görsel */}
      <div className="hidden lg:block relative flex-1">
        <img
          className="absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out opacity-100 hover:opacity-90"
          src={loginImage} // İçe aktarılan resmi kullanın
          alt="Giriş Görseli"
        />
        {/* Görselin üzerine hafif bir katman eklemek isterseniz */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
    </div>
  );
};

export default Login;
