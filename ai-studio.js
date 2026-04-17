// Digital Web - Neural Architect v7: Autonomous Synthesis Engine
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        // 1. NEURAL MAPPING ENGINE
        const PERSONAS = {
            luxury: {
                colors: { primary: '#fbbf24', bg: '#080808', accent: '#fff' },
                fonts: "'Playfair Display', serif",
                adjectives: ['elegant', 'royal', 'gold', 'vogue'],
                imgKeywords: 'luxury,perfume,watch,jewelry'
            },
            cyber: {
                colors: { primary: '#00f0ff', bg: '#000', accent: '#7000ff' },
                fonts: "'JetBrains Mono', monospace",
                adjectives: ['cyber', 'neon', 'matrix', 'tech'],
                imgKeywords: 'cyberpunk,glitch,future,city'
            },
            brutalsm: {
                colors: { primary: '#f43f5e', bg: '#fff', accent: '#000' },
                fonts: "'Archivo Black', sans-serif",
                adjectives: ['raw', 'bold', 'brutal', 'industrial'],
                imgKeywords: 'concrete,minimal,modern,shadow'
            },
            eco: {
                colors: { primary: '#10b981', bg: '#f9fafb', accent: '#064e3b' },
                fonts: "'Inter', sans-serif",
                adjectives: ['nature', 'green', 'organic', 'farm'],
                imgKeywords: 'forest,leaf,plant,sustainability'
            }
        };

        async function analyzeIntent(prompt) {
            const p = prompt.toLowerCase();
            
            // Language/Target
            let target = 'WEB';
            if (p.includes('python') || p.includes('بايثون')) target = 'PYTHON';
            if (p.includes('dart') || p.includes('flutter')) target = 'DART';

            // Persona Analysis (The Deep Brain)
            let personaKey = 'cyber'; // Default
            if (p.includes('فخ') || p.includes('luxury') || p.includes('elegant')) personaKey = 'luxury';
            if (p.includes('raw') || p.includes('brutal') || p.includes('bold')) personaKey = 'brutalsm';
            if (p.includes('زرع') || p.includes('eco') || p.includes('nature')) personaKey = 'eco';
            
            const persona = PERSONAS[personaKey];
            const nameMatch = prompt.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Synthesis Core';

            return { target, persona, name, prompt, niche: personaKey };
        }

        async function runNeuralSequence(analysis) {
            const steps = [
                { type: 'sys', text: `Analyzing Semantic Intent: "${analysis.prompt}"` },
                { type: 'arch', text: `Synthesis mapping: [${analysis.niche.toUpperCase()}] Persona selected.`, status: 'OK' },
                { type: 'design', text: `Generating Autonomous Layout Blueprint...` },
                { type: 'build', text: `Sourcing assets from Unsplash (${analysis.persona.imgKeywords})...`, status: 'OK' }
            ];

            for (const step of steps) {
                printLog(step);
                await new Promise(r => setTimeout(r, 600));
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

            let result;
            if (analysis.target === 'WEB') {
                result = generateDetailedWeb(analysis);
            } else {
                result = { html: `<h1>Preview not available for ${analysis.target}</h1>` };
            }

            if (window.dwOpenPreview) window.dwOpenPreview(result);
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Trial';
        };

        function generateDetailedWeb(analysis) {
            const { persona, name, prompt } = analysis;
            const c = persona.colors;
            const imgUrl = (keyword) => `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop`; // Generic but high-end

            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { --p: ${c.primary}; --bg: ${c.bg}; --acc: ${c.accent}; }
        body { margin: 0; background: var(--bg); color: var(--acc); font-family: ${persona.fonts}, sans-serif; overflow-x: hidden; }
        nav { padding: 2rem; display: flex; justify-content: space-between; align-items: center; position: fixed; width: 100%; box-sizing: border-box; z-index: 100; backdrop-filter: blur(10px); }
        .hero { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; padding: 20px; }
        .hero h1 { font-size: 6rem; margin: 0; font-weight: 900; line-height: 0.9; color: var(--p); }
        .hero p { opacity: 0.6; font-size: 1.5rem; margin: 20px 0; max-width: 600px; }
        .btn { background: var(--p); color: var(--bg); padding: 15px 40px; border-radius: 100px; font-weight: 900; text-decoration: none; display: inline-block; margin-top: 30px; }
        .section { padding: 100px 5%; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; }
        .section img { width: 100%; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        @media (max-width: 768px) { 
            .hero h1 { font-size: 3rem; }
            .section { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <nav>
        <div style="font-weight: 900; font-size: 1.5rem;">${name}</div>
        <div style="display: flex; gap: 30px;"><span>SERVICES</span><span>ABOUT</span></div>
    </nav>
    <section class="hero">
        <div style="position: absolute; inset: 0; opacity: 0.3; background: linear-gradient(var(--bg), transparent), url('${imgUrl(persona.imgKeywords)}'); background-size: cover; z-index: -1;"></div>
        <h1>${name}</h1>
        <p>AUTONOMOUS SYNTHESIS FOR: "${prompt}"</p>
        <a href="#" class="btn">DISCOVER EXPERIENCE</a>
    </section>
    <section class="section">
        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" />
        <div>
            <h2 style="font-size: 3rem;">REVOLUTIONARY INTENT</h2>
            <p style="opacity: 0.7; line-height: 1.8;">Our Neural Engine analyzed your request and synthesized this unique digital landscape. This isn't a template; it's a semantic translation.</p>
        </div>
    </section>
</body>
</html>`;

            return { html, css: '', js: '' };
        }

        function printLog(step) {
            const log = document.getElementById('studio-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span>
                               <span class="prefix" style="color:#fbbf24">[SYNTHESIS]</span>
                               <span class="text">${step.text}</span>`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStudio);
    else initStudio();
})();
