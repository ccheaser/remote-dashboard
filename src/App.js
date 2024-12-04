import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DetailsPage from "./pages/DetailsPage"; // Detay sayfasını ekliyoruz
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import SetupModal from "./components/SetupModal"; // Setup ekranını ekliyoruz
import { useAuth } from "./context/AuthContext";
import SetupPage from './pages/Setup';

const App = () => {
  const { isFirstLogin } = useAuth(); // İlk giriş durumu kontrolü

  return (
    <Router>
      <Routes>
        {/* Login Route - Layout Dışında */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Layout İçinde */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                {isFirstLogin && <SetupModal />} {/* İlk girişte SetupModal'ı göster */}
                <Routes>
                <Route path="/settings/setup" element={<SetupPage />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/details/:node" element={<DetailsPage />} /> {/* Detay Sayfası */}
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
