const sections = ['home', 'stack', 'projects', 'contact'];
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
    if (sectionId === 'stack') {
        introMain.innerText = 'STAC';
        introCursive.innerText = 'K';
    } else if (sectionId === 'projects') {
        introMain.innerText = 'PROJEC';
        introCursive.innerText = 'TS';
    } else if (sectionId === 'contact') {
        introMain.innerText = 'CONTAC';
        introCursive.innerText = 'T';
    } else {
        introMain.innerText = 'DIGITAL';
        introCursive.innerText = 'WEB';
    }

    if (overlay) {
        overlay.classList.add('active');
        
        // Hide current if exists
        if (activeSection) {
            activeSection.classList.add('exiting');
            activeSection.classList.remove('active');
        }

        // Wait for Intro to "sink in"
        setTimeout(() => {
            if (activeSection) {
                activeSection.classList.remove('exiting');
                activeSection.style.display = 'none';
            }
            
            // 2. Hide Overlay & Enter New Section
            overlay.classList.remove('active');
            
            setTimeout(() => {
                prepareAndEnter(targetSection, sectionId);
                isTransitioning = false;
            }, 500); // Wait for overlay fade out
        }, 1200); // How long the big title stays
    } else {
        prepareAndEnter(targetSection, sectionId);
        isTransitioning = false;
    }
}

function prepareAndEnter(targetSection, sectionId) {
    if (!targetSection) return;
    
    targetSection.style.display = 'block';
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

// Spotlight Effect for Bento Cards
function initSpotlight() {
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Handling
    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastWheelTime < 1500) return; // Debounce
        
        if (Math.abs(e.deltaY) < 120) return; // Add more resistance to prevent accidental scrolling

        if (e.deltaY > 0) {
            // Scroll Down
            if (currentSectionIndex < sections.length - 1) {
                switchSection(sections[currentSectionIndex + 1]);
                lastWheelTime = now;
            }
        } else {
            // Scroll Up
            if (currentSectionIndex > 0) {
                switchSection(sections[currentSectionIndex - 1]);
                lastWheelTime = now;
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
        if (now - lastWheelTime < 1500) return; // Use same debounce

        const swipeThreshold = 50;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) < swipeThreshold) return;

        if (deltaY > 0) {
            // Swiped Up (Go Down)
            if (currentSectionIndex < sections.length - 1) {
                switchSection(sections[currentSectionIndex + 1]);
                lastWheelTime = now;
            }
        } else {
            // Swiped Down (Go Up)
            if (currentSectionIndex > 0) {
                switchSection(sections[currentSectionIndex - 1]);
                lastWheelTime = now;
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

    initSpotlight();
    
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
});
