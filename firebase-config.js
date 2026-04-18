// Digital Web - Sovereign Hub Unified Configuration
// Centralized Firebase & Socket parameters to ensure total synchronization

const SOVEREIGN_CONFIG = {
    firebase: {
        apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
        authDomain: "chat-75d30.firebaseapp.com",
        projectId: "chat-75d30",
        databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com",
        storageBucket: "chat-75d30.firebasestorage.app"
    },
    socket: {
        serverUrl: "http://localhost:3000" // Internal socket server for AI Synthesis
    }
};

// Initialize Firebase once
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(SOVEREIGN_CONFIG.firebase);
    console.log('🏛️ Sovereign Hub: Firebase Unified initialized');
}

// Global references
const db = typeof firebase !== 'undefined' ? firebase.database() : null;
const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const googleProvider = typeof firebase !== 'undefined' ? new firebase.auth.GoogleAuthProvider() : null;

window.SOVEREIGN_HUB = { db, storage, auth, googleProvider, config: SOVEREIGN_CONFIG };
