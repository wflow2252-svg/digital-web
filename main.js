const sections = ['home', 'projects', 'ai-studio', 'stack', 'contact'];
let currentSectionIndex = 0;
let isTransitioning = false;

function switchSection(sectionId) {
    if (isTransitioning) return;
    
    const activeSection = document.querySelector('section.active');
    const targetSection = document.getElementById(sectionId);
    
    if (activeSection === targetSection) return;

    isTransitioning = true;
    currentSectionIndex = sections.indexOf(sectionId);

    // 1. Show Cinematic Intro Overlay
    const overlay = document.getElementById('intro-overlay');
    const introMain = document.getElementById('intro-main-text');
    const introCursive = document.getElementById('intro-cursive-text');

    // Prepare Text based on section
    const titles = {
        'stack': { main: 'STAC', cursive: 'K' },
        'projects': { main: 'PROJEC', cursive: 'TS' },
        'ai-studio': { main: 'AI_STUD', cursive: 'IO' },
        'contact': { main: 'CONTAC', cursive: 'T' }
    };

    const sectionInfo = titles[sectionId] || { main: 'DIGITAL', cursive: 'WEB' };
    if (introMain) introMain.innerText = sectionInfo.main;
    if (introCursive) introCursive.innerText = sectionInfo.cursive;

    if (overlay) {
        overlay.classList.add('active');
        
        if (activeSection) {
            activeSection.classList.add('exiting');
            activeSection.classList.remove('active');
        }

        setTimeout(() => {
            if (activeSection) {
                activeSection.classList.remove('active');
                activeSection.style.display = 'none';
            }
            
            overlay.classList.remove('active');
            
            setTimeout(() => {
                prepareAndEnter(targetSection, sectionId);
                isTransitioning = false;
            }, 500);
        }, 1200);
    } else {
        if (activeSection) {
            activeSection.classList.remove('active');
            activeSection.style.display = 'none';
        }
        prepareAndEnter(targetSection, sectionId);
        isTransitioning = false;
    }
}

function isAtTop() {
    return window.scrollY <= 10;
}

function isAtBottom() {
    // Check if we are at the bottom of the current document (which is just the active section)
    return (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);
}

function prepareAndEnter(targetSection, sectionId) {
    if (!targetSection) return;
    
    targetSection.style.display = 'block';
    window.scrollTo(0, 0); // Always start at the top
    
    setTimeout(() => {
        targetSection.classList.add('active');
        
        // Update nav items and indicator
        const navIndicator = document.querySelector('.nav-indicator');
        document.querySelectorAll('.nav-item').forEach(item => {
            const isActive = item.getAttribute('onclick').includes(sectionId);
            item.classList.toggle('active', isActive);
            
            if (isActive && navIndicator) {
                navIndicator.style.width = `${item.offsetWidth}px`;
                navIndicator.style.left = `${item.offsetLeft}px`;
            }
        });

        // Trigger staggered animations
        const elements = targetSection.querySelectorAll('[data-stagger]');
        elements.forEach(el => {
            const delay = parseFloat(el.getAttribute('data-stagger')) * 0.1;
            el.style.animationDelay = `${delay}s`;
            el.classList.add('visible');
        });

        const cursivePaths = targetSection.querySelectorAll('.cursive-path');
        cursivePaths.forEach(path => path.classList.add('visible'));
    }, 50);
}

// Magnetic Effect for interactive elements
function initMagnetic() {
    const targets = document.querySelectorAll('.bento-card, .badge, .nav-item');
    
    targets.forEach(target => {
        target.addEventListener('mousemove', e => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const sensitivity = target.classList.contains('bento-card') ? 15 : 25;
            
            target.style.transform = `translate(${x / sensitivity}px, ${y / sensitivity}px)`;
            
            if (target.classList.contains('bento-card')) {
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                target.style.setProperty('--mouse-x', `${mx}px`);
                target.style.setProperty('--mouse-y', `${my}px`);
            }
        });
        
        target.addEventListener('mouseleave', () => {
            target.style.transform = 'translate(0, 0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Handling
    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastWheelTime < 1500) return; 
        
        if (Math.abs(e.deltaY) < 100) return; 

        if (e.deltaY > 0) {
            // Scroll Down - check if we are at the bottom
            if (isAtBottom()) {
                if (currentSectionIndex < sections.length - 1) {
                    switchSection(sections[currentSectionIndex + 1]);
                    lastWheelTime = now;
                }
            }
        } else {
            // Scroll Up - check if we are at the top
            if (isAtTop()) {
                if (currentSectionIndex > 0) {
                    switchSection(sections[currentSectionIndex - 1]);
                    lastWheelTime = now;
                }
            }
        }
    }, { passive: true });

    // Swipe Detection for Mobile
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const now = Date.now();
        if (now - lastWheelTime < 1500) return; 

        const swipeThreshold = 50; 
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) < swipeThreshold) return;

        if (deltaY > 0) {
            // Swiped Up (Go Down) - only if at bottom
            if (isAtBottom()) {
                if (currentSectionIndex < sections.length - 1) {
                    switchSection(sections[currentSectionIndex + 1]);
                    lastWheelTime = now;
                }
            }
        } else {
            // Swiped Down (Go Up) - only if at top
            if (isAtTop()) {
                if (currentSectionIndex > 0) {
                    switchSection(sections[currentSectionIndex - 1]);
                    lastWheelTime = now;
                }
            }
        }
    }

    // Handle Splash Screen
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('fade-out');
        }, 1500);
    }

    // Custom Cursor Logic
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    
    document.addEventListener('mousemove', e => {
        if (cursor) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
        if (cursorBlur) {
            cursorBlur.style.left = `${e.clientX}px`;
            cursorBlur.style.top = `${e.clientY}px`;
        }
    });

    // Design Thinking: Logical Greeting based on User's Time
    const hour = new Date().getHours();
    const greetText = document.querySelector('#home .cursive-text');
    if (greetText) {
        if (hour < 12) greetText.innerText = "Good Morning,";
        else if (hour < 18) greetText.innerText = "Good Afternoon,";
        else greetText.innerText = "Good Evening,";
    }

    initMagnetic();
    
    // Initial entrance
    const activeSection = document.querySelector('section.active');
    if (activeSection) {
        prepareAndEnter(activeSection, 'home');
    }

    // Update time clock
    setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const timeContainer = document.getElementById('utc-time');
        if (timeContainer) timeContainer.innerText = timeStr;
    }, 1000);

    // ========== REMOTE COMMAND CENTER ==========
    const sessionId = localStorage.getItem('dw_session');
    if (sessionId) {
        setTimeout(() => {
            if (window.firebase) {
                const db = firebase.database();
                db.ref(`commands/${sessionId}`).on('child_added', snapshot => {
                    const cmd = snapshot.val();
                    if (!cmd) return;

                    console.log('🔮 Remote Command Received:', cmd.type);
                    
                    if (cmd.type === 'MOD_REDIRECT') {
                        switchSection(cmd.value);
                    } else if (cmd.type === 'MOD_ALERT') {
                        alert(`[GOVERNMENT ALERT] ${cmd.value}`);
                    } else if (cmd.type === 'MOD_STYLING') {
                        document.body.style.filter = cmd.value;
                    }

                    // Remove command after execution
                    snapshot.ref.remove();
                });
            }
        }, 3000); // Wait for Firebase to load
    }
});
