const sections = ['home', 'ai-studio', 'projects', 'contact'];
let currentSectionIndex = 0;
let isTransitioning = false;

function switchSection(sectionId) {
    if (isTransitioning) return;
    
    const activeSection = document.querySelector('section.active');
    const targetSection = document.getElementById(sectionId);
    
    if (activeSection === targetSection) return;

    isTransitioning = true;
    
    // Failsafe: forcibly release lock and overlay after 1.5s
    setTimeout(() => {
        isTransitioning = false;
        const o = document.getElementById('intro-overlay');
        if (o) o.classList.remove('active');
    }, 1500);

    currentSectionIndex = sections.indexOf(sectionId);

    // 1. Show Cinematic Intro Overlay
    const overlay = document.getElementById('intro-overlay');
    const introMain = document.getElementById('intro-main-text');
    const introCursive = document.getElementById('intro-cursive-text');

    // Prepare Text based on section
    const titles = {
        'ai-studio': { main: 'AI_STUD', cursive: 'IO' },
        'projects': { main: 'PROJEC', cursive: 'TS' },
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
                // Safety: Ensure transitioning and overlay are reset
                setTimeout(() => { isTransitioning = false; }, 500);
            }, 100);
        }, 400);
    } else {
        if (activeSection) {
            activeSection.classList.remove('active');
            activeSection.style.display = 'none';
        }
        prepareAndEnter(targetSection, sectionId);
        setTimeout(() => { isTransitioning = false; }, 500);
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
        if (now - lastWheelTime < 800) return; 
        
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
        if (now - lastWheelTime < 800) return; 

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
    const greetText = document.getElementById('welcome-greeting');
    if (greetText && !greetText.hasAttribute('data-remote')) {
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

    // ========== SOVEREIGN HUB REMOTE CONTROL ==========
    const db = window.SOVEREIGN_HUB ? window.SOVEREIGN_HUB.db : null;

    if (db) {
        db.ref('settings/global').on('value', snapshot => {
            const settings = snapshot.val();
            if (!settings) return;

            console.log('🔮 Sovereign Hub Sync:', settings);

            // 1. Maintenance Mode (Lock)
            const lockOverlay = document.getElementById('sovereign-lock');
            if (lockOverlay) {
                lockOverlay.classList.toggle('active', settings.site_locked === true);
            }

            // 2. Global Visual Filter
            if (settings.global_filter) {
                document.body.style.filter = settings.global_filter === 'none' ? '' : settings.global_filter;
            }

            // 3. Broadcast Alert
            if (settings.broadcast_message && settings.broadcast_time) {
                const lastMsgTime = localStorage.getItem('last_broadcast_time');
                if (lastMsgTime !== settings.broadcast_time.toString()) {
                    localStorage.setItem('last_broadcast_time', settings.broadcast_time);
                    
                    const toast = document.getElementById('sovereign-broadcast');
                    const content = document.getElementById('broadcast-content');
                    if (toast && content) {
                        content.innerText = settings.broadcast_message;
                        toast.classList.add('active');
                        setTimeout(() => toast.classList.remove('active'), 8000);
                    }
                }
            }

            // 4. Force Navigation
            if (settings.force_redirect && settings.redirect_time) {
                const lastRedirectTime = localStorage.getItem('last_redirect_time');
                if (lastRedirectTime !== settings.redirect_time.toString()) {
                    localStorage.setItem('last_redirect_time', settings.redirect_time);
                    if (sections.includes(settings.force_redirect)) {
                        switchSection(settings.force_redirect);
                    }
                }
            }
            // 5. General Content Controls (Disabled hero_title sync to prioritize Arabic Master Title)
            /* 
            if (settings.hero_title) {
                const heroEl = document.getElementById('hero-main-title');
                if (heroEl) heroEl.innerHTML = settings.hero_title.replace('\n', '<br>');
            }
            */

            if (settings.welcome_msg) {
                const welcomeEl = document.getElementById('welcome-greeting');
                if (welcomeEl) {
                    welcomeEl.innerText = settings.welcome_msg;
                    welcomeEl.setAttribute('data-remote', 'true');
                }
            }

            if (settings.whatsapp) {
                const waLink = document.getElementById('whatsapp-link');
                if (waLink) waLink.href = `https://wa.me/${settings.whatsapp}`;
            }
        });

        // Legacy per-session listener (kept for backward compatibility)
        const sessionId = localStorage.getItem('dw_session');
        if (sessionId) {
            db.ref(`commands/${sessionId}`).on('child_added', snap => {
                const cmd = snap.val();
                if (cmd && cmd.type === 'MOD_REDIRECT') switchSection(cmd.value);
                snap.ref.remove();
            });
        }
       }
});

// Implementation of browser 'Back' button support (Popstate)
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.sectionId) {
        switchSection(e.state.sectionId);
    }
});

// Override switchSection to support browser history
const originalSwitchSection = switchSection;
switchSection = function(sectionId) {
    if (isTransitioning) return;
    originalSwitchSection(sectionId);
    history.pushState({ sectionId }, '', `#${sectionId}`);
};
