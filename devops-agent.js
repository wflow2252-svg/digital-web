// Digital Web - AI Studio Agent Logic (Sovereign v13.0)
// AI calls go to /api/ai (Vercel serverless proxy) — no token in client code.

const da_domains = [
  { id:'builder', icon:'layout', name:'إنشاء موقع تجريبي', desc:'قم ببناء موقعك مجاناً عبر الذكاء الاصطناعي', color:'#00d4ff' }
];

const da_systemPrompts = {
  builder: `أنت Sovereign AI، خبير تصميم ومبرمج مواقع ويب محترف. مهمتك:
1. قراءة طلب المستخدم بدقة.
2. توليد كود HTML + CSS + JS متكامل في ملف واحد.
3. استخدام Tailwind CSS (CDN) و Lucide Icons.
4. التصميم احترافي، راقي، وجذاب بصرياً — dark mode بشكل افتراضي.
5. أجب باللغة العربية في أي شرح، والكود بالإنجليزية.
6. قدّم الكود الكامل داخل كتلة \`\`\`html ... \`\`\` بدون أي نص زائد.`
};

const da_quickSuggestions = {
  builder: ['موقع لشركة تقنية', 'موقع لمطعم وكافيه', 'موقع لعيادة أسنان', 'متجر إلكتروني للملابس']
};

const da_welcomeCards = [
  { icon:'layout', text:'أريد إنشاء موقع لشركة تقنية ناشئة' },
  { icon:'building', text:'أريد بناء موقع عقاري شامل بخريطة' }
];

let da_currentDomain = 'builder';
let da_chatHistory = [];
let da_isLoading = false;
let da_messageCount = 0;
const MAX_MESSAGES = 4;

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

function initDevopsAgent() {
  const domainList = document.getElementById('da-domainList');
  if (!domainList) return;
  domainList.innerHTML = '';
  da_domains.forEach(d => {
    const el = document.createElement('div');
    el.className = 'da-domain-item active';
    el.dataset.id = d.id;
    el.innerHTML = `<span class="da-d-icon"><i data-lucide="${d.icon}"></i></span><span class="da-d-name">${d.name}</span>`;
    domainList.appendChild(el);
  });
  da_renderWelcomeCards();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  da_renderQuick();

  // Inject Highlight.js for stunning code blocks
  if (!document.getElementById('hljs-theme')) {
    const hljsStyle = document.createElement('link');
    hljsStyle.id = 'hljs-theme';
    hljsStyle.rel = 'stylesheet';
    hljsStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css';
    document.head.appendChild(hljsStyle);
    
    const hljsScript = document.createElement('script');
    hljsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    document.head.appendChild(hljsScript);
  }

  // (Puter.js disabled in favor of robust serverless proxy native logic)
}

function da_renderWelcomeCards() {
  const wg = document.getElementById('da-welcomeGrid');
  if (!wg) return;
  wg.innerHTML = '';
  da_welcomeCards.forEach(c => {
    const el = document.createElement('div');
    el.className = 'da-welcome-card';
    el.innerHTML = `<div class="da-welcome-card-icon"><i data-lucide="${c.icon}"></i></div><div class="da-welcome-card-text">${c.text}</div>`;
    el.onclick = () => { document.getElementById('da-userInput').value = c.text; da_sendMsg(); };
    wg.appendChild(el);
  });
}

function da_renderQuick() {
  const area = document.getElementById('da-quickArea');
  if (!area) return;
  area.innerHTML = (da_quickSuggestions[da_currentDomain] || [])
    .map(q => `<button class="da-quick-pill" onclick="da_sendQuick(this.textContent)">${q}</button>`)
    .join('');
}

function da_sendQuick(text) {
  document.getElementById('da-userInput').value = text;
  da_sendMsg();
}

function da_autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 150) + 'px';
}

function da_handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); da_sendMsg(); }
}

function da_clearChat() {
  da_chatHistory = [];
  da_messageCount = 0;
  const msgs = document.getElementById('da-messages');
  msgs.innerHTML = '';
  const welcome = document.createElement('div');
  welcome.className = 'da-welcome';
  welcome.id = 'da-welcome';
  welcome.innerHTML = `
    <div class="da-welcome-icon"><i data-lucide="wand-2"></i></div>
    <div class="da-welcome-title">AI Studio | مولّد المواقع</div>
    <div class="da-welcome-sub">صف فكرة موقعك وسيبنيه لك الذكاء الاصطناعي كاملاً. رصيدك المجاني: 4 رسائل.</div>
    <div class="da-welcome-grid" id="da-welcomeGrid"></div>`;
  msgs.appendChild(welcome);
  da_renderWelcomeCards();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function da_formatText(text) {
  // Highlight.js formats Code Blocks
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const codeClass = lang ? `class="language-${lang}"` : '';
    return `<pre><code ${codeClass}>${da_escHtml(code.trim())}</code></pre>`;
  });
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${da_escHtml(c)}</code>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\n/g, '<br>');
  return text;
}

function da_escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function da_addMsg(role, text) {
  const msgs = document.getElementById('da-messages');
  const w = document.getElementById('da-welcome');
  if (w) w.remove();

  const row = document.createElement('div');
  row.className = 'da-msg-row ' + role;

  const av = document.createElement('div');
  av.className = 'da-avatar ' + role;
  av.innerHTML = role === 'ai'
    ? '<i data-lucide="bot" style="width:20px;height:20px;"></i>'
    : '<i data-lucide="user" style="width:20px;height:20px;"></i>';

  const col = document.createElement('div');
  col.className = 'da-msg-col';

  const bubble = document.createElement('div');
  bubble.className = 'da-bubble ' + role;
  
  if (role === 'ai') {
    // Elegant fade-in for AI bubbles
    bubble.innerHTML = da_formatText(text);
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(10px) scale(0.98)';
    setTimeout(() => {
      bubble.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0) scale(1)';
      if (window.hljs) {
        bubble.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }
    }, 50);
  } else {
    bubble.innerHTML = da_escHtml(text);
  }

  const meta = document.createElement('div');
  meta.className = 'da-msg-meta';
  meta.textContent = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  col.appendChild(bubble);
  col.appendChild(meta);
  row.appendChild(av);
  row.appendChild(col);
  msgs.appendChild(row);

  if (typeof lucide !== 'undefined') lucide.createIcons({ root: row });
  msgs.scrollTop = msgs.scrollHeight;
  return bubble;
}

function da_showThinking() {
  const msgs = document.getElementById('da-messages');
  const row = document.createElement('div');
  row.className = 'da-thinking-row';
  row.id = 'da-thinking';
  row.innerHTML = `
    <div class="da-avatar ai" style="box-shadow: 0 0 15px rgba(56, 189, 248, 0.5); border-color:#38bdf8;">
      <i data-lucide="cpu" style="width:20px;height:20px; animation: pulse 2s infinite;"></i>
    </div>
    <div class="da-thinking-bubble">
      <div class="da-neural-core">
        <div class="da-neural-bar"></div>
        <div class="da-neural-bar"></div>
        <div class="da-neural-bar"></div>
        <div class="da-neural-bar"></div>
        <div class="da-neural-bar"></div>
      </div>
      <span class="da-thinking-text">NEURAL SYNTHESIS...</span>
    </div>`;
  msgs.appendChild(row);
  if (typeof lucide !== 'undefined') lucide.createIcons({ root: row });
  msgs.scrollTop = msgs.scrollHeight;
}

function da_hideThinking() {
  const t = document.getElementById('da-thinking');
  if (t) t.remove();
}

// ═══════════════════════════════════════════════════════════
// 🧠 MAIN SEND — calls /api/ai (secure proxy, no token here)
// ═══════════════════════════════════════════════════════════
async function da_sendMsg() {
  if (da_isLoading) return;
  const input = document.getElementById('da-userInput');
  const text = input.value.trim();
  if (!text) return;

  if (da_messageCount >= MAX_MESSAGES) {
    da_addMsg('ai', '⛔ عذراً! لقد استنفدت رصيدك التجريبي المجاني (4/4 رسائل). يُرجى التواصل معنا للاشتراك في الخدمة الكاملة.');
    return;
  }

  da_messageCount++;
  input.value = '';
  input.style.height = 'auto';
  da_isLoading = true;
  document.getElementById('da-sendBtn').disabled = true;

  da_addMsg('user', text);
  da_showThinking();

  try {
    const sysPrompt = da_systemPrompts['builder'];
    const ctx = da_chatHistory.length > 1
      ? '\n\n[سياق المحادثة]:\n' + da_chatHistory.slice(-5, -1)
          .map(h => (h.role === 'user' ? 'المستخدم: ' : 'AI: ') + h.content).join('\n')
      : '';
    const fullPrompt = `${sysPrompt}${ctx}\n\nطلب المستخدم: ${text}`;

    // → 100% Native Local Neural Engine (Ollama)
    // Runs on your local machine, completely free, private, and always available.
    
    // First, verify Ollama is running and get available models
    let availableModels = [];
    try {
      const checkOllama = await fetch('http://localhost:11434/api/tags');
      const tagsData = await checkOllama.json();
      availableModels = tagsData.models.map(m => m.name);
    } catch (e) {
      throw new Error("تطبيق Ollama غير متصل ⚠️. يرجى تثبيت وتشغيل Ollama على جهازك من ollama.com");
    }

    // Auto-detect the best coding model available locally
    let selectedModel = 'llama3'; // Default fallback
    const preferredModels = ['qwen2.5-coder', 'deepseek-coder', 'mistral', 'llama3'];
    for (let pm of preferredModels) {
      if (availableModels.find(m => m.startsWith(pm))) {
        selectedModel = availableModels.find(m => m.startsWith(pm));
        break;
      }
    }

    if (availableModels.length === 0) {
      throw new Error("لم يتم العثور على أي نموذج ⚠️. يرجى فتح الـ Terminal وكتابة: ollama run llama3");
    }

    const messages = [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: text }
    ];

    const resp = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: selectedModel,
        messages: messages,
        stream: false 
      })
    });

    da_hideThinking();

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`مشكلة في استجابة Ollama: ${err}`);
    }

    const data = await resp.json();
    const reply = data.message?.content || "";
    const model = `${selectedModel} (Ollama Local API)`;

    if (reply && reply.trim().length > 10) {
      da_chatHistory.push({ role: 'user', content: text });
      da_chatHistory.push({ role: 'assistant', content: reply });
      if (da_chatHistory.length > 30) da_chatHistory = da_chatHistory.slice(-30);
      da_addMsg('ai', reply);

      // Auto-open preview if HTML code is detected
      const htmlMatch = reply.match(/```html([\s\S]*?)```/);
      if (htmlMatch || reply.includes('<!DOCTYPE html>') || reply.includes('<html')) {
        let code = htmlMatch ? htmlMatch[1].trim() : reply;
        if (code.startsWith('html\n')) code = code.substring(5);
        if (window.dwOpenPreview) {
          window.dwOpenPreview({
            html: code,
            code: code,
            analysis: { brandName: 'Sovereign Website', dialect: { welcome: 'Sovereign AI' } },
            logic: [`${model}`, 'Sovereign Protocol v15']
          });
        }
      }
    } else {
      da_messageCount--;
      da_addMsg('ai', '⚡ محرك الذكاء الاصطناعي المركزي مزدحم. يرجى الانتظار والمحاولة مرة أخرى.');
    }

  } catch (err) {
    console.error('AI Studio Error:', err);
    da_hideThinking();
    da_messageCount--;
    da_addMsg('ai', `⚡ ${err.message || 'خطأ في الاتصال بالشبكة العصبية'}. يرجى إعادة الإرسال.`);
  } finally {
    da_isLoading = false;
    document.getElementById('da-sendBtn').disabled = false;
  }
}

// ═══════════════════════════════════════════════════════════
// (Local dummy engine was removed. The Sovereign AI now parses EVERYTHING natively.)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🏛️ LOCAL SYNTHESIS ENGINE (Always-Available Fallback)
// Removed da_triggerLocalFallback completely. Defaulting ONLY to genuine AI responses.

document.addEventListener('DOMContentLoaded', initDevopsAgent);
