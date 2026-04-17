// Digital Web - Neural Architect v8: The Sovereign Creator
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        // 1. SMART ASSET HUB (REAL UNSPLASH IDs)
        const ASSET_HUB = {
            luxury: {
                hero: '1613490493576', 
                gallery: ['1600585154340', '1610940882707', '1613490493576', '1512917774080'],
                accent: '#fbbf24'
            },
            tech: {
                hero: '1518770660219',
                gallery: ['1526374965328', '1451187580459', '1581091226835', '1633356122544'],
                accent: '#00f0ff'
            },
            gym: {
                hero: '1534438327276',
                gallery: ['1540497077202', '1583454117712', '1571019613576', '1574680094897'],
                accent: '#ef4444'
            },
            coffee: {
                hero: '1495474472287',
                gallery: ['1447933601406', '1509042239035', '1459756260017', '1507133351234'],
                accent: '#78350f'
            }
        };

        // 2. MODULAR COMPONENT LIBRARY
        const UI = {
            nav: (name, color) => `<nav style="padding:1.5rem 5%; display:flex; justify-content:space-between; align-items:center; position:fixed; width:100%; top:0; z-index:1000; background:rgba(0,0,0,0.8); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="font-weight:900; font-size:1.5rem; color:${color};">${name.toUpperCase()}</div>
                <div style="display:flex; gap:30px; font-weight:700; font-size:0.8rem;"><span>SOLUTIONS</span><span>CRAFT</span><span>REACH</span></div>
            </nav>`,
            hero: (name, desc, img, color) => `<section style="height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; position:relative; overflow:hidden; padding:0 10%;">
                <div style="position:absolute; inset:0; background:linear-gradient(rgba(0,0,0,0.7), transparent), url('https://images.unsplash.com/photo-${img}?auto=format&fit=crop&w=1600&q=80') center/cover; z-index:-1;"></div>
                <div class="reveal">
                    <h1 style="font-size:min(8rem, 15vw); font-weight:900; line-height:0.9; margin:0; letter-spacing:-4px; color:#fff;">${name}</h1>
                    <p style="font-size:1.5rem; opacity:0.8; margin:30px auto; max-width:700px; color:${color};">${desc.toUpperCase()}</p>
                    <button style="background:${color}; color:#fff; border:none; padding:20px 60px; border-radius:100px; font-weight:900; cursor:pointer; font-size:1rem;">EXPERIENCE DEEP SYNTHESIS</button>
                </div>
            </section>`,
            stats: (color) => `<section style="padding:100px 10%; background:#080808; display:grid; grid-template-columns:repeat(4, 1fr); gap:40px; text-align:center; border-top:1px solid rgba(255,255,255,0.05);">
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
                    ${[1,2,3].map(i => `<div style="padding:40px; background:rgba(255,255,255,0.02); border-radius:24px; border:1px solid rgba(255,255,255,0.05);">
                        <div style="font-weight:900; font-size:1.5rem;">TIER 0${i}</div>
                        <div style="font-size:3rem; color:${color}; margin:20px 0;">$${i*99}</div>
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

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Synthesizing Sovereign...';
            
            const log = document.getElementById('studio-log');
            log.innerHTML = `<div class="synthesis-overlay">
                <div class="loader"></div>
                <div class="status-msg">NEURAL SYNTHESIS IN PROGRESS...</div>
            </div>`;
            log.classList.add('active');

            const analysis = await analyzeIntent(prompt);
            
            // Artificial delay for "effort" feel
            const stages = ['Initializing Assembly', 'Sourcing Sovereign Assets', 'Building Layout Architecture', 'Optimizing Neural Paths'];
            for(let s of stages) {
                log.querySelector('.status-msg').innerText = s + '...';
                await new Promise(r => setTimeout(r, 800));
            }

            let result;
            if (analysis.target === 'WEB') {
                const data = ASSET_HUB[analysis.niche];
                const html = `<!DOCTYPE html><html><body style="margin:0; background:#000; color:#fff; font-family:sans-serif;">
                    ${UI.nav(analysis.name, data.accent)}
                    ${UI.hero(analysis.name, analysis.prompt, data.hero, data.accent)}
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

            if (window.dwOpenPreview) window.dwOpenPreview(result);
            generateBtn.innerText = 'Generate Trial';
            generateBtn.disabled = false;
        };

        function generatePolyglotProject(analysis) {
            const tree = `
/Project-Core
  /src
    - main.py (Entry Point)
    - utils.py (Neural Helpers)
    - config.env (System Settings)
  /tests
    - unit_test.py
  - README.md
  - package.json`;

            const code = `// SOVEREIGN PROJECT TREE GENERATED FOR: ${analysis.prompt}\n${tree}\n\n// main.py\nprint("Neural Hub Active")\n# All Programming Concepts Integrated.`;
            
            const html = `<!DOCTYPE html><html><body style="background:#080808; color:#10b981; font-family:monospace; padding:40px;">
                <h1 style="color:#fff;">Polyglot Project Structure</h1>
                <pre style="font-size:1.2rem; line-height:1.5; color:#32d74b;">${code}</pre>
            </body></html>`;
            
            return { html, css: '', js: '', rawCode: code };
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStudio);
    else initStudio();
})();
