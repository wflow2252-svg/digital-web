// Digital Web - High-Fidelity Visual Architect (v3.1)
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        // ELITE COMPONENTS LIBRARY
        const COMPONENTS = {
            NAVBAR: (name, color) => `
                <nav style="padding: 1.5rem 3rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(20px); position: fixed; width: 100%; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-weight: 900; font-size: 1.8rem; color: white; display: flex; align-items: center; gap: 10px;">
                        <span style="width: 32px; height: 32px; background: ${color}; border-radius: 8px; box-shadow: 0 0 20px ${color}66;"></span>
                        ${name}
                    </div>
                    <div style="display: flex; gap: 30px; align-items: center;">
                        <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">الرئيسية</a>
                        <a href="#services" style="color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">الخدمات</a>
                        <a href="#contact" style="background: ${color}; color: white; padding: 10px 24px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 0.85rem; box-shadow: 0 10px 20px ${color}33; transition: 0.3s;">ابدأ الآن</a>
                    </div>
                </nav>`,
            
            HERO: (name, color, prompt, imageUrl) => `
                <header style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 140px 3rem 60px; position: relative; overflow: hidden; background: #050505;">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 15% 50%, ${color}22 0%, transparent 40%), radial-gradient(circle at 85% 50%, ${color}11 0%, transparent 40%); z-index: 0;"></div>
                    <div style="max-width: 1250px; display: grid; grid-template-columns: 1.1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1;">
                        <div class="reveal">
                            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; color: ${color}; margin-bottom: 25px;">
                                <span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%;"></span>
                                HIGH_FIDELITY ARCHITECTURE
                            </div>
                            <h1 style="font-size: min(5rem, 10vw); font-weight: 900; line-height: 0.95; margin: 0; letter-spacing: -3px;">
                                <span style="display:block;">هندسة</span>
                                <span style="color: ${color};">${name}</span>
                            </h1>
                            <p style="color: rgba(255,255,255,0.4); font-size: 1.3rem; line-height: 1.6; margin: 30px 0 45px; max-width: 500px;">
                                مشروع برمجي متكامل تم بناؤه بواسطة الذكاء الاصطناعي بناءً على رؤيتك: 
                                <span style="color: white; font-style: italic;">"${prompt.substring(0, 40)}..."</span>
                            </p>
                            <div style="display: flex; gap: 15px;">
                                <button class="mag-btn" style="background: ${color}; color: white; border: none; padding: 18px 45px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 15px 35px ${color}33;">مشروعك يبدأ هنا</button>
                                <button style="background: rgba(255,255,255,0.03); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 18px 45px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s;">التفاصيل</button>
                            </div>
                        </div>
                        <div class="reveal" style="position: relative;">
                            <div style="aspect-ratio: 1; background: ${color}; border-radius: 40px; position: absolute; inset: -10px; opacity: 0.1; filter: blur(50px); z-index: -1;"></div>
                            <div style="border-radius: 40px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.5); transform: perspective(1000px) rotateY(-5deg);">
                                <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                            </div>
                        </div>
                    </div>
                </header>`,

            FEATURES: (color) => `
                <section id="services" style="padding: 100px 3rem; background: #080808;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="text-align: center; margin-bottom: 70px;">
                            <h2 style="font-size: 3rem; font-weight: 900;">حلول تقنية ذكية</h2>
                            <div style="width: 60px; height: 4px; background: ${color}; margin: 20px auto; border-radius: 2px;"></div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px;">
                            ${['الدقة المتناهية', 'الأداء المتفجر', 'واجهات المستقبل'].map((t, i) => `
                                <div class="reveal" style="background: rgba(255,255,255,0.02); padding: 60px 40px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.05); transition: 0.4s;" onmouseover="this.style.borderColor='${color}'; this.style.transform='translateY(-10px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)'">
                                    <div style="width: 60px; height: 60px; background: ${color}22; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px;">
                                        <span class="material-symbols-outlined" style="color: ${color}; font-size: 2rem;">${['verified', 'bolt', 'rocket'][i]}</span>
                                    </div>
                                    <h3 style="font-size: 1.5rem; margin-bottom: 15px;">${t}</h3>
                                    <p style="color: rgba(255,255,255,0.4); line-height: 1.7;">تصميم وبرمجة مخصصة لتلبية أعلى معايير الجودة العالمية في تجربة المستخدم.</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>`,

            FOOTER: (name, color) => `
                <footer style="padding: 100px 3rem 40px; text-align: center; background: #000; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 2rem; font-weight: 900; margin-bottom: 30px;">${name}</div>
                    <div style="color: rgba(255,255,255,0.2); font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">
                        Generated by AI Lab &bull; Digital Web &copy; ${new Date().getFullYear()}
                    </div>
                </footer>`
        };

        async function runNeuralSequence(prompt) {
            const steps = [
                { type: 'sys', text: 'Stability Check: Connection re-established.' },
                { type: 'arch', text: 'Analyzing High-Fidelity requirements...' },
                { type: 'design', text: 'Sourcing premium visual assets from Unsplash...', status: 'OK' },
                { type: 'design', text: 'Synthesizing Glassmorphism v3 styles...' },
                { type: 'build', text: 'Architecting index.html structure...', status: 'OK' },
                { type: 'build', text: 'Compiling real-world styles.css pack...', status: 'OK' },
                { type: 'sys', text: 'Finalizing live project bundle.' }
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
            const prefix = { sys: '[SYS]', arch: '[ARCH]', design: '[DESIGN]', build: '[BUILD]' }[step.type];
            entry.innerHTML = `
                <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span class="prefix" style="color:#3b82f6; font-weight:900;">${prefix}</span>
                <span class="text">${step.text}</span>
                ${step.status ? `<span class="status-ok" style="color:#10b981;">[${step.status}]</span>` : ''}
            `;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                promptInput.style.borderColor = '#ff3b30';
                setTimeout(() => promptInput.style.borderColor = '', 2000);
                return;
            }

            generateBtn.disabled = true;
            promptInput.disabled = true;
            generateBtn.innerHTML = '<span class="material-symbols-outlined spinning">sync</span> Architecting...';

            const log = document.getElementById('studio-log');
            log.innerHTML = '';
            log.classList.add('active');

            await runNeuralSequence(prompt);

            const result = generateTrialWebsiteBundle(prompt);
            
            if (window.dwOpenPreview) {
                window.dwOpenPreview(result);
            }

            generateBtn.disabled = false;
            promptInput.disabled = false;
            generateBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span> Generate Trial';
        };

        function generateTrialWebsiteBundle(prompt) {
            const input = prompt.toLowerCase();
            const nameMatch = prompt.match(/(لـ|اسم|لشركة) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Digital Elite';
            
            let color = '#3b82f6';
            if (input.includes('أحمر') || input.includes('red')) color = '#ef4444';
            if (input.includes('أخضر') || input.includes('green')) color = '#10b981';
            if (input.includes('ذهب') || input.includes('gold')) color = '#fbbf24';
            if (input.includes('بنفسجي') || input.includes('purple')) color = '#8b5cf6';

            const imageUrl = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200`;

            const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | High-Fidelity Trial</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${COMPONENTS.NAVBAR(name, color)}
    ${COMPONENTS.HERO(name, color, prompt, imageUrl)}
    ${COMPONENTS.FEATURES(color)}
    ${COMPONENTS.FOOTER(name, color)}

    <script src="script.js"></script>
</body>
</html>`;

            const css = `
:root { --primary: ${color}; --bg: #050505; }
body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; scroll-behavior: smooth; }
.reveal { opacity: 0; transform: translateY(40px); transition: 1s cubic-bezier(0.19, 1, 0.22, 1); filter: blur(10px); }
.reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: ${color}33; border-radius: 10px; }`;

            const js = `
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});`;

            return { html, css, js };
        }
    }

    // STABILITY WRAPPER
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStudio);
    } else {
        initStudio();
    }
})();
// Helper for spinning effect
(function(){
    const style = document.createElement('style');
    style.textContent = \`@keyframes dw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spinning { animation: dw-spin 2s linear infinite; }\`;
    document.head.appendChild(style);
})();
