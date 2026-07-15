// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

// Firebase Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Cloud Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZ_-46Q3TX4YgK_FUTWEtoFCz_bVexqz8",
    authDomain: "moqasah-platform.firebaseapp.com",
    projectId: "moqasah-platform",
    storageBucket: "moqasah-platform.firebasestorage.app",
    messagingSenderId: "60950302215",
    appId: "1:60950302215:web:730777f68e0fe6caeca4a2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export {
    app,
    auth,
    db
};