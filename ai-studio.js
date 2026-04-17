// Digital Web - AI Innovation Lab v8.2
// Agentic Neural Synthesis Engine (GPT-Tier)

(function () {
    const ASSET_HUB = {
        tech: { accent: '#00f0ff', hero: '1451184422501-5bd39206adca', gallery: ['1518770660439-4636190af475', '1461749280684-dccba63012f6'] },
        luxury: { accent: '#d4af37', hero: '1519681393784-d120267933ba', gallery: ['1544441893-675973e3a985', '1505740420928-5e560c06d30e'] },
        gym: { accent: '#ff3131', hero: '15344383272d6-075e18f28580', gallery: ['1517836357463-d25dfeac3438', '1571019614242-c5c5dee9f50b'] },
        coffee: { accent: '#6f4e37', hero: '1495474472287-4d71bcdd2085', gallery: ['1447933631397-605be582d5da', '1509042239860-f550ce710b93'] }
    };

    function initStudio() {
        const generateBtn = document.getElementById('dw-studio-generate');
        const promptInput = document.getElementById('dw-studio-prompt');
        if (!generateBtn || !promptInput) return;

        // 1. NEURAL DECISION AGENT
        async function analyzeIntent(prompt) {
            const p = prompt.toLowerCase();
            let niche = 'tech';
            if (p.includes('lux') || p.includes('فخ')) niche = 'luxury';
            if (p.includes('gym') || p.includes('رياضة')) niche = 'gym';
            if (p.includes('coffee') || p.includes('قهوة')) niche = 'coffee';

            const nameMatch = prompt.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Synthesis Core';

            return { niche, name, prompt, target: p.includes('prog') ? 'POLYGLOT' : 'WEB' };
        }

        // 2. MODULAR COMPONENT LIBRARY (4C FLOW)
        const UI = {
            nav: (name, color) => `<nav style="padding:1rem 5%; display:flex; justify-content:space-between; align-items:center; position:fixed; width:100%; top:0; z-index:1000; background:rgba(0,0,0,0.8); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="logo.png" style="height:35px; width:auto;" alt="logo">
                    <div style="font-weight:900; font-size:1.2rem; color:${color}; letter-spacing:1px;">${name.toUpperCase()}</div>
                </div>
                <div style="display:flex; gap:30px; font-weight:700; font-size:0.8rem;"><span>SOLUTIONS</span><span>CRAFT</span><span>REACH</span></div>
            </nav>`,
            hero: (name, desc, img, color) => `<section style="height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; position:relative; overflow:hidden; padding:0 10%;">
                <div style="position:absolute; inset:0; background:linear-gradient(rgba(0,0,0,0.7), transparent), url('https://images.unsplash.com/photo-${img}?auto=format&fit=crop&w=1600&q=80') center/cover; z-index:-1;"></div>
                <div class="reveal">
                    <div style="color:${color}; font-weight:800; font-size:0.9rem; letter-spacing:2px; margin-bottom:20px; text-transform:uppercase;">Agentic Pioneer v8.2</div>
                    <h1 style="font-size:min(8rem, 15vw); font-weight:900; line-height:0.9; margin:0; letter-spacing:-4px; color:#fff;">${name}</h1>
                    <p style="font-size:1.5rem; opacity:0.8; margin:30px auto; max-width:700px; color:${color};">${desc.toUpperCase()}</p>
                    <button style="background:${color}; color:#fff; border:none; padding:20px 60px; border-radius:100px; font-weight:900; cursor:pointer; font-size:1rem; transition:0.3s; box-shadow:0 10px 30px ${color}44;">EXPERIENCE DEEP SYNTHESIS</button>
                </div>
            </section>`,
            workflow: (color) => `<section style="padding:120px 10%; background:#050505;">
                <h2 style="font-size:3rem; font-weight:900; text-align:center; margin-bottom:80px;">THE TRANSFORMATION</h2>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:40px;">
                    ${['ANALYZE', 'SYNTHESIZE', 'SCALE'].map((step, i) => `
                        <div style="padding:40px; background:rgba(255,255,255,0.02); border-radius:24px; border:1px solid rgba(255,255,255,0.05);">
                            <div style="font-size:0.8rem; color:${color}; font-weight:800; margin-bottom:15px;">STEP 0${i+1}</div>
                            <h3 style="font-size:1.8rem; font-weight:900; margin:0;">${step}</h3>
                            <p style="opacity:0.5; margin-top:15px; font-size:0.9rem; line-height:1.6;">Automated neural mapping of your industry vertical for optimized reach.</p>
                        </div>
                    `).join('')}
                </div>
            </section>`,
            trust: () => `<section style="padding:60px 10%; background:#080808; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; justify-content:space-around; align-items:center; opacity:0.3; filter:grayscale(1);">
                    <div style="font-weight:900;">[ SOC-2 COMPLIANT ]</div>
                    <div style="font-weight:900;">[ ENTERPRISE SECURE ]</div>
                    <div style="font-weight:900;">[ ISO 27001 ]</div>
                    <div style="font-weight:900;">[ GDPR READY ]</div>
                </div>
            </section>`,
            stats: (color) => `<section style="padding:100px 10%; background:#080808; display:grid; grid-template-columns:repeat(4, 1fr); gap:40px; text-align:center;">
                <div><h3 style="font-size:3rem; margin:0; color:${color};">24ms</h3><p style="opacity:0.5; font-size:0.8rem;">LATENCY</p></div>
                <div><h3 style="font-size:3rem; margin:0; color:${color};">99%</h3><p style="opacity:0.5; font-size:0.8rem;">UPTIME</p></div>
                <div><h3 style="font-size:3rem; margin:0; color:${color};">+400</h3><p style="opacity:0.5; font-size:0.8rem;">NODES</p></div>
                <div><h3 style="font-size:3rem; margin:0; color:${color};">LIVE</h3><p style="opacity:0.5; font-size:0.8rem;">SOVEREIGN</p></div>
            </section>`,
            gallery: (imgs) => `<section style="padding:100px 5%; background:#000;">
                <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:20px;">
                    ${imgs.map(id => `<img src="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80" style="width:100%; border-radius:20px; aspect-ratio:16/9; object-fit:cover;" />`).join('')}
                </div>
            </section>`,
            pricing: (color) => `<section style="padding:100px 10%; background:#050505; text-align:center;">
                <h2 style="font-size:3rem; font-weight:900; margin-bottom:60px;">TIERS OF CONTROL</h2>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:30px;">
                    ${[1, 2, 3].map(i => `<div style="padding:40px; background:rgba(255,255,255,0.02); border-radius:24px; border:1px solid rgba(255,255,255,0.05);">
                        <div style="font-weight:900; font-size:1.5rem;">TIER 0${i}</div>
                        <div style="font-size:3rem; color:${color}; margin:20px 0;">$${i * 99}</div>
                        <ul style="list-style:none; padding:0; opacity:0.6; font-size:0.9rem; line-height:2.5;">
                            <li>Full Neural Control</li><li>24/7 Command Support</li><li>Ultra Latency Optimization</li>
                        </ul>
                    </div>`).join('')}
                </div>
            </section>`,
            footer: (name) => `<footer style="padding:100px 0; background:#000; text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
                <div style="font-weight:900; font-size:2rem; opacity:0.1;">${name}</div>
                <p style="opacity:0.3; margin-top:20px;">Digital Web Sovereignty &copy; 2026</p>
            </footer>`
        };

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Synthesizing...';

            const log = document.getElementById('studio-log');
            log.innerHTML = `<div class="synthesis-overlay">
                <div class="loader"></div>
                <div class="status-msg">Neural Agent Active</div>
                <div class="thought-stream" id="thought-stream"></div>
            </div>`;
            log.classList.add('active');

            const stream = document.getElementById('thought-stream');
            const appendThought = (txt, type = '') => {
                const el = document.createElement('div');
                el.className = 'neural-log ' + type;
                el.innerText = `[LOG] > ${txt}`;
                stream.appendChild(el);
                stream.scrollTop = stream.scrollHeight;
                return new Promise(r => setTimeout(r, 600));
            };

            await appendThought('Initializing Neural Intent Analysis...');
            const analysis = await analyzeIntent(prompt);
            await appendThought(`Niche identified: ${analysis.niche.toUpperCase()}`, 'architecture');
            await appendThought('Querying industry benchmarks via Digital Hub...', 'research');
            await appendThought('Building 4C strategic layout (Clarity, Comprehension, Credibility, Conversion)...', 'architecture');
            await appendThought('Injecting Trust Matrix and ROI components...');

            let result;
            if (analysis.target === 'WEB') {
                const data = ASSET_HUB[analysis.niche];
                const designTokens = `
                    :root {
                        --bg: #030303;
                        --surface: #0a0a0f;
                        --accent: ${data.accent};
                        --accent-glow: ${data.accent}33;
                        --text: #ffffff;
                        --text-muted: #88888d;
                    }
                `;

                const html = `<!DOCTYPE html><html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        ${designTokens}
                        body { margin:0; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; overflow-x: hidden; }
                        section { padding: 100px 10%; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); }
                        .glass-card { background: var(--surface); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                        .roadmap-item { display: flex; gap: 20px; margin-bottom: 30px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 12px; }
                        .copy-blueprint-btn { position: fixed; top: 20px; right: 20px; z-index: 10000; background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 50px; font-weight: 800; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <button class="copy-blueprint-btn" onclick="window.parent.dwCopyResult()">COPY BLUEPRINT</button>
                    ${UI.nav(analysis.name, data.accent)}
                    ${UI.hero(analysis.name, analysis.prompt, data.hero, data.accent)}
                    ${UI.trust()}
                    ${UI.workflow(data.accent)}
                    
                    <section class="roadmap">
                        <h2 style="font-size:3rem; font-weight:900; margin-bottom:50px;">STRATEGIC ROADMAP</h2>
                        <div class="roadmap-item">
                            <div style="font-size:2rem; font-weight:900; color:var(--accent)">01</div>
                            <div>
                                <h3 style="margin:0">Infrastructure Synthesis</h3>
                                <p style="opacity:0.6">Deploying the core Sovereign engine and verifying multi-node connectivity.</p>
                            </div>
                        </div>
                        <div class="roadmap-item">
                            <div style="font-size:2rem; font-weight:900; color:var(--accent)">02</div>
                            <div>
                                <h3 style="margin:0">Agentic Scaling</h3>
                                <p style="opacity:0.6">Integrating AI workforce modules for automated growth and support.</p>
                            </div>
                        </div>
                    </section>

                    <section class="insights">
                        <div style="background:linear-gradient(45deg, var(--surface), #111); padding:60px; border-radius:30px; text-align:center;">
                            <h2 style="color:var(--accent)">AI INTELLIGENCE REPORT</h2>
                            <p style="font-size:1.2rem; opacity:0.8; max-width:800px; margin:20px auto;">Based on your prompt, our neural engine predicts a 40% efficiency increase.</p>
                        </div>
                    </section>

                    ${UI.stats(data.accent)}
                    ${UI.gallery(data.gallery)}
                    ${UI.pricing(data.accent)}
                    ${UI.footer(analysis.name)}
                    
                    <script>
                        const obs = new IntersectionObserver(e => e.forEach(entry => { if(entry.isIntersecting) entry.target.style.opacity = 1; }));
                        document.querySelectorAll('section').forEach(s => { s.style.opacity = 0; s.style.transition = '2s'; obs.observe(s); });
                    </script>
                </body></html>`;
                result = { html, css: '', js: '' };
            } else {
                result = generatePolyglotProject(analysis);
            }

            // Expose copy function
            window.dwCopyResult = () => {
                const content = analysis.target === 'WEB' ? result.html : result.rawCode;
                navigator.clipboard.writeText(content).then(() => alert('Blueprint Copied!'));
            };

            if (window.dwOpenPreview) {
                window.dwOpenPreview(result);
            }

            setTimeout(() => {
                log.classList.remove('active');
                generateBtn.innerHTML = 'Synthesize Sovereign';
                generateBtn.disabled = false;
            }, 1000);
        };

        function generatePolyglotProject(analysis) {
            const code = `// SOVEREIGN PROJECT TREE FOR: ${analysis.prompt}\n/Project-Core\n  /src\n  /tests\n\nprint("Neural Hub Active")`;
            const html = `<!DOCTYPE html><html><body style="background:#080808; color:#10b981; padding:40px;"><pre>${code}</pre></body></html>`;
            return { html, css: '', js: '', rawCode: code };
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStudio);
    else initStudio();
})();
