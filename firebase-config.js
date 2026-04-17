// Digital Web - Sovereign Hub Unified Configuration
// Centralized Firebase & Socket parameters to ensure total synchronization

const SOVEREIGN_CONFIG = {
    firebase: {
        apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
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
window.SOVEREIGN_HUB = { db, storage, config: SOVEREIGN_CONFIG };
