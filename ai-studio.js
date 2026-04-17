// Digital Web - Neural Architect v5: Intent-Driven Evolution
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        // Semantic Translation Dictionary
        const DICT = {
            ar: {
                nav_home: 'الرئيسية', nav_contact: 'اتصل بنا',
                hero_btn: 'ابدأ التجربة', server_title: 'وحدة التحكم في السيرفر',
                footer: 'جميع الحقوق محفوظة'
            },
            en: {
                nav_home: 'Home', nav_contact: 'Contact Us',
                hero_btn: 'Start Experience', server_title: 'Server Console',
                footer: 'All Rights Reserved'
            }
        };

        // Export global helper for Idea Chips
        window.dwQuickPrompt = (text) => {
            promptInput.value = text;
            promptInput.focus();
            promptInput.style.borderColor = 'var(--accent)';
            setTimeout(() => promptInput.style.borderColor = '', 1000);
        };

        async function analyzeIntent(prompt) {
            const p = prompt.toLowerCase();
            
            // 1. Detect Niche
            let niche = 'general';
            if (p.includes('perfume') || p.includes('عطر')) niche = 'luxury';
            if (p.includes('tech') || p.includes('برمج') || p.includes('startup')) niche = 'tech';
            if (p.includes('gym') || p.includes('fitness') || p.includes('رياضة')) niche = 'fitness';
            if (p.includes('bakery') || p.includes('coffee') || p.includes('قهوة')) niche = 'rustic';
            if (p.includes('game') || p.includes('play') || p.includes('ألعاب')) niche = 'cyber';

            // 2. Detect Tone
            let tone = 'professional';
            if (p.includes('minimal') || p.includes('simple') || p.includes('بسيط')) tone = 'minimal';
            if (p.includes('bold') || p.includes('aggressive') || p.includes('قوي')) tone = 'bold';
            if (p.includes('elegant') || p.includes('luxury') || p.includes('فخم')) tone = 'elegant';
            if (p.includes('neon') || p.includes('futuristic') || p.includes('مستقبلي')) tone = 'neon';

            // 3. Extract Name
            const nameMatch = prompt.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Elite Studio';

            // 4. Determine Primary Color based on Tone/Niche
            let color = '#3b82f6'; // Default
            if (tone === 'neon' || niche === 'cyber') color = '#f0abfc'; // Pink/Neon
            if (tone === 'elegant' || niche === 'luxury') color = '#fbbf24'; // Gold
            if (niche === 'fitness') color = '#bef264'; // Neon Green
            if (niche === 'tech') color = '#38bdf8'; // Sky Blue
            if (p.includes('red') || p.includes('أحمر')) color = '#ef4444';

            return { niche, tone, name, color };
        }

        async function runNeuralSequence(analysis) {
            const steps = [
                { type: 'sys', text: `Analyzing Intent... Detected Niche: ${analysis.niche.toUpperCase()}` },
                { type: 'sys', text: `Tone mapping: ${analysis.tone.toUpperCase()} style selected.` },
                { type: 'arch', text: `Calculating design tokens for color: ${analysis.color}...` },
                { type: 'arch', text: `Assembling custom components for ${analysis.name}...` },
                { type: 'design', text: 'Sourcing high-fidelity visual assets...', status: 'OK' },
                { type: 'build', text: 'Generating live-interactive bundle...', status: 'OK' }
            ];

            for (const step of steps) {
                printLog(step);
                await new Promise(r => setTimeout(r, Math.random() * 500 + 400));
            }
        }

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Analyzing...';
            
            const log = document.getElementById('studio-log');
            log.innerHTML = '';
            log.classList.add('active');

            const analysis = await analyzeIntent(prompt);
            await runNeuralSequence(analysis);

            const result = generateFinalBundle(prompt, analysis);
            if (window.dwOpenPreview) window.dwOpenPreview(result);

            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Trial';
        };

        function generateFinalBundle(prompt, analysis) {
            const lang = (prompt.match(/[a-z]/i) && !prompt.match(/[\u0600-\u06FF]/)) ? 'en' : 'ar';
            const { name, color, tone, niche } = analysis;

            const imageUrl = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200`;

            const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Power by Neural Architect</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="theme-${tone} niche-${niche}">
    <nav style="padding: 1.5rem 3rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); position: fixed; width: 100%; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="font-weight: 900; font-size: 1.5rem; color: ${color};">${name}</div>
        <div style="display: flex; gap: 20px; align-items: center;">
            <a href="#" style="color: white; text-decoration: none;">${DICT[lang].nav_home}</a>
            <a href="#contact" style="background: ${color}; color: black; padding: 10px 25px; border-radius: 100px; text-decoration: none; font-weight: 900;">${DICT[lang].nav_contact}</a>
        </div>
    </nav>

    <header style="min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: #050505; position: relative; overflow: hidden; padding: 0 2rem;">
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, ${color}11 0%, transparent 70%);"></div>
        <div class="reveal">
            <h1 style="font-size: min(5rem, 12vw); font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px;">${name}</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 1.3rem; margin: 30px 0;">Architected for: "${prompt}"</p>
            <button onclick="dwSimulate()" style="background: ${color}; color: black; border: none; padding: 20px 50px; border-radius: 15px; font-weight: 900; cursor: pointer;">${DICT[lang].hero_btn}</button>
        </div>
    </header>

    <footer style="padding: 100px 2rem; background: #000; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
        <p style="opacity: 0.3;">&copy; ${new Date().getFullYear()} ${name}. ${DICT[lang].footer}</p>
        <div id="server-console" style="margin-top: 40px; background: #080808; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 0.8rem; color: ${color}; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
            [SYSTEM] Server initialized at ${new Date().toLocaleTimeString()}
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

            const css = `
:root { --accent: ${color}; --bg: #050505; }
body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; scroll-behavior: smooth; }
.reveal { opacity: 0; transform: translateY(30px); transition: 1s cubic-bezier(0.19, 1, 0.22, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: ${color}33; border-radius: 10px; }`;

            const js = `
function dwSimulate() {
    const console = document.getElementById('server-console');
    const log = document.createElement('div');
    log.innerText = '[' + new Date().toLocaleTimeString() + '] ACTION: Button Click. Result: 200 OK - Redirecting...';
    console.prepend(log);
}
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(e => {
        e.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
    });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});`;

            return { html, css, js };
        }

        function printLog(step) {
            const log = document.getElementById('studio-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const prefix = { sys: '[BRAIN]', arch: '[ARCH]', design: '[DESIGN]', build: '[BUILD]' }[step.type];
            entry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                               <span class="prefix" style="color:var(--accent)">${prefix}</span>
                               <span class="text">${step.text}</span>`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStudio);
    else initStudio();
})();
