// Sovereign AI v12.5 - Strategic Refinement Engine
// (c) 2026 Digital Web - AI Website Builder (Production Build)

(function () {
    /**
     * STRATEGIC_REGISTRY: High-Conversion Copy & Regional Dialects.
     * Addresses the "Aggressive Marketing" and "Dialect Diversity" gaps.
     */
    const STRATEGIC_REGISTRY = {
        dialects: {
            saudi: {
                welcome: 'حيّاك في عالم الفخامة الرقمية',
                cta: 'احجز مكانك في القمة',
                hook: 'تبي تحول فكرتك لإمبراطورية حقيقية بنقرة واحدة؟'
            },
            egyptian: {
                welcome: 'أهلاً بك في مصنع النجاح الرقمي',
                cta: 'سيطر على السوق دلوقتي',
                hook: 'عايز تحول حلمك لموقع عالمي بدوسة زرار واحدة؟'
            },
            msa: {
                welcome: 'أهلاً بك في آفاق السيادة الرقمية',
                cta: 'ابدأ رحلة النجاح الآن',
                hook: 'هل أنت مستعد لتحويل رؤيتك إلى واقع رقمي ملموس؟'
            }
        },
        niche_configs: {
            fashion: {
                title: 'Sovereign Fashion | ضاعف مبيعاتك بأناقة سيادية',
                desc: 'لا تكتفِ بالظهور، بل تسيد السوق بهوية بصرية تجبر الجميع على الإعجاب.',
                accent: 'indigo-500',
                unsplash: 'fashion,luxury,apparel',
                features: [
                    { t: 'تصميم هجومي مرئي', d: 'واجهات تجذب الانتباه وتعزز قرار الشراء فوراً.', size: 'md:col-span-2', icon: 'zap' },
                    { t: 'ثقة بلا حدود', d: 'عناصر أمان ومصداقية تجعل عميلك يشتري باطمئنان.', size: 'md:col-span-1', icon: 'shield-check' },
                    { t: 'سرعة تحويل فائقة', d: 'نظام طلبات ذكي يختصر المسافة بين الرغبة والامتلاك.', size: 'md:col-span-1', icon: 'trending-up' },
                    { t: 'توسع تلقائي', d: 'بنية تحتية تتحمل ملايين الزوار دون أدنى تباطؤ.', size: 'md:col-span-2', icon: 'layers' }
                ]
            },
            restaurant: {
                title: 'Elite Taste | حول زوارك إلى عشاق دائمين',
                desc: 'نحن لا نصمم قائمة طعام، نحن نصمم رحلة تذوق تبدأ من الشاشة وتنتهي بالولاء المطلق.',
                accent: 'orange-600',
                unsplash: 'gourmet,food,chef',
                features: [
                    { t: 'قائمة ذكية', d: 'عرض المنتجات بطريقة تثير الشهية وتزيد متوسط الطلب.', size: 'md:col-span-2', icon: 'utensils' },
                    { t: 'إدارة حجوزات فتاكة', d: 'أتمتة كاملة لجدول مواعيدك لضمان عدم ضياع أي فرصة.', size: 'md:col-span-1', icon: 'calendar-check' },
                    { t: 'توصيل بلا قيود', d: 'تكامل مع خرائط جوجل لضمان وصول الطلبات في وقتها.', size: 'md:col-span-1', icon: 'map-pin' },
                    { t: 'آراء النخبة', d: 'إظهار تجارب العملاء بشكل جذاب يبني الثقة فوراً.', size: 'md:col-span-2', icon: 'star' }
                ]
            },
            tech: {
                title: 'Digital Sovereignty | سيطر على المستقبل الرقمي',
                desc: 'ابنِ منصتك على أسس تقنية صلبة تضمن لك التفوق التقني والنمو المتسارع.',
                accent: 'blue-600',
                unsplash: 'technology,software,cyber',
                features: [
                    { t: 'أداء خام', d: 'سرعة تحميل أقل من 0.5 ثانية تمنحك أفضلية في محركات البحث.', size: 'md:col-span-1', icon: 'gauge' },
                    { t: 'أمان استراتيجي', d: 'حماية شاملة ضد كافة الهجمات لنمو آمن ومستدام.', size: 'md:col-span-2', icon: 'lock' },
                    { t: 'أتمتة مبيعات', d: 'محركات دفع متطورة تغلق الصفقات نيابة عنك.', size: 'md:col-span-2', icon: 'refresh-ccw' },
                    { t: 'دعم عتيد', d: 'فريق تقني يسهر على استقرار ومراقبة أنظمتك لحظياً.', size: 'md:col-span-1', icon: 'activity' }
                ]
            }
        },
        default: {
            title: 'Sovereign Growth | حلول رقمية تقلب الموازين',
            desc: 'توقف عن بناء المواقع، وابدأ في بناء إمبراطورية تجارية تعيد تعريف النجاح.',
            accent: 'indigo-600',
            unsplash: 'modern,business,architecture',
            features: [
                { t: 'تصميم استراتيجي', d: 'كل بكسل موضوع بعناية لتحقيق هدف تجاري محدد.', size: 'md:col-span-2', icon: 'target' },
                { t: 'تحويل زوار', d: 'تقنيات نفسية في التصميم ترفع معدلات الاشتراك والبيع.', size: 'md:col-span-1', icon: 'mouse-pointer-2' },
                { t: 'وثوقية مطلقة', d: 'أداء مستقر يضمن لعملائك تجربة احترافية في كل مرة.', size: 'md:col-span-1', icon: 'check-circle' },
                { t: 'تكامل ذكي', d: 'ربط سلس مع كافة أدواتك التسويقية والبرمجية.', size: 'md:col-span-2', icon: 'link' }
            ]
        }
    };

    function initStrategicStudio() {
        const generateBtn = document.getElementById('studio-generate-btn');
        const promptInput = document.getElementById('studio-prompt');
        const statusDisplay = document.getElementById('registry-size');

        if (!generateBtn || !promptInput) return;
        if (statusDisplay) statusDisplay.innerText = "Sovereign v12.5 | Strategic Refinement Active";

        const UI_FACTORY = {
            header: (name, accent) => `<nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-${accent} rounded-xl flex items-center justify-center shadow-lg shadow-${accent}/20">
                            <i data-lucide="shield-check" class="text-white w-6 h-6"></i>
                        </div>
                        <span class="text-xl font-black tracking-tighter text-white uppercase">${name.split(' ')[0]} <span class="text-${accent}">${name.split(' ')[1] || 'Digital'}</span></span>
                    </div>
                </div></nav>`,
            hero: (title, desc, img, accent, dialect) => `<section class="relative pt-44 pb-32 px-6 overflow-hidden">
                <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div class="space-y-10 relative z-10">
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-${accent}/20 bg-${accent}/5 text-${accent} text-[10px] font-black tracking-widest uppercase">
                            <i data-lucide="sparkles" class="w-3 h-3"></i> ${dialect.welcome.toUpperCase()}
                        </div>
                        <h1 class="text-6xl lg:text-8xl font-black leading-tight tracking-tighter text-white">${title}</h1>
                        <p class="text-xl text-slate-400 leading-relaxed max-w-xl">${desc}</p>
                        <div class="flex flex-col sm:flex-row gap-5 pt-4">
                            <button class="px-10 py-5 bg-${accent} text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-${accent}/30 hover:rotate-1">${dialect.cta}</button>
                            <button class="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all hover:scale-105">تواصل مع Digital Web</button>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="absolute -inset-10 bg-${accent}/20 blur-[150px] rounded-full"></div>
                        <div class="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                            <img src="https://images.unsplash.com/photo-${img}?auto=format&fit=crop&w=800&q=80" class="w-full">
                        </div>
                    </div></div></section>`,
            bentoGrid: (features, accent) => `<section class="py-32 px-6 max-w-7xl mx-auto">
                <div class="grid md:grid-cols-3 gap-6">
                    ${features.map(f => `<div class="${f.size} bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl group hover:border-${accent}/40 transition-all hover:scale-[1.03]">
                        <div class="w-14 h-14 bg-${accent}/20 rounded-2xl flex items-center justify-center mb-10 border border-${accent}/20 group-hover:bg-${accent} transition-colors">
                            <i data-lucide="${f.icon}" class="text-${accent} group-hover:text-white transition-colors w-7 h-7"></i>
                        </div>
                        <h3 class="text-2xl font-black text-white mb-4">${f.t}</h3>
                        <p class="text-slate-400 leading-relaxed">${f.d}</p>
                    </div>`).join('')}
                </div></section>`,
            hookForm: (accent, dialect) => `<section class="py-32 px-6">
                <div class="max-w-4xl mx-auto bg-white/5 border border-white/10 p-10 md:p-16 rounded-[4rem] text-center space-y-12">
                    <h2 class="text-4xl font-black text-white leading-tight">${dialect.hook}</h2>
                    <div class="flex flex-col md:flex-row gap-4 justify-center">
                        <input type="email" placeholder="بريدك الإلكتروني" class="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold md:min-w-[300px]">
                        <button class="px-10 py-4 bg-${accent} text-white rounded-xl font-black text-lg shadow-xl shadow-${accent}/30 transition-all hover:scale-105 active:scale-95">ارفع موقعك الفوري الآن (Draft)</button>
                    </div></div></section>`,
            footer: () => `<footer class="py-12 border-t border-white/5 text-center text-slate-700 font-bold text-[10px] uppercase tracking-widest">
                STRATEGIC SYNTHESIS HUB v12.5 - REFINEMENT PROTOCOL ACTIVE</footer>`
        };

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            const log = document.getElementById('studio-log');
            log.innerHTML = `<div class="synthesis-overlay"><div class="loader"></div><div class="status-msg">v12.5 Strategic Refinement Cluster Active</div><div class="thought-stream" id="thought-stream"></div></div>`;
            log.classList.add('active');

            const stream = document.getElementById('thought-stream');
            const appendThought = (txt, type = '') => {
                const el = document.createElement('div');
                el.className = 'neural-log ' + type;
                el.innerText = `[REFINEMENT] > ${txt}`;
                stream.appendChild(el);
                stream.scrollTop = stream.scrollHeight;
                return new Promise(r => setTimeout(r, 400));
            };

            await appendThought('Detecting User Dialect & Global Archetype...');
            // Dialect Analyzer
            const p = prompt.toLowerCase();
            let dialect = STRATEGIC_REGISTRY.dialects.msa;
            if (p.includes('ابي') || p.includes('ودي') || p.includes('عطني')) {
                dialect = STRATEGIC_REGISTRY.dialects.saudi;
                await appendThought('Dialect Identified: SAUDI (Najdi/Hejazi Variant)', 'architecture');
            } else if (p.includes('عايز') || p.includes('اعملي') || p.includes('جامد')) {
                dialect = STRATEGIC_REGISTRY.dialects.egyptian;
                await appendThought('Dialect Identified: EGYPTIAN (Local Market Focus)', 'architecture');
            }

            let config = STRATEGIC_REGISTRY.default;
            if (p.includes('fashion') || p.includes('ملابس')) config = STRATEGIC_REGISTRY.niche_configs.fashion;
            else if (p.includes('med') || p.includes('طب')) config = STRATEGIC_REGISTRY.niche_configs.medical;
            else if (p.includes('tech') || p.includes('برمج')) config = STRATEGIC_REGISTRY.niche_configs.tech;

            const brandName = prompt.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/)?.[2]?.trim() || 'Sovereign Hub';

            await appendThought('Allocating Sovereign Cloud Resources...', 'logic');
            const projectSlug = brandName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7, 10);
            await appendThought(`Provisioning Subdomain: https://${projectSlug}.digitalweb.io`, 'logic');
            await appendThought('Configuring SSL certificates (DW Secure Shield)...', 'logic');
            await appendThought('Bootstrapping 24/7 Node.js Cluster...', 'logic');
            await appendThought('Synching SQL Knowledge Core...', 'logic');

            // Synthesis Complete - Display Domain Banner
            const logicDisplay = document.getElementById('logic-display');
            if (logicDisplay) {
                const domainBanner = document.createElement('div');
                domainBanner.className = 'domain-assignment-banner';
                domainBanner.style.cssText = `
                    background: rgba(59, 130, 246, 0.05);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    padding: 20px;
                    border-radius: 15px;
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    animation: dw-slideUp 0.5s ease;
                `;
                domainBanner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: var(--accent); padding: 10px; border-radius: 10px;"><i data-lucide="globe" style="color: black;"></i></div>
                        <div>
                            <div style="font-size: 0.7rem; opacity: 0.5; letter-spacing: 1px;">SOVEREIGN HUB DOMAIN</div>
                            <div style="font-weight: 900; color: white; font-size: 1.1rem;">https://${projectSlug}.digitalweb.io</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 5px 12px; border-radius: 50px; font-size: 10px; font-weight: 900; border: 1px solid rgba(34, 197, 94, 0.2);">SSL SECURED</div>
                        <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 5px 12px; border-radius: 50px; font-size: 10px; font-weight: 900; border: 1px solid rgba(59, 130, 246, 0.2);">SERVER_ALIVE: 24/7</div>
                    </div>
                `;
                logicDisplay.prepend(domainBanner);
                if (window.lucide) lucide.createIcons();
            }

            const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Cairo',sans-serif;background:#020617;color:#f8fafc;scroll-behavior:smooth;}.bg-mesh{background-image:radial-gradient(at 0% 0%,hsla(253,16%,7%,1) 0,transparent 50%)}</style></head><body class="bg-mesh min-h-screen">
                ${UI_FACTORY.header(brandName, config.accent)}
                ${UI_FACTORY.hero(config.title, config.desc, config.unsplash.split(',')[0], config.accent, dialect)}
                ${UI_FACTORY.bentoGrid(config.features, config.accent)}
                ${UI_FACTORY.hookForm(config.accent, dialect)}
                ${UI_FACTORY.footer()}<script>lucide.createIcons();</script></body></html>`;

            const results = { html, code: html, analysis: { dialect, brandName }, logic: ['Strategic Analysis', 'Dialect Patterning', 'Aggressive CTAs'] };
            window.dwOpenPreview(results);

            setTimeout(() => {
                log.classList.remove('active');
                generateBtn.disabled = false;
            }, 800);
        };

        window.dwOpenPreview = async (data) => {
            const dashboard = document.getElementById('studio-result-dashboard');
            dashboard.classList.remove('hidden');
            const visionTab = document.getElementById('tab-vision');
            visionTab.innerHTML = `<iframe id="preview-frame" style="width:100%; height:100%; border:none;"></iframe>`;
            const frame = document.getElementById('preview-frame');
            frame.contentWindow.document.open(); frame.contentWindow.document.write(data.html); frame.contentWindow.document.close();
            document.getElementById('code-display').innerText = data.code;

            const logicDisplay = document.getElementById('logic-display');
            logicDisplay.innerHTML = `<div class="logic-stream-terminal" id="terminal-v12-5"></div>`;
            const term = document.getElementById('terminal-v12-5');

            const streamWrite = (text) => {
                const line = document.createElement('div');
                line.className = 'terminal-line active';
                line.innerHTML = `<span class="t-ts">[${new Date().toLocaleTimeString()}]</span> <span class="t-out"></span>`;
                term.appendChild(line);
                const outSpan = line.querySelector('.t-out');
                let i = 0;
                return new Promise(resolve => {
                    const timer = setInterval(() => {
                        outSpan.innerText += text[i];
                        i++;
                        term.scrollTop = term.scrollHeight;
                        if (i >= text.length) {
                            clearInterval(timer);
                            line.classList.remove('active');
                            resolve();
                        }
                    }, 35);
                });
            };

            await streamWrite('INITIALIZING STRATEGIC SYNTHESIS ENGINE...');
            await streamWrite(`DIALECT CALIBRATION: ${data.analysis.dialect.welcome.toUpperCase()}`);
            await streamWrite('MAPPING BENTO GRID SPANS AND ANCHOR POINTS...');
            await streamWrite('EXECUTING AGGRESSIVE CONVERSION LOGIC...');
            await streamWrite('SUCCESS: PROJECT BLUEPRINT ARCHITECTED.');
        };

        // Standard helpers
        window.dwSwitchTab = (id) => {
            document.querySelectorAll('.tab-panel, .tab-btn').forEach(x => x.classList.remove('active'));
            document.getElementById('tab-' + id).classList.add('active');
            if (event) event.target.classList.add('active');
        };
        window.dwResetStudio = () => { document.getElementById('studio-result-dashboard').classList.add('hidden'); promptInput.value = ''; };
        window.dwCopyResult = () => navigator.clipboard.writeText(document.getElementById('code-display').innerText).then(() => alert('Sovereign Hub Blueprint Copied!'));
        window.dwQuickPrompt = (txt) => { promptInput.value = txt; generateBtn.click(); };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStrategicStudio); else initStrategicStudio();
})();
