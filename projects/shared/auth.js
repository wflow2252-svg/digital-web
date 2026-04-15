/**
 * Shared Auth Logic for Portfolio Prototypes
 */
const Auth = {
    init() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userName') || 'User';
        
        // Find auth container in header
        const authContainer = document.querySelector('.auth-trigger') || document.querySelector('.nav-links');
        
        if (isLoggedIn && authContainer) {
            this.updateHeader(authContainer, userName);
        }
    },

    updateHeader(container, name) {
        // Find existing login button if any
        const loginBtn = container.querySelector('a[href*="auth.html"]');
        if (loginBtn) {
            loginBtn.outerHTML = `
                <div class="user-profile-mock" style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="Auth.logout()">
                    <div style="width:32px; height:32px; border-radius:50%; background:var(--accent, #3b82f6); color:#fff; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:12px;">${name[0]}</div>
                    <span style="font-weight:700; font-size:14px; color:inherit;">${name}</span>
                </div>
            `;
        }
    },

    logout() {
        if(confirm('Do you want to sign out?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            window.location.reload();
        }
    },

    notify(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; 
            background: #2563eb; color: #fff; padding: 12px 24px; 
            border-radius: 12px; font-weight: 700; z-index: 10000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            animation: slideUpAuth 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = '0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Add style for toast animation
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes slideUpAuth { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;
document.head.appendChild(authStyle);

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => Auth.init());
