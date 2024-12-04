import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, get, onValue, off } from "firebase/database";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getUserApp } from "../firebaseManager";

const DetailsPage = () => {
  const { firebaseConfig } = useAuth();
  const { node } = useParams(); // URL'den düğüm adını alır
  const [cards, setCards] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Hangi kartın açık olduğunu takip etmek için
  const [loading, setLoading] = useState(true);
  const [listeners, setListeners] = useState({}); // Dinleyiciler için referanslar
  const [editTitleId, setEditTitleId] = useState(null); // Düzenleme modundaki kartı takip eder
  const [editChildTitleId, setEditChildTitleId] = useState(null); // Düzenleme modundaki alt düğümü takip eder
  const [newTitle, setNewTitle] = useState("");
  const [newChildTitle, setNewChildTitle] = useState("");

  const fetchChildNodes = async (cardId, path) => {
    if (!firebaseConfig) {
      console.error("Firebase Config mevcut değil!");
      return;
    }

    const userApp = getUserApp(firebaseConfig);
    const database = getDatabase(userApp);
    const firestore = getFirestore(userApp);
    const dbRef = ref(database, `/${node}/${path}`);

    // İlk veriyi çek
    const snapshot = await get(dbRef);
    const initialData = snapshot.exists()
      ? await Promise.all(
          Object.entries(snapshot.val()).map(async ([key, value]) => {
            const childDocRef = doc(firestore, "cards", `${node}_${path}_${key}`);
            const childDoc = await getDoc(childDocRef);
            const title = childDoc.exists() ? childDoc.data().title : key;
            return {
              key,
              title,
              value: JSON.stringify(value, null, 2),
            };
          })
        )
      : [];

    // Alt düğümleri göster
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              children: initialData,
            }
          : card
      )
    );

    // Daha önce bu düğüme dinleyici eklenmişse kaldır
    if (listeners[path]) {
      off(listeners[path]);
    }

    // Yeni dinleyici ekle
    onValue(dbRef, async (snapshot) => {
      const updatedData = snapshot.exists()
        ? await Promise.all(
            Object.entries(snapshot.val()).map(async ([key, value]) => {
              const childDocRef = doc(firestore, "cards", `${node}_${path}_${key}`);
              const childDoc = await getDoc(childDocRef);
              const title = childDoc.exists() ? childDoc.data().title : key;
              return {
                key,
                title,
                value: JSON.stringify(value, null, 2),
              };
            })
          )
        : [];

      // Dinleme sırasında güncelleme yap
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                children: updatedData,
              }
            : card
        )
      );
    });

    // Dinleyici referansını kaydet
    setListeners((prevListeners) => ({
      ...prevListeners,
      [path]: dbRef,
    }));
  };

  const toggleAccordion = (cardId, path) => {
    if (expandedCard === cardId) {
      // Kart zaten açıksa kapat ve dinleyiciyi kaldır
      setExpandedCard(null);
      if (listeners[path]) {
        off(listeners[path]);
        setListeners((prevListeners) => {
          const updatedListeners = { ...prevListeners };
          delete updatedListeners[path];
          return updatedListeners;
        });
      }
    } else {
      // Tüm diğer kartları kapat ve dinleyicileri kaldır
      Object.entries(listeners).forEach(([key, listener]) => {
        off(listener);
      });
      setListeners({});
      setExpandedCard(cardId);
      fetchChildNodes(cardId, path);
    }
  };

  const handleTitleDoubleClick = (cardId, currentTitle) => {
    setEditTitleId(cardId);
    setNewTitle(currentTitle);
  };

  const handleChildTitleDoubleClick = (cardId, childKey, currentTitle) => {
    setEditChildTitleId({ cardId, childKey });
    setNewChildTitle(currentTitle);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleChildTitleChange = (e) => {
    setNewChildTitle(e.target.value);
  };

  const handleTitleSave = async (cardId, path) => {
    if (!firebaseConfig) {
      console.error("Firebase Config mevcut değil!");
      return;
    }

    const userApp = getUserApp(firebaseConfig);
    const firestore = getFirestore(userApp);
    const cardDocRef = doc(firestore, "cards", `${node}_${path}`);

    try {
      await setDoc(cardDocRef, { title: newTitle }, { merge: true });
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                title: newTitle,
              }
            : card
        )
      );
      setEditTitleId(null);
    } catch (error) {
      console.error("Başlık güncellenirken hata oluştu:", error);
    }
  };

  const handleChildTitleSave = async (cardId, path, childKey) => {
    if (!firebaseConfig) {
      console.error("Firebase Config mevcut değil!");
      return;
    }

    const userApp = getUserApp(firebaseConfig);
    const firestore = getFirestore(userApp);
    const childDocRef = doc(firestore, "cards", `${node}_${path}_${childKey}`);

    try {
      await setDoc(childDocRef, { title: newChildTitle }, { merge: true });
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                children: card.children.map((child) =>
                  child.key === childKey
                    ? {
                        ...child,
                        title: newChildTitle,
                      }
                    : child
                ),
              }
            : card
        )
      );
      setEditChildTitleId(null);
    } catch (error) {
      console.error("Alt düğüm başlığı güncellenirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (firebaseConfig && node) {
      const userApp = getUserApp(firebaseConfig);
      const database = getDatabase(userApp);
      const firestore = getFirestore(userApp);

      const dbRef = ref(database, `/${node}`);
      get(dbRef)
        .then(async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const childNodes = await Promise.all(
              Object.keys(data).map(async (childNode, index) => {
                const cardDocRef = doc(firestore, "cards", `${node}_${childNode}`);
                const cardDoc = await getDoc(cardDocRef);
                const title = cardDoc.exists() ? cardDoc.data().title : childNode;
                return {
                  id: index + 1,
                  title,
                  description: `Bu kart, ${childNode} alt düğümünü temsil ediyor.`,
                  path: childNode, // Alt düğüm yolu
                  children: [], // Varsayılan olarak boş bir liste göster
                };
              })
            );
            setCards(childNodes);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Veriler alınırken hata oluştu:", error);
          setLoading(false);
        });
    }

    // Cleanup: Tüm dinleyicileri kaldır
    return () => {
      Object.values(listeners).forEach((listener) => off(listener));
    };
  }, [firebaseConfig, node]);

  if (!firebaseConfig) {
    return <div>Firebase yapılandırması yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Detay Sayfası: {node}</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="border border-gray-300 rounded-lg shadow-md h-full"
            >
              {/* Başlık */}
              <div
                className="p-4 bg-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion(card.id, card.path)}
              >
                <h2
                  className="text-lg font-semibold"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleTitleDoubleClick(card.id, card.title);
                  }}
                >
                  {editTitleId === card.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={handleTitleChange}
                      onBlur={() => handleTitleSave(card.id, card.path)} onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(card.id, card.path); }}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    card.title
                  )}
                </h2>
                <span>
                  {expandedCard === card.id ? "-" : "+"}
                </span>
              </div>

              {/* İçerik */}
              {expandedCard === card.id && (
                <div className="p-4 bg-white">
                  {card.children && card.children.length > 0 ? (
                    <ul className="space-y-2">
                      {card.children.map((child) => (
                        <li
                          key={child.key}
                          className="p-2 border-b border-gray-200 flex justify-between items-center"
                        >
                          <strong
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleChildTitleDoubleClick(card.id, child.key, child.title);
                            }}
                          >
                            {editChildTitleId &&
                            editChildTitleId.cardId === card.id &&
                            editChildTitleId.childKey === child.key ? (
                              <input
                                type="text"
                                value={newChildTitle}
                                onChange={handleChildTitleChange}
                                onBlur={() => handleChildTitleSave(card.id, card.path, child.key)} onKeyDown={(e) => { if (e.key === 'Enter') handleChildTitleSave(card.id, card.path, child.key); }}
                                className="border rounded px-2 py-1"
                                autoFocus
                              />
                            ) : (
                              child.title
                            )}
                          </strong>
                          <span>{child.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">Alt düğüm bulunamadı.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
