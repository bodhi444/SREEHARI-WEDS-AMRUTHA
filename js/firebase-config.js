import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyARQyXh8SuC2Eem2JtXGtQ0vgph6_igePY",
  authDomain: "sreehari-wedding.firebaseapp.com",
  projectId: "sreehari-wedding",
  storageBucket: "sreehari-wedding.firebasestorage.app",
  messagingSenderId: "850359961428",
  appId: "1:850359961428:web:d96afdf388a7d8ba3faac1",
  measurementId: "G-4XR5FV13VJ"
};

const app = initializeApp(firebaseConfig);
let db = null;
try {
  // If the user's Firebase config is missing databaseURL, getDatabase might throw an error.
  // We wrap this in try-catch so the rest of the website's JS (animations, swipe) still works!
  db = getDatabase(app);
} catch (e) {
  console.error("Firebase DB Error:", e);
}

export async function submitRSVP(data) {
  if (!db) throw new Error("Firebase Database not initialized (Missing databaseURL?)");
  const rsvpRef = ref(db, 'rsvps');
  await push(rsvpRef, {
    ...data,
    timestamp: serverTimestamp()
  });
}

export function listenForRSVPs(callback) {
  if (!db) {
    console.error("Firebase Database not initialized");
    return;
  }
  const rsvpRef = ref(db, 'rsvps');
  onValue(rsvpRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}
