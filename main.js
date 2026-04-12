// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
    projectId: "chat-75d30",
    databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com",
    storageBucket: "chat-75d30.appspot.com"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Log Visitor
fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
    db.ref('visitors').push({
        ip: data.ip,
        city: data.city,
        device: navigator.userAgent,
        time: new Date().toISOString()
    });
}).catch(e => console.log('IP fetch failed', e));

// Load Templates
db.ref('templates').on('value', snap => {
    const data = snap.val();
    if(data) {
        const grid = document.getElementById('dynamic-portfolio');
        const hero = document.getElementById('home');
        
        // Sort by time descending (handle missing dates with fallback)
        const templates = Object.values(data).sort((a, b) => {
            const dateA = a.time ? new Date(a.time) : new Date(0);
            const dateB = b.time ? new Date(b.time) : new Date(0);
            return dateB - dateA;
        });
        
        // Update Hero Section Background with the latest template image
        if (hero && templates.length > 0) {
            hero.style.backgroundImage = `url('${templates[0].image}')`;
            hero.classList.add('dynamic-bg');
        }

        if(grid) {
            let html = '';
            templates.forEach(t => {
                html += `
                <a href="${t.link}" target="_blank" class="portfolio-card glassmorphism" data-tilt>
                    <div class="card-image-wrapper">
                        <img src="${t.image}" alt="${t.name}">
                        <div class="live-badge"><span class="material-symbols-outlined">launch</span> فتح</div>
                    </div>
                    <div class="card-content">
                        ${t.domain ? `<span class="card-domain">${t.domain}</span>` : ''}
                        <h3>${t.name}</h3>
                        <p>${t.desc}</p>
                    </div>
                </a>`;
            });

            const staticHTML = `
                    <a href="ecommerce/index.html" target="_blank" class="portfolio-card glassmorphism" data-tilt>
                        <div class="card-image-wrapper">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" alt="E-commerce Website">
                            <div class="live-badge"><span class="material-symbols-outlined">launch</span> افتح الموقع الحي</div>
                        </div>
                        <div class="card-content">
                            <h3>متجر إلكتروني متكامل للبيع</h3>
                            <p>نموذج حقيقي لمتجر شيك ومظبوط، تجربة الشراء فيه سهلة وسلسة جداً.</p>
                        </div>
                    </a>
                    <a href="restaurant/index.html" target="_blank" class="portfolio-card glassmorphism" data-tilt>
                        <div class="card-image-wrapper">
                            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80" alt="Restaurant Website">
                            <div class="live-badge"><span class="material-symbols-outlined">launch</span> افتح الموقع الحي</div>
                        </div>
                        <div class="card-content">
                            <h3>موقع فخم للمطاعم والكافيهات</h3>
                            <p>تجربة استثنائية لمطعم بيعكس الفخامة والجودة.</p>
                        </div>
                    </a>
            `;
            grid.innerHTML = staticHTML + html;
            VanillaTilt.init(document.querySelectorAll(".portfolio-card"), { max: 5, speed: 400, glare: true, "max-glare": 0.2 });
        }
    }
});

// Load Reviews
db.ref('reviews').on('value', snap => {
    const data = snap.val();
    if(data) {
        const grid = document.getElementById('dynamic-reviews');
        if(grid) {
            grid.innerHTML = '';
            Object.values(data).reverse().forEach(r => {
                grid.innerHTML += `
                <div class="review-card glassmorphism" style="padding:2rem; border-radius:20px; text-align:center;">
                    <img src="${r.logo}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:1rem; border:2px solid #00f0ff;">
                    <h3 style="color:#00f0ff; margin-bottom:1rem;">${r.brand}</h3>
                    <p style="color:#fff; font-style:italic;">"${r.text}"</p>
                </div>
                `;
            });
        }
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.85)';
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.03)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize Vanilla Tilt for existing elements
document.addEventListener("DOMContentLoaded", () => {
    VanillaTilt.init(document.querySelectorAll(".portfolio-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.2
    });
});
