const firebaseConfig = {
    apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
    projectId: "chat-75d30",
    databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com",
    storageBucket: "chat-75d30.appspot.com"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const storage = firebase.storage();

// Sidebar Navigation
function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Upload File helper
async function uploadFile(file, folder) {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = storage.ref(`${folder}/${fileName}`);
    const snapshot = await storageRef.put(file);
    return await snapshot.ref.getDownloadURL();
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
document.getElementById('review-form').addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = 'جاري الرفع...';

    try {
        const logoFile = document.getElementById('review-logo').files[0];
        const logoUrl = await uploadFile(logoFile, 'reviews');

        const review = {
            brand: document.getElementById('review-brand').value,
            logo: logoUrl,
            text: document.getElementById('review-text').value,
            time: new Date().toISOString()
        };

        await db.ref('reviews').push(review);
        alert('تم إضافة التقييم بنجاح!');
        e.target.reset();
    } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الرفع!');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'حفظ التقييم';
    }
});

// Add Template
document.getElementById('template-form').addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = 'جاري الرفع...';

    try {
        const imageFile = document.getElementById('template-image').files[0];
        const imageUrl = await uploadFile(imageFile, 'templates');

        const template = {
            name: document.getElementById('template-name').value,
            desc: document.getElementById('template-desc').value,
            image: imageUrl,
            domain: document.getElementById('template-domain').value,
            link: document.getElementById('template-link').value || '#contact',
            time: new Date().toISOString()
        };

        await db.ref('templates').push(template);
        alert('تم إضافة النموذج بنجاح!');
        e.target.reset();
    } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الرفع!');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'حفظ النموذج';
    }
});
