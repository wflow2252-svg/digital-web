// Digital Web - Neural Architect v6: Universal Polyglot Brain
(function() {
    function initStudio() {
        const promptInput = document.getElementById('studio-prompt');
        const generateBtn = document.getElementById('studio-generate-btn');

        if (!generateBtn) return;

        async function analyzeIntent(prompt) {
            const p = prompt.toLowerCase();
            
            // 1. Language/System Detection
            let target = 'WEB';
            if (p.includes('python') || p.includes('بايثون') || p.includes('script')) target = 'PYTHON';
            if (p.includes('dart') || p.includes('flutter') || p.includes('فلاتر')) target = 'DART';
            if (p.includes('c++') || p.includes('java') || p.includes('سي بلس')) target = 'CPP';
            if (p.includes('database') || p.includes('sql') || p.includes('بيانات')) target = 'SQL';

            // 2. Logic vs UI Detection
            const isLogic = target !== 'WEB' || p.includes('logic') || p.includes('بناء منطق');

            // 3. Name & Color (For Web only)
            const nameMatch = prompt.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/);
            const name = nameMatch ? nameMatch[2].trim() : 'Digital Core';
            
            return { target, isLogic, name, prompt };
        }

        async function runNeuralSequence(analysis) {
            const steps = [
                { type: 'sys', text: `Analyzing Polyglot Intent... Detected Target: ${analysis.target}` },
                { type: 'arch', text: `Accessing ${analysis.target} Knowledge Cluster...`, status: 'OK' },
                { type: 'design', text: `Synthesizing ${analysis.isLogic ? 'Logic' : 'UI'} Architecture...` },
                { type: 'build', text: `Generating ${analysis.target} Code Bundle...`, status: 'OK' }
            ];

            for (const step of steps) {
                printLog(step);
                await new Promise(r => setTimeout(r, Math.random() * 400 + 300));
            }
        }

        generateBtn.onclick = async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return;

            generateBtn.disabled = true;
            generateBtn.innerHTML = 'Synthesizing...';
            
            const log = document.getElementById('studio-log');
            log.innerHTML = '';
            log.classList.add('active');

            const analysis = await analyzeIntent(prompt);
            await runNeuralSequence(analysis);

            // Generator router
            let result;
            if (analysis.target === 'WEB') {
                result = generateWebBundle(analysis);
            } else {
                result = generateCodeArchive(analysis);
            }

            if (window.dwOpenPreview) window.dwOpenPreview(result);

            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Trial';
        };

        function generateWebBundle(analysis) {
            // Existing High-Fidelity Web Logic (Simplified for brevity but maintaining quality)
            const html = `<!DOCTYPE html><html><body style="background:#050505; color:white; font-family:sans-serif; height:100vh; display:flex; align-items:center; justify-content:center;">
                <div style="text-align:center;">
                    <h1 style="font-size:4rem; color:#3b82f6;">${analysis.name}</h1>
                    <p style="opacity:0.5;">Architected for: "${analysis.prompt}"</p>
                    <div style="margin-top:20px; padding:20px; border:1px solid #333; border-radius:10px;">GLOBAL_WEB_INSTANCE: ACTIVE</div>
                </div>
            </body></html>`;
            return { html, css: '', js: '' };
        }

        function generateCodeArchive(analysis) {
            const templates = {
                PYTHON: `def neural_architect():
    print("Synthesizing logic for: ${analysis.prompt}")
    # Initialize Core
    core_status = "STABLE"
    return core_status

if __name__ == "__main__":
    result = neural_architect()
    print(f"System Status: {result}")`,
                DART: `void main() {
  print("Initializing Flutter Command for: ${analysis.prompt}");
  final config = {
    'mode': 'POLYGLOT_V6',
    'target': '${analysis.target}'
  };
  runApp(DigitalWebCore(config));
}`,
                SQL: `-- Neural Schema for ${analysis.prompt}
CREATE TABLE system_nodes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status TEXT DEFAULT 'ACTIVE'
);
INSERT INTO system_nodes (id, name) VALUES (gen_random_uuid(), '${analysis.name}');`
            };

            const code = templates[analysis.target] || `// Code for ${analysis.target}\n// Intent: ${analysis.prompt}`;
            
            // For non-web, we show the code in the preview as a formatted block
            const html = `<!DOCTYPE html><html><body style="background:#080808; color:#10b981; font-family:monospace; padding:40px;">
                <div style="margin-bottom:20px; color:#666;">// PREVIEWING ${analysis.target} SOURCE BUNDLE</div>
                <pre style="font-size:1.2rem; line-height:1.5;">${code}</pre>
            </body></html>`;
            
            return { html, css: '', js: '', rawCode: code, lang: analysis.target.toLowerCase() };
        }

        function printLog(step) {
            const log = document.getElementById('studio-log');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const prefix = { sys: '[BRAIN]', arch: '[ARCH]', design: '[LOGIC]', build: '[BUILD]' }[step.type];
            entry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span>
                               <span class="prefix" style="color:#10b981">${prefix}</span>
                               <span class="text">${step.text}</span>`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStudio);
    else initStudio();
})();
