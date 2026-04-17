// Digital Web - Neural Architect v2
(function() {
    const promptInput = document.getElementById('studio-prompt');
    const generateBtn = document.getElementById('studio-generate-btn');

    if (!generateBtn) return;

    // COMPONENTS LIBRARY
    const COMPONENTS = {
        NAVBAR: (name, color) => `
            <nav style="padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100;">
                <div style="font-weight: 900; font-size: 1.5rem; color: ${color};">${name}</div>
                <div style="display: flex; gap: 20px;">
                    <a href="#" style="color: white; text-decoration: none; font-weight: 600; font-size: 0.9rem;">الرئيسية</a>
                    <a href="#services" style="color: white; text-decoration: none; font-weight: 600; font-size: 0.9rem;">الخدمات</a>
                    <a href="#contact" style="color: white; text-decoration: none; font-weight: 600; font-size: 0.9rem;">اتصل بنا</a>
                </div>
            </nav>`,
        
        HERO: (name, color, prompt) => `
            <header style="min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: radial-gradient(circle at center, ${color}22 0%, transparent 70%);">
                <h1 style="font-size: min(5rem, 12vw); font-weight: 900; margin:0; line-height:1; letter-spacing: -2px;">${name}</h1>
                <p style="color: rgba(255,255,255,0.6); font-size: 1.3rem; max-width: 600px; margin: 2rem 0;">مشروع تم هندسته برمجياً بالكامل بواسطة الذكاء الاصطناعي لـ Digital Web استجابةً لطلبك: "${prompt.substring(0, 40)}..."</p>
                <button onclick="showAlert()" style="background: ${color}; color: white; border: none; padding: 18px 45px; border-radius: 50px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 30px ${color}33;">ابدأ التجربة</button>
            </header>`,

        FEATURES: (color) => `
            <section id="services" style="padding: 80px 2rem; max-width: 1200px; margin: 0 auto;">
                <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 50px;">مميزاتنا الذكية</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px; transition: 0.3s;" onmouseover="this.style.borderColor='${color}'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'">
                        <div style="font-size: 2.5rem; margin-bottom: 20px;">⚡</div>
                        <h3 style="margin: 0 0 15px;">أداء فائق السرعة</h3>
                        <p style="color: rgba(255,255,255,0.5); line-height: 1.6;">بنية برمجية محسنة تضمن سرعة تحميل استثنائية على كافة الأجهزة.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px; transition: 0.3s;" onmouseover="this.style.borderColor='${color}'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'">
                        <div style="font-size: 2.5rem; margin-bottom: 20px;">🎨</div>
                        <h3 style="margin: 0 0 15px;">تصميم عصري</h3>
                        <p style="color: rgba(255,255,255,0.5); line-height: 1.6;">واجهات مستخدم فريدة تركز على الجمالية وسهولة الاستخدام.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px; transition: 0.3s;" onmouseover="this.style.borderColor='${color}'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'">
                        <div style="font-size: 2.5rem; margin-bottom: 20px;">🛡️</div>
                        <h3 style="margin: 0 0 15px;">أمان متكامل</h3>
                        <p style="color: rgba(255,255,255,0.5); line-height: 1.6;">أنظمة حماية متقدمة لضمان سلامة بياناتك وبيانات عملائك.</p>
                    </div>
                </div>
            </section>`,

        PRICING: (color) => `
            <section style="padding: 80px 2rem; max-width: 900px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 10px;">خطط الأسعار</h2>
                <p style="color: rgba(255,255,255,0.5); margin-bottom: 50px;">اختر الخطة المناسبة لنمو أعمالك</p>
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 24px; flex: 1; min-width: 250px;">
                        <h4 style="color: ${color}; text-transform: uppercase; letter-spacing: 2px;">الأساسية</h4>
                        <div style="font-size: 3rem; font-weight: 800; margin: 20px 0;">$99</div>
                        <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">مثالية للبدء</p>
                        <button style="width: 100%; padding: 12px; border: 1px solid ${color}; background: transparent; color: white; border-radius: 12px; cursor: pointer;">ابدأ الآن</button>
                    </div>
                    <div style="background: ${color}; border: 1px solid ${color}; padding: 40px; border-radius: 24px; flex: 1; min-width: 250px; transform: scale(1.05);">
                        <h4 style="color: white; text-transform: uppercase; letter-spacing: 2px;">الاحترافية</h4>
                        <div style="font-size: 3rem; font-weight: 800; margin: 20px 0;">$299</div>
                        <p style="color: rgba(255,255,255,0.9); margin-bottom: 30px;">الأكثر طلباً</p>
                        <button style="width: 100%; padding: 12px; border: none; background: white; color: ${color}; border-radius: 12px; font-weight: 800; cursor: pointer;">ابدأ الآن</button>
                    </div>
                </div>
            </section>`,

        FOOTER: (name) => `
            <footer style="padding: 60px 2rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: rgba(255,255,255,0.4);">
                <p>&copy; ${new Date().getFullYear()} ${name}. جميع الحقوق محفوظة لـ Digital Web AI.</p>
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
        generateBtn.innerHTML = '<span class="material-symbols-outlined spinning">sync</span> Brainstorming...';

        const log = document.getElementById('studio-log');
        log.innerHTML = '';
        log.classList.add('active');

        // Start High-Level Neural Sequence
        await runNeuralSequence(prompt);

        const html = generateTrialWebsite(prompt);
        if (window.dwOpenPreview) {
            window.dwOpenPreview(btoa(html));
        }

        generateBtn.disabled = false;
        promptInput.disabled = false;
        generateBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span> Generate Trial';
    };

    async function runNeuralSequence(prompt) {
        const steps = [
            { type: 'sys', text: 'Neural Engine v4.5 Booted. Analyzing human input...' },
            { type: 'arch', text: 'Context mapping: Identified industry and core requirements.' },
            { type: 'arch', text: 'Architecting modular multi-section layout...' },
            { type: 'design', text: 'Selecting design tokens (Elite Typography & Glass Optics)...' },
            { type: 'build', text: 'Compiling Navbar component...', status: 'OK' },
            { type: 'build', text: 'Generating Hero with Interactive JS layer...', status: 'OK' },
            { type: 'build', text: 'Injecting Features and Pricing modules...', status: 'OK' },
            { type: 'sys', text: 'Calculating viewport responsiveness algorithms...' },
            { type: 'sys', text: 'Neural Architect has finished the creation cycle.' }
        ];

        for (const step of steps) {
            printLog(step);
            await new Promise(r => setTimeout(r, Math.random() * 500 + 500));
        }
    }

    function printLog(step) {
        const log = document.getElementById('studio-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const prefix = {
            sys: '[SYSTEM]',
            arch: '[NEURAL_ARCH]',
            design: '[CREATIVE]',
            build: '[ENGINEER]'
        }[step.type];

        entry.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span class="prefix" style="color:${step.type === 'arch' ? '#3b82f6' : '#10b981'}; font-weight:900;">${prefix}</span>
            <span class="text">${step.text}</span>
            ${step.status ? `<span class="status-ok" style="color:#10b981;">[${step.status}]</span>` : ''}
        `;
        
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    function generateTrialWebsite(prompt) {
        const input = prompt.toLowerCase();
        
        // Advanced Semantic Extraction
        const nameMatch = prompt.match(/(لـ|اسم|لشركة) ([\w\s\u0600-\u06FF]+)/);
        const name = nameMatch ? nameMatch[2].trim() : 'Elite Business';
        
        // Theme Extraction
        let color = '#3b82f6';
        if (input.includes('أحمر') || input.includes('red')) color = '#ef4444';
        if (input.includes('أخضر') || input.includes('green')) color = '#10b981';
        if (input.includes('ذهب') || input.includes('gold') || input.includes('luxury')) color = '#fbbf24';
        if (input.includes('بنفسجي') || input.includes('purple') || input.includes('neon')) color = '#8b5cf6';

        // COMPONENT ASSEMBLY (Dynamic choice based on prompt)
        let bodyContent = COMPONENTS.NAVBAR(name, color);
        bodyContent += COMPONENTS.HERO(name, color, prompt);
        
        // Add sections based on "Human Understanding"
        if (input.includes('خدمات') || input.includes('features') || input.includes('مميزات')) {
            bodyContent += COMPONENTS.FEATURES(color);
        }
        
        if (input.includes('سعر') || input.includes('pricing') || input.includes('أسعار')) {
            bodyContent += COMPONENTS.PRICING(color);
        }

        bodyContent += COMPONENTS.FOOTER(name);

        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Power by Neural Architect</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { --primary: ${color}; --bg: #050505; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; scroll-behavior: smooth; }
        
        /* Scroll Reveal Effect */
        .reveal { opacity: 0; transform: translateY(30px); transition: 1s all ease; }
        .reveal.active { opacity: 1; transform: translateY(0); }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: ${color}33; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${color}66; }
    </style>
</head>
<body>
    ${bodyContent}

    <script>
        // Real JavaScript Logic 
        function showAlert() {
            const btn = event.target;
            btn.innerHTML = 'جاري المعالجة...';
            setTimeout(() => {
                alert('شكراً لاهتمامك بـ ${name}! هذه النسخة التجريبية تعمل بكود JavaScript حقيقي تم توليده من أجلك.');
                btn.innerHTML = 'تم التسجيل';
                btn.style.background = '#10b981';
            }, 800);
        }

        // Scroll Reveal Logic
        window.addEventListener('scroll', () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - 150) el.classList.add('active');
            });
        });
    </script>
</body>
</html>`;
    }

    // CSS injection for generator UI
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: dw-spin 2s linear infinite; }
    `;
    document.head.appendChild(style);
})();
