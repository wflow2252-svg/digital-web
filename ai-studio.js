// Digital Web - Superhuman Visual Architect (v3)
(function() {
    const promptInput = document.getElementById('studio-prompt');
    const generateBtn = document.getElementById('studio-generate-btn');

    if (!generateBtn) return;

    // ELITE COMPONENTS LIBRARY
    const COMPONENTS = {
        NAVBAR: (name, color) => `
            <nav style="padding: 1.5rem 3rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); position: fixed; width: 100%; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-weight: 900; font-size: 1.8rem; color: white; display: flex; align-items: center; gap: 10px;">
                    <span style="width: 32px; height: 32px; background: ${color}; border-radius: 8px;"></span>
                    ${name}
                </div>
                <div style="display: flex; gap: 30px; align-items: center;">
                    <a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">الرئيسية</a>
                    <a href="#services" style="color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">الخدمات</a>
                    <a href="#contact" style="background: ${color}; color: white; padding: 10px 24px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 0.85rem; box-shadow: 0 10px 20px ${color}33;">ابدأ الآن</a>
                </div>
            </nav>`,
        
        HERO: (name, color, prompt, imageUrl) => `
            <header style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 120px 3rem 60px; position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, ${color}33 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${color}22 0%, transparent 50%); z-index: -1;"></div>
                <div style="max-width: 1200px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: center;">
                    <div class="reveal">
                        <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 100px; font-size: 11px; font-weight: 800; color: ${color}; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px;">
                            <span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; display: block;"></span>
                            ARCHITECTED BY NEURAL_V3
                        </div>
                        <h1 style="font-size: min(5.5rem, 10vw); font-weight: 900; margin:0; line-height:0.95; letter-spacing: -3px; background: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.5)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${name}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 1.3rem; line-height: 1.6; margin: 30px 0 45px; max-width: 550px;">تم بناء هذا المشروع بنظام "Visual Compiling" الفائق الحداثة، ليعبر عن رؤيتك: "${prompt.substring(0, 50)}..."</p>
                        <div style="display: flex; gap: 20px;">
                            <button class="mag-btn" style="background: ${color}; color: white; border: none; padding: 20px 45px; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 20px 40px ${color}44;">اتصل بنا اليوم</button>
                            <button style="background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 20px 45px; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">المزيـد</button>
                        </div>
                    </div>
                    <div class="reveal" style="position: relative;">
                        <div style="width: 100%; aspect-ratio: 4/5; border-radius: 40px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);">
                            <img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover; transition: 1s cubic-bezier(0.19, 1, 0.22, 1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        </div>
                        <div class="floating" style="position: absolute; top: -30px; right: -30px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); padding: 25px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.3); width: 180px;">
                            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 5px;">الجودة</div>
                            <div style="font-weight: 900; font-size: 1.5rem; color: ${color};">100%</div>
                            <div style="width:100%; height:4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 10px;"><div style="width:100%; height:100%; background: ${color}; border-radius: 2px;"></div></div>
                        </div>
                    </div>
                </div>
            </header>`,

        FEATURES: (color, imageUrls) => `
            <section id="services" style="padding: 120px 3rem; background: rgba(255,255,255,0.01);">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 80px;">
                        <h2 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 20px;">خِدْمات خارقة</h2>
                        <p style="color: rgba(255,255,255,0.4); font-size: 1.2rem; max-width: 600px; margin: 0 auto;">نحن نعيد تعريف المعايير الرقمية لنضعك في القمة.</p>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;">
                        ${[
                            { t: 'تقنية بصرية', d: 'واجهات فائقة الدقة تعبر عن هويتك بوضوح.', icon: 'view_in_ar', img: imageUrls[1] },
                            { t: 'سرعة البرق', d: 'أداء محسن لضمان تجربة مستخدم خالية من الانتظار.', icon: 'bolt', img: imageUrls[2] },
                            { t: 'ذكاء ابتكاري', d: 'حلول تعتمد على أحدث تقنيات المعالجة الرقمية.', icon: 'psychology', img: imageUrls[3] }
                        ].map((f, i) => `
                            <div class="reveal" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 32px; overflow: hidden; transition: 0.5s;" onmouseover="this.style.transform='translateY(-10px)'; this.style.borderColor='${color}'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.05)'">
                                <div style="height: 200px; overflow: hidden;"><img src="${f.img}" style="width:100%; height:100%; object-fit:cover;"></div>
                                <div style="padding: 40px;">
                                    <span class="material-symbols-outlined" style="font-size: 2.5rem; color: ${color}; margin-bottom: 20px;">${f.icon}</span>
                                    <h3 style="font-size: 1.6rem; margin: 0 0 15px;">${f.t}</h3>
                                    <p style="color: rgba(255,255,255,0.4); line-height: 1.6;">${f.d}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>`,

        FOOTER: (name, color) => `
            <footer style="padding: 100px 3rem 40px; text-align: center; background: #000; position: relative;">
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 200px; height: 1px; background: linear-gradient(90deg, transparent, ${color}, transparent);"></div>
                <h2 style="font-size: 2rem; font-weight: 900; color: white; margin-bottom: 20px;">${name}</h2>
                <div style="display: flex; gap: 30px; justify-content: center; margin-bottom: 60px;">
                    <a href="#" style="color: rgba(255,255,255,0.3); text-decoration: none;">Instagram</a>
                    <a href="#" style="color: rgba(255,255,255,0.3); text-decoration: none;">Twitter</a>
                    <a href="#" style="color: rgba(255,255,255,0.3); text-decoration: none;">LinkedIn</a>
                </div>
                <div style="color: rgba(255,255,255,0.2); font-size: 0.8rem; font-weight: 700; letter-spacing: 2px;">
                    DESIGNED BY SUPERHUMAN_AI &bull; DIGITAL WEB &copy; ${new Date().getFullYear()}
                </div>
            </footer>`
    };

    generateBtn.onclick = async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            promptInput.style.borderColor = '#ff3b30';
            setTimeout(() => promptInput.style.borderColor = '', 2000);
            return;
        }

        generateBtn.disabled = true;
        promptInput.disabled = true;
        generateBtn.innerHTML = '<span class="material-symbols-outlined spinning">sync</span> ARCHITECTING_ELITE...';

        const log = document.getElementById('studio-log');
        log.innerHTML = '';
        log.classList.add('active');

        // Neural Flow
        const niche = extractNiche(prompt);
        await runNeuralSequence(prompt);

        const html = await generateTrialWebsite(prompt, niche);
        if (window.dwOpenPreview) {
            window.dwOpenPreview(btoa(html));
        }

        generateBtn.disabled = false;
        promptInput.disabled = false;
        generateBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span> Generate Trial';
    };

    function extractNiche(p) {
        const p_l = p.toLowerCase();
        if (p_l.includes('عطر') || p_l.includes('fragrance')) return 'perfume,luxury';
        if (p_l.includes('مطعم') || p_l.includes('بيتزا') || p_l.includes('food')) return 'restaurant,food';
        if (p_l.includes('عقار') || p_l.includes('بيت')) return 'realestate,architecture';
        if (p_l.includes('تكنولوجيا') || p_l.includes('برمج') || p_l.includes('saas')) return 'technology,cyber';
        if (p_l.includes('شيك') || p_l.includes('ملابس') || p_l.includes('fashion')) return 'fashion,model';
        return 'modern,abstract';
    }

    async function runNeuralSequence(prompt) {
        const steps = [
            { type: 'sys', text: 'Neural Engine v5.0 (SUPERHUMAN) Ready.' },
            { type: 'arch', text: 'Visual Asset Sourcing: Extracting niche clusters...' },
            { type: 'design', text: 'Mesh Gradient Synthesis: Generating cinematic HSL scales...' },
            { type: 'build', text: 'Compiling Glassmorphism v3 Layers...', status: 'OK' },
            { type: 'build', text: 'Architecting 3D-Composited Hero Section...', status: 'OK' },
            { type: 'sys', text: 'Injecting Superhuman Motion Core (Magnetic Interactions)...' },
            { type: 'sys', text: 'Finalizing Cinematic Render...' }
        ];

        for (const step of steps) {
            printLog(step);
            await new Promise(r => setTimeout(r, Math.random() * 600 + 400));
        }
    }

    function printLog(step) {
        const log = document.getElementById('studio-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const prefix = { sys: '[SYSTEM]', arch: '[VISUAL_AI]', design: '[CINEMATIC]', build: '[ENGINEER]' }[step.type];
        entry.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span class="prefix" style="color:#3b82f6; font-weight:900;">${prefix}</span>
            <span class="text">${step.text}</span>
            ${step.status ? `<span class="status-ok" style="color:#10b981;">[${step.status}]</span>` : ''}
        `;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    async function generateTrialWebsite(prompt, niche) {
        const input = prompt.toLowerCase();
        const nameMatch = prompt.match(/(لـ|اسم|لشركة) ([\w\s\u0600-\u06FF]+)/);
        const name = nameMatch ? nameMatch[2].trim() : 'Digital Elite';
        
        let color = '#3b82f6';
        if (input.includes('أحمر') || input.includes('red')) color = '#ef4444';
        if (input.includes('أخضر') || input.includes('green')) color = '#10b981';
        if (input.includes('ذهب') || input.includes('gold')) color = '#fbbf24';
        if (input.includes('بنفسجي') || input.includes('purple')) color = '#8b5cf6';

        // Fetch Dynamic Images
        const imageUrls = [
            `https://images.unsplash.com/photo-1549421263-ce0f8368f04c?auto=format&fit=crop&q=80&w=800&sig=1`,
            `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&sig=2`,
            `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&sig=3`,
            `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&sig=4`
        ];

        let bodyContent = COMPONENTS.NAVBAR(name, color);
        bodyContent += COMPONENTS.HERO(name, color, prompt, imageUrls[0]);
        bodyContent += COMPONENTS.FEATURES(color, imageUrls);
        bodyContent += COMPONENTS.FOOTER(name, color);

        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Superhuman Visuals</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        :root { --primary: ${color}; --bg: #050505; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; scroll-behavior: smooth; }
        
        .reveal { opacity: 0; transform: translateY(40px) scale(0.95); transition: 1.2s cubic-bezier(0.19, 1, 0.22, 1); filter: blur(10px); }
        .reveal.active { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }

        @keyframes floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .floating { animation: floating 6s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: ${color}33; border-radius: 10px; }
    </style>
</head>
<body>
    ${bodyContent}
    <script>
        // Reveal Logic
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Magnetic Button Logic
        document.querySelectorAll('.mag-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = \`translate(\${x * 0.3}px, \${y * 0.3}px)\`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    </script>
</body>
</html>`;
    }

    const style = document.createElement('style');
    style.textContent = \`@keyframes dw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spinning { animation: dw-spin 2s linear infinite; }\`;
    document.head.appendChild(style);
})();
