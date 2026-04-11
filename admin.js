const firebaseConfig = {
    apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
    projectId: "chat-75d30",
    databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// Sidebar Navigation
function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Fetch Visitors
db.ref('visitors').on('value', snap => {
    const data = snap.val();
    const tbody = document.getElementById('visitors-table-body');
    tbody.innerHTML = '';
    if(data) {
        Object.values(data).reverse().forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td dir="ltr">${new Date(v.time).toLocaleString('ar-EG')}</td>
                    <td>${v.ip || 'غير معروف'}</td>
                    <td>${v.device || navigator.userAgent}</td>
                </tr>
            `;
        });
    }
});

// Add Review
document.getElementById('review-form').addEventListener('submit', e => {
    e.preventDefault();
    const review = {
        brand: document.getElementById('review-brand').value,
        logo: document.getElementById('review-logo').value,
        text: document.getElementById('review-text').value,
        time: new Date().toISOString()
    };
    db.ref('reviews').push(review).then(() => {
        alert('تم إضافة التقييم بنجاح!');
        e.target.reset();
    });
});

// Add Template
document.getElementById('template-form').addEventListener('submit', e => {
    e.preventDefault();
    const template = {
        name: document.getElementById('template-name').value,
        desc: document.getElementById('template-desc').value,
        image: document.getElementById('template-image').value,
        link: document.getElementById('template-link').value || '#contact',
        time: new Date().toISOString()
    };
    db.ref('templates').push(template).then(() => {
        alert('تم إضافة النموذج بنجاح!');
        e.target.reset();
    });
});
