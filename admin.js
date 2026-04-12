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

// Base64 Converter
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Add Review
document.getElementById('review-form').addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = 'جاري الرفع...';

    try {
        const logoFile = document.getElementById('review-logo').files[0];
        if (!logoFile) throw new Error('يرجى اختيار ملف الصورة أولاً');
        
        // Size validation (Max 1.5MB)
        if (logoFile.size > 1500000) throw new Error('حجم الصورة كبير جداً (يجب أن يكون أقل من 1.5 ميجا)');

        let logoUrl = null;
        try {
            console.log('Attempting Storage upload...', logoFile.name);
            logoUrl = await uploadFile(logoFile, 'reviews');
            console.log('Storage upload success:', logoUrl);
        } catch (storageErr) {
            console.warn('Storage failed (CORS?), falling back to Base64:', storageErr);
            logoUrl = await toBase64(logoFile);
            console.log('Base64 conversion success');
        }

        const review = {
            brand: document.getElementById('review-brand').value,
            logo: logoUrl,
            text: document.getElementById('review-text').value,
            time: new Date().toISOString()
        };

        console.log('Sending to Database...', review.brand);
        await db.ref('reviews').push(review);
        console.log('Database push success');

        alert('تم إضافة التقييم بنجاح!');
        e.target.reset();
    } catch (err) {
        console.error('Unified Error:', err);
        alert(`حدث خطأ: ${err.message || 'فشل الاتصال بـ Firebase'}`);
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
        if (!imageFile) throw new Error('يرجى اختيار صورة النموذج');
        
        // Size validation (Max 1.5MB)
        if (imageFile.size > 1500000) throw new Error('حجم الصورة كبير جداً (يجب أن يكون أقل من 1.5 ميجا)');

        let imageUrl = null;
        try {
            console.log('Attempting Storage upload...', imageFile.name);
            imageUrl = await uploadFile(imageFile, 'templates');
            console.log('Storage upload success:', imageUrl);
        } catch (storageErr) {
            console.warn('Storage failed (CORS?), falling back to Base64:', storageErr);
            imageUrl = await toBase64(imageFile);
            console.log('Base64 conversion success');
        }

        const template = {
            name: document.getElementById('template-name').value,
            desc: document.getElementById('template-desc').value,
            image: imageUrl,
            domain: document.getElementById('template-domain').value,
            link: document.getElementById('template-link').value || '#contact',
            time: new Date().toISOString()
        };

        console.log('Sending to Database...', template.name);
        await db.ref('templates').push(template);
        console.log('Database push success');

        alert('تم إضافة النموذج بنجاح!');
        e.target.reset();
    } catch (err) {
        console.error('Unified Error:', err);
        alert(`حدث خطأ: ${err.message || 'فشل الاتصال بـ Firebase'}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'حفظ النموذج';
    }
});
