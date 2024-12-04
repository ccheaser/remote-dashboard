import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { getUserApp } from "../firebaseManager"; // Dinamik Firebase App yönetimi için

const Dashboard = () => {
  const { firebaseConfig } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let userApp;

    if (firebaseConfig) {
      try {
        // Kullanıcıya özel Firebase App'i başlat veya mevcut olanı al
        userApp = getUserApp(firebaseConfig);
        const database = getDatabase(userApp);

        // Realtime Database'den veri çek
        const dbRef = ref(database, "/");
        get(dbRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const rootNodes = Object.keys(data);
              const generatedCards = rootNodes.map((node, index) => ({
                id: index + 1,
                title: node,
                description: `Bu kart, ${node} düğümünü temsil ediyor.`,
                path: node,
              }));
              setCards(generatedCards);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Realtime Database'den veri alınırken hata oluştu:", error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Firebase App başlatılırken hata oluştu:", error);
      }
    }

    return () => {
      // Temizleme işlemleri gerekmez çünkü `getUserApp` zaten mevcut App'i tekrar kullanır
    };
  }, [firebaseConfig]);

  if (!firebaseConfig) {
    return <div>Firebase yapılandırması yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Ana Sayfa</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <>
          {/* Kartlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
                  <p className="text-gray-600">{card.description}</p>
                </div>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => navigate(`/details/${card.path}`)}
                  >
                    Detay
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Şube</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Peron</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Ödeme Yöntemi</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Saat</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className="border-t">
                    <td className="py-4 px-6 text-sm text-gray-700">{card.title}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">Peron 2</td>
                    <td className="py-4 px-6 text-sm text-gray-700">Nakit</td>
                    <td className="py-4 px-6 text-sm text-gray-700">09:00 - 17:00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
