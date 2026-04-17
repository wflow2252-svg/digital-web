/**
 * Digital Web - Neural Heatmap Cloud Sync
 * Synchronizes user interaction data with Firebase Realtime Database.
 */
(function() {
    let sessionId = localStorage.getItem('dw_session');
    let db;

    function initCloudSync() {
        if (!window.firebase) {
            console.warn('Firebase not loaded yet. Retrying...');
            setTimeout(initCloudSync, 1000);
            return;
        }

        // Initialize Firebase if not already done by chat-widget
        if (!firebase.apps.length) {
            const firebaseConfig = {
                apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
                projectId: "chat-75d30",
                databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com"
            };
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.database();
        startTracking();
    }

    function startTracking() {
        document.addEventListener('mousedown', (e) => {
            if (!sessionId) return;
            
            const interaction = {
                x: (e.pageX / document.documentElement.scrollWidth).toFixed(4), // Normalized X
                y: (e.pageY / document.documentElement.scrollHeight).toFixed(4), // Normalized Y
                type: 'CLICK',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            // Push to cloud node
            db.ref(`interactions/${sessionId}`).push(interaction);
        });

        console.log('🌐 Neural Cloud Sync Active for session:', sessionId);
    }

    // Delay start to allow scripts to load
    setTimeout(initCloudSync, 2000);
})();
