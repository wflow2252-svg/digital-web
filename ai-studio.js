// Digital Web - Neural Architect v4: Global Engine
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        // BILINGUAL DICTIONARY
        const DICT = {
            ar: {
                nav_home: 'الرئيسية', nav_services: 'الخدمات', nav_contact: 'اتصل بنا',
                hero_tag: 'هندسة فائقة الدقة', hero_btn_main: 'ابدأ التجربة', hero_btn_sec: 'التفاصيل',
                stats_title: 'أرقام تتحدث', stats_clients: 'عميل سعيد', stats_projects: 'مشروع منجز', stats_uptime: 'وقت تشغيل',
                server_title: 'وحدة التحكم في الخادم - مفعّلة', server_ready: 'الخادم جاهز لاستقبال الطلبات...',
                features_title: 'حلولنا الذكية', footer_copy: 'جميع الحقوق محفوظة'
            },
            en: {
                nav_home: 'Home', nav_services: 'Services', nav_contact: 'Contact Us',
                hero_tag: 'HIGH_FIDELITY ARCHITECTURE', hero_btn_main: 'Start Experience', hero_btn_sec: 'Details',
                stats_title: 'Real Impact', stats_clients: 'Happy Clients', stats_projects: 'Projects Done', stats_uptime: 'Uptime',
                server_title: 'Server Console - ACTIVE', server_ready: 'Server ready for connections...',
                features_title: 'Smart Solutions', footer_copy: 'All Rights Reserved'
            }
        };

        const COMPONENTS = {
            NAVBAR: (name, color, lang) => `
                <nav style="padding: 1rem 3rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); position: fixed; width: 100%; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-weight: 900; font-size: 1.5rem; color: white; display: flex; align-items: center; gap: 10px;">
                        <span style="width: 28px; height: 28px; background: ${color}; border-radius: 6px; box-shadow: 0 0 15px ${color}66;"></span>
                        ${name}
                    </div>
                    <div style="display: flex; gap: 25px; align-items: center;">
                        <a href="#" class="nav-link" data-key="nav_home">${DICT[lang].nav_home}</a>
                        <a href="#services" class="nav-link" data-key="nav_services">${DICT[lang].nav_services}</a>
                        <button onclick="dwToggleLang()" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.8rem;">
                            ${lang === 'ar' ? 'English' : 'عربي'}
                        </button>
                        <a href="#contact" style="background: ${color}; color: white; padding: 8px 20px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 0.85rem; box-shadow: 0 10px 20px ${color}33;">${DICT[lang].nav_contact}</a>
                    </div>
                </nav>`,
            
            HERO: (name, color, prompt, imageUrl, lang) => `
                <header style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 120px 3rem 60px; position: relative; overflow: hidden; background: #050505;">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 15% 50%, ${color}22 0%, transparent 40%), radial-gradient(circle at 85% 50%, ${color}11 0%, transparent 40%);"></div>
                    <div style="max-width: 1200px; width: 100%; display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center; position: relative;">
                        <div class="reveal">
                            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 900; color: ${color}; margin-bottom: 25px;">
                                <span style="width: 6px; height: 6px; background: ${color}; border-radius: 50%;"></span>
                                <span data-key="hero_tag">${DICT[lang].hero_tag}</span>
                            </div>
                            <h1 style="font-size: min(4.5rem, 10vw); font-weight: 900; line-height: 0.95; margin: 0; letter-spacing: -2px;">
                                <span style="color: ${color};">${name}</span><br>Global Enterprise
                            </h1>
                            <p style="color: rgba(255,255,255,0.4); font-size: 1.2rem; line-height: 1.6; margin: 30px 0 45px; max-width: 500px;">
                                Generated responding to: "${prompt.substring(0, 40)}..."
                            </p>
                            <div style="display: flex; gap: 15px;">
                                <button onclick="dwSimulateAPI()" style="background: ${color}; color: white; border: none; padding: 16px 35px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 15px 35px ${color}33;" data-key="hero_btn_main">${DICT[lang].hero_btn_main}</button>
                                <button style="background: rgba(255,255,255,0.03); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 16px 35px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer;" data-key="hero_btn_sec">${DICT[lang].hero_btn_sec}</button>
                            </div>
                        </div>
                        <div class="reveal">
                            <img src="${imageUrl}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 40px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
                        </div>
                    </div>
                </header>`,

            SERVER_CONSOLE: (color, lang) => `
                <section style="background: #000; padding: 60px 3rem; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: ${color}; font-weight: 700;" data-key="server_title">
                                ${DICT[lang].server_title}
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <span style="width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
                                <span style="font-size: 10px; color: #10b981; font-weight: 900;">200 OK</span>
                            </div>
                        </div>
                        <div id="server-terminal" style="background: #080808; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; height: 150px; overflow-y: auto; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; flex-direction: column; gap: 5px;">
                            <div class="term-line"><span style="color: ${color};">[${new Date().toLocaleTimeString()}]</span> <span data-key="server_ready">${DICT[lang].server_ready}</span></div>
                        </div>
                    </div>
                </section>`
        };

        async function runNeuralSequence(prompt) {
            const steps = [
                { type: 'sys', text: 'Neural v4.0 Active. Architecting Global System...' },
                { type: 'arch', text: 'Bilingual context mapping (Arabic/English)...', status: 'OK' },
                { type: 'design', text: 'Injecting Server Console Simulation...', status: 'OK' },
                { type: 'build', text: 'Compiling Deep Content Modules (Stats, FAQ)...', status: 'OK' },
                { type: 'sys', text: 'Ready for Global Preview.' }
            ];

            for (const step of steps) {
                printLog(step);
                await new Promise(r => setTimeout(r, Math.random() * 400 + 300));
            }
        }

        function printLog(step) {
            const log = document.getElementById('studio-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const prefix = { sys: '[SYS]', arch: '[GLOBAL]', design: '[LOGIC]', build: '[BUILD]' }[step.type];
            entry.innerHTML = `
                <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span class="prefix" style="color:#3b82f6; font-weight:900;">${prefix}</span>
                <span class="text">${step.text}</span>
            `;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Architecting...';

            const log = document.getElementById('studio-log');
            log.innerHTML = '';
            log.classList.add('active');

            await runNeuralSequence(prompt);

            const result = generateGlobalBundle(prompt);
            if (window.dwOpenPreview) window.dwOpenPreview(result);

            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Trial';
        };

        function generateGlobalBundle(prompt) {
            const input = prompt.toLowerCase();
            const nameMatch = prompt.match(/(لـ|اسم|لشركة) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Digital Global';
            
            let color = '#3b82f6';
            if (input.includes('أحمر') || input.includes('red')) color = '#ef4444';
            if (input.includes('أخضر') || input.includes('green')) color = '#10b981';
            
            const lang = (input.match(/[a-z]/i) && !input.match(/[\u0600-\u06FF]/)) ? 'en' : 'ar';
            const imageUrl = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200`;

            const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Global System</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${COMPONENTS.NAVBAR(name, color, lang)}
    ${COMPONENTS.HERO(name, color, prompt, imageUrl, lang)}
    ${COMPONENTS.SERVER_CONSOLE(color, lang)}
    <script src="script.js"></script>
</body>
</html>`;

            const css = `
:root { --primary: ${color}; --bg: #050505; }
body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; scroll-behavior: smooth; transition: 0.3s; }
nav .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s; }
.reveal { opacity: 0; transform: translateY(40px); transition: 1s cubic-bezier(0.19, 1, 0.22, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }
.term-line { margin-bottom: 5px; animation: scan 0.2s ease-out; }
@keyframes scan { from { opacity: 0; transform: translateX(-10px); } }`;

            const js = `
const DICT = ${JSON.stringify(DICT)};
let currentLang = "${lang}";

window.dwToggleLang = () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all text nodes
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if(DICT[currentLang][key]) el.innerText = DICT[currentLang][key];
    });
    
    // Update static toggle buttons
    const btn = event.target;
    btn.innerText = currentLang === 'ar' ? 'English' : 'عربي';
    
    dwUpdateServerLog("LANGUAGE_SWAP", "Direction changed to " + document.documentElement.dir);
};

window.dwSimulateAPI = () => {
    dwUpdateServerLog("API_CALL", "GET /api/v1/trigger - Payload: { action: 'EXPERIENCE_START' }");
    setTimeout(() => {
        dwUpdateServerLog("SERVER_RES", "200 OK - Response received successfully.");
    }, 800);
};

function dwUpdateServerLog(type, msg) {
    const terminal = document.getElementById('server-terminal');
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = \`<span style="color:var(--primary)">[\${new Date().toLocaleTimeString()}]</span> [\${type}] \${msg}\`;
    terminal.insertBefore(line, terminal.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});`;

            return { html, css, js };
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStudio);
    } else {
        initStudio();
    }
})();
