// Digital Web - AI Studio Innovation Lab
(function() {
    const promptInput = document.getElementById('studio-prompt');
    const generateBtn = document.getElementById('studio-generate-btn');

    if (!generateBtn) return;

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

        // Start Sequence
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
            { type: 'sys', text: 'Initializing Neural Engine v4.2...' },
            { type: 'sys', text: 'Analyzing prompt context for: ' + prompt.substring(0, 20) + '...' },
            { type: 'arch', text: 'Designing semantic HTML5 structures...' },
            { type: 'design', text: 'Calculating fluid typography scales...' },
            { type: 'design', text: 'Drafting design tokens (Colors, Spacing)...' },
            { type: 'build', text: 'Writing index.html', status: 'OK' },
            { type: 'build', text: 'Writing styles.css', status: 'OK' },
            { type: 'sys', text: 'Optimizing render pipeline...' },
            { type: 'sys', text: 'Ready for final preview.' }
        ];

        for (const step of steps) {
            printLog(step);
            await new Promise(r => setTimeout(r, Math.random() * 400 + 400));
        }
    }

    function printLog(step) {
        const log = document.getElementById('studio-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const prefix = {
            sys: '[SYSTEM]',
            arch: '[ARCHITECT]',
            design: '[DESIGNER]',
            build: '[BUILDER]'
        }[step.type];

        entry.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span class="prefix">${prefix}</span>
            <span class="text">${step.text}</span>
            ${step.status ? `<span class="status-ok">[${step.status}]</span>` : ''}
        `;
        
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    function generateTrialWebsite(prompt) {
        const input = prompt.toLowerCase();
        
        // Deep Extraction
        const nameMatch = prompt.match(/(لـ|اسم|لشركة) ([\w\s\u0600-\u06FF]+)/);
        const name = nameMatch ? nameMatch[2].trim() : 'Digital Innovation';
        
        // Color Mapping
        let color = '#3b82f6'; // Default Elite Blue
        if (input.includes('أحمر') || input.includes('red')) color = '#ef4444';
        if (input.includes('أخضر') || input.includes('green')) color = '#10b981';
        if (input.includes('ذهب') || input.includes('gold')) color = '#fbbf24';
        if (input.includes('بنفسجي') || input.includes('purple')) color = '#8b5cf6';

        // Modern Template Selection
        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | AI Generated</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { --primary: ${color}; --bg: #050505; }
        body { margin: 0; font-family: 'Cairo', sans-serif; background: var(--bg); color: white; overflow-x: hidden; }
        header { 
            height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            text-align: center;
            background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%);
            position: relative;
        }
        .glass-card {
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 40px;
            max-width: 600px;
        }
        h1 { font-size: 4rem; font-weight: 900; margin: 0; line-height: 1; }
        p { color: rgba(255,255,255,0.5); font-size: 1.2rem; margin: 20px 0 40px; }
        .btn {
            background: var(--primary);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 100px;
            font-weight: 800;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: 0.3s;
        }
        .btn:hover { transform: scale(1.05); }
    </style>
</head>
<body>
    <header>
        <div class="glass-card">
            <h1>${name}</h1>
            <p>مرحباً بك في المستقبل الرقمي. تم تصميم هذه النسخة التجريبية بواسطة الذكاء الاصطناعي لـ Digital Web.</p>
            <a href="#" class="btn">اكتشف المزيد</a>
        </div>
    </header>
</body>
</html>`;
    }

    // Add CSS for spinning icon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: dw-spin 2s linear infinite; }
    `;
    document.head.appendChild(style);
})();
