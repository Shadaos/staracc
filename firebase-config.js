// Configuration Firebase du site.
// Remplace null par l'objet donné par Firebase (Paramètres du projet → Vos applications → Configuration),
// par exemple :
//
// export const firebaseConfig = {
//   apiKey: "AIza...",
//   authDomain: "pronos-star-ac.firebaseapp.com",
//   projectId: "pronos-star-ac",
//   storageBucket: "pronos-star-ac.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abc123"
// };
//
// Ces valeurs ne sont pas secrètes : la sécurité vient des règles Firestore (firestore.rules).

export const firebaseConfig = {
  apiKey: "AIzaSyA2QVPmCZ3lsKU1NBHtshBLatM9kyv-LX8",
  authDomain: "pronos-star-ac.firebaseapp.com",
  projectId: "pronos-star-ac",
  storageBucket: "pronos-star-ac.firebasestorage.app",
  messagingSenderId: "403260404385",
  appId: "1:403260404385:web:e86eb3752d2cb3527d76e0"
};

// Clé publique « Web Push » (Firebase → Paramètres du projet → Cloud Messaging → Certificats Web Push).
// Elle n'est pas secrète. Tant qu'elle est vide, le bouton de notifications n'apparaît pas.
export const vapidKey = "BFpW3mc0eX3P2lOJu921nauJ1Y8wMZWZpUzlHe3QiGyjnYnmSCEBIjkJtD6XBrdxVYJ3QAkzeZoJyLLQRQDQARE";
