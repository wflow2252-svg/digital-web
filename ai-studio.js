// Sovereign AI v11.0 - The Master Architect Core
// (c) 2026 Digital Web - AI Website Builder

(function () {
    /**
     * KNOWLEDGE_REGISTRY: Maps intent to designs, copy, and icons.
     * This fulfills the "Master Prompt" logic for specialized professional content.
     */
    const KNOWLEDGE_REGISTRY = {
        niche_patterns: {
            fashion: {
                keywords: ['لبس', 'ملابس', 'fashion', 'clothes', 'لبس', 'موضة'],
                ar_title: 'متجر الأنظار العصرية',
                ar_desc: 'اكتشف أرقى خطوط الموضة التي تجمع بين الفخامة والراحة. صُمم خصيصاً لمن يبحث عن التميز.',
                services: [
                    { t: 'تصميمات حصرية', d: 'قطع فريدة لن تجدها في أي مكان آخر، تمت صناعتها بعناية.' },
                    { t: 'توصيل سريع', d: 'نصل إليك أينما كنت في أسرع وقت مع سياسة استبدال سهلة.' },
                    { t: 'جودة عالمية', d: 'نستخدم أفضل الخامات لضمان عمر أطول لكل قطعة تقتنيها.' }
                ],
                unsplash: 'fashion,apparel',
                accent: '#e11d48' // Rose 600
            },
            restaurant: {
                keywords: ['مطعم', 'أكل', 'food', 'restaurant', 'طعام', 'وجبة'],
                ar_title: 'مذاق السنديان الرقمي',
                ar_desc: 'نقدم لك تجربة طعام فريدة لا تُنسى في قلب المدينة. أطباقنا محضرة بحب وأعلى معايير الجودة.',
                services: [
                    { t: 'منيو عالمي', d: 'أطباق فاخرة من مختلف مطابخ العالم تحت سقف واحد.' },
                    { t: 'خدمة التوصيل', d: 'استمتع بمذاقنا في منزلك مع أسرع خدمة توصيل في المنطقة.' },
                    { t: 'حجز طاولات', d: 'نوفر لك بيئة هادئة ومميزة لمناسباتك الخاصة مع أحبائك.' }
                ],
                unsplash: 'gourmet,restaurant',
                accent: '#ea580c' // Orange 600
            },
            tech: {
                keywords: ['برمجة', 'تقنية', 'software', 'tech', 'تطوير', 'برمجيات'],
                ar_title: 'آفاق المستقبل للحلول الرقمية',
                ar_desc: 'نحول أفكارك الطموحة إلى واقع ملموس عبر حلول برمجية مبتكرة وتصاميم عصرية.',
                services: [
                    { t: 'تطوير الويب', d: 'مواقع فائقة السرعة تضمن لك أفضل أداء وتجربة مستخدم.' },
                    { t: 'تطبيقات الجوال', d: 'تطبيقات ذكية تعمل بسلاسة على كافة أنظمة الهاتف.' },
                    { t: 'استشارات تقنية', d: 'نوجهك نحو أفضل التقنيات لنمو أعمالك وضمان تفوقك.' }
                ],
                unsplash: 'technology,software',
                accent: '#2563eb' // Blue 600
            }
        },
        default: {
            ar_title: 'مشروعك الجديد مع Digital Web',
            ar_desc: 'نحن هنا لمساعدتك في بناء حضور رقمي يليق بطموحاتك وتوقعات عملائك.',
            services: [
                { t: 'التميز الرقمي', d: 'تصميمات تعكس هوية علامتك التجارية بوضوح واحترافية.' },
                { t: 'تكامل الأنظمة', d: 'ربط ذكي لأعمالك مع أحدث الأدوات التقنية المتاحة.' },
                { t: 'دعم مستمر', d: 'فريقنا معك في كل خطوة لضمان استدامة نجاحك الرقمي.' }
            ],
            unsplash: 'modern,business',
            accent: '#3b82f6'
        }
    };

    function initMasterArchitect() {
        const generateBtn = document.getElementById('studio-generate-btn');
        const promptInput = document.getElementById('studio-prompt');
        const registryDisplay = document.getElementById('registry-size');

        if (!generateBtn || !promptInput) return;

        if (registryDisplay) registryDisplay.innerText = "Master Architect v11.0 | Tailwind Logic Active";

        // Semantic Analysis Logic
        function analyzeIntent(prompt) {
            const p = prompt.toLowerCase();
            let matched = KNOWLEDGE_REGISTRY.default;
            let theme = 'tech';

            for (const key in KNOWLEDGE_REGISTRY.niche_patterns) {
                const pattern = KNOWLEDGE_REGISTRY.niche_patterns[key];
                if (pattern.keywords.some(k => p.includes(k))) {
                    matched = pattern;
                    theme = key;
                    break;
                }
            }

            const nameMatch = prompt.match(/(لـ|اسم|لشركة|for|called|باسم) ([\w\s\u0600-\u06FF]+)/);
            const rawName = nameMatch ? nameMatch[2].trim() : 'Sovereign Digital';

            return { matched, name: rawName, prompt, theme };
        }

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> ARCHITECTING...';

            const log = document.getElementById('studio-log');
            log.innerHTML = `<div class="synthesis-overlay">
                <div class="loader"></div>
                <div class="status-msg">Master Architect Internalizing...</div>
                <div class="thought-stream" id="thought-stream"></div>
            </div>`;
            log.classList.add('active');

            const stream = document.getElementById('thought-stream');
            const appendThought = (txt, type = '') => {
                const el = document.createElement('div');
                el.className = 'neural-log ' + type;
                el.innerText = `[SEMANTIC] > ${txt}`;
                stream.appendChild(el);
                stream.scrollTop = stream.scrollHeight;
                return new Promise(r => setTimeout(r, 500));
            };

            await appendThought('Decoding Deep Intent from Prompt...');
            const analysis = analyzeIntent(prompt);
            await appendThought(`Niche Detected: ${analysis.theme.toUpperCase()}`, 'architecture');
            await appendThought('Mapping Arabic Copy & Conversion Strategy...', 'logic');
            await appendThought('Selecting Component Library (Landing Page Meta)...');
            await appendThought('Injecting Tailwind CSS Grid & Flexbox clusters...');
            await appendThought('Synchronizing Unsplash Asset Nodes...');
            await appendThought('Applying "The Hook" Lead-Gen Logic...', 'conversion');

            const { matched, name } = analysis;
            const accent = matched.accent;

            // TAILWIND COMPONENT MAPPER
            const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>body { font-family: 'Cairo', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900 overflow-x-hidden">
    
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div class="text-2xl font-black" style="color:${accent}">${name.toUpperCase()}</div>
            <div class="hidden md:flex gap-8 font-bold text-sm text-slate-600">
                <a href="#" class="hover:text-slate-900 transition">الرئيسية</a>
                <a href="#" class="hover:text-slate-900 transition">الخدمات</a>
                <a href="#" class="hover:text-slate-900 transition">آراء العملاء</a>
            </div>
            <button class="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition">تواصل معنا</button>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
        <div class="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-${matched.unsplash === 'fashion,apparel' ? '1441986300917-64674bd600d8' : matched.unsplash === 'gourmet,restaurant' ? '1514362545857-3bc16c4c7d1b' : '1504384308090-c894fdcc538d'}?auto=format&fit=crop&w=1600&q=80" class="w-full h-full object-cover">
        </div>
        <div class="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent"></div>
        <div class="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
                <h1 class="text-5xl md:text-7xl font-black leading-tight">${matched.ar_title}</h1>
                <p class="text-xl text-slate-300 max-width-xl leading-relaxed">${matched.ar_desc}</p>
                <div class="flex gap-4">
                    <button class="px-8 py-4 rounded-xl font-black text-lg shadow-2xl shadow-rose-500/20 transition-all hover:-translate-y-1" style="background:${accent}">ابدأ التجربة الآن</button>
                    <button class="px-8 py-4 rounded-xl font-black text-lg bg-white/10 backdrop-blur hover:bg-white/20 transition">رؤية المزيد</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Services -->
    <section class="py-24 max-w-7xl mx-auto px-6">
        <div class="text-center space-y-4 mb-16">
            <h2 class="text-4xl font-black tracking-tight">خدماتنا المتميزة</h2>
            <p class="text-slate-500 max-w-2xl mx-auto">نحن نؤمن بالجودة والابتكار في كل تفصيلة نقدمها لعملائنا.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            ${matched.services.map(s => `
                <div class="p-8 bg-white rounded-3xl border border-slate-100 hover:border-slate-300 transition-all hover:shadow-xl group">
                    <div class="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center opacity-20 group-hover:opacity-100 transition" style="background:${accent}; color:#fff">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-3">${s.t}</h3>
                    <p class="text-slate-500 leading-relaxed">${s.d}</p>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- Testimonials (The Hook Precursor) -->
    <section class="py-24 bg-slate-50 border-y border-slate-200">
        <div class="max-w-7xl mx-auto px-6">
            <div class="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm md:flex gap-12 items-center">
                <div class="flex-1 space-y-6">
                    <div class="flex gap-1 text-yellow-400">
                        ${[1, 2, 3, 4, 5].map(() => '<svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>').join('')}
                    </div>
                    <p class="text-2xl italic font-medium leading-relaxed">"بفضل الحلول التي قدمتها Digital Web، تمكنت من مضاعفة مبيعاتي والوصول لجمهور أكبر بتصميم احترافي وسلس."</p>
                    <div class="font-bold">- محمد العمري، أحد عملاء النخبة</div>
                </div>
                <div class="w-32 h-32 rounded-full bg-slate-100 flex-shrink-0 mt-8 md:mt-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" class="w-full h-full object-cover grayscale">
                </div>
            </div>
        </div>
    </section>

    <!-- Contact + The Hook -->
    <section class="py-24 max-w-4xl mx-auto px-6 text-center space-y-12">
        <h2 class="text-5xl font-black">احصل على نسختك الاحترافية</h2>
        <p class="text-xl text-slate-500 leading-relaxed">هذه نسخة أولية ذكية تم إنشاؤها فوراً. هل أنت مستعد لتحويلها إلى موقع متكامل بنطاق (Domain) خاص ولوحة تحكم متطورة؟</p>
        <div class="bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white space-y-8">
            <h3 class="text-3xl font-black">تواصل مع فريق Digital Web الآن</h3>
            <div class="flex flex-col md:flex-row gap-4 justify-center">
                <input type="email" placeholder="بريدك الإلكتروني" class="px-8 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500">
                <button class="px-12 py-4 rounded-xl font-black bg-white text-slate-900 hover:bg-slate-100 transition shadow-xl" style="background:${accent}; color:#fff">طلب النسخة الكاملة</button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-slate-100 text-center text-slate-400 font-bold text-sm">
        جميع الحقوق محفوظة لقسم الذكاء الاصطناعي في Digital Web &copy; 2026
    </footer>

</body>
</html>`;

            const results = {
                html,
                code: html,
                logic: ['Semantic Analysis', 'Tailwind Mapping', 'Conversion Logic'],
                analysis
            };

            window.dwOpenPreview(results);

            setTimeout(() => {
                log.classList.remove('active');
                generateBtn.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span> Generate Trial';
                generateBtn.disabled = false;
            }, 800);
        };

        // UI Handlers (Previously implemented in v10)
        window.dwOpenPreview = async (data) => {
            const dashboard = document.getElementById('studio-result-dashboard');
            dashboard.classList.remove('hidden');
            
            const visionTab = document.getElementById('tab-vision');
            visionTab.innerHTML = `<iframe id="preview-frame" style="width:100%; height:100%; border:none;"></iframe>`;
            const frame = document.getElementById('preview-frame');
            frame.contentWindow.document.open();
            frame.contentWindow.document.write(data.html);
            frame.contentWindow.document.close();

            document.getElementById('code-display').innerText = data.code;
            
            // Terminal Logic Visualization
            const logicDisplay = document.getElementById('logic-display');
            logicDisplay.innerHTML = `<div class="logic-stream-terminal" id="terminal-v11"></div>`;
            const term = document.getElementById('terminal-v11');
            
            const writeTerm = (cmd, out) => {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.innerHTML = `<span class="t-ts">[${new Date().toLocaleTimeString()}]</span><span class="t-cmd">${cmd}</span><span class="t-out">${out}</span>`;
                term.appendChild(line);
                term.scrollTop = term.scrollHeight;
                return new Promise(r => setTimeout(r, 400));
            };

            await writeTerm('MASTER_BRAIN', 'Internalizing Professional Prompt v11.0');
            await writeTerm('SEMANIC_EXTRACT', `Niche: ${data.analysis.theme} | Complexity: Enterprise`);
            await writeTerm('TAILWIND_BOOT', 'Injecting Utility-First System...');
            await writeTerm('CONVERSION_SYNC', 'Mapping Call-to-Action nodes...');
            await writeTerm('THE_HOOK', 'Embedding Lead Generation Logic...');
            await writeTerm('SUCCESS', 'Digital Web Master Synthesis Complete.');
        };

        window.dwSwitchTab = (tabId) => {
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('tab-' + tabId).classList.add('active');
            if (event) event.target.classList.add('active');
        };

        window.dwResetStudio = () => {
            document.getElementById('studio-result-dashboard').classList.add('hidden');
            promptInput.value = '';
        };

        window.dwCopyResult = () => {
            navigator.clipboard.writeText(document.getElementById('code-display').innerText).then(() => alert('Master Blueprint Copied!'));
        };

        window.dwQuickPrompt = (txt) => {
            promptInput.value = txt;
            generateBtn.click();
        };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMasterArchitect);
    else initMasterArchitect();
})();
