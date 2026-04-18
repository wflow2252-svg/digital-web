// Digital Web - AI Studio Agent Logic (Restricted)

const da_domains = [
  { id:'builder', icon:'layout', name:'إنشاء موقع تجريبي', desc:'قم ببناء موقعك مجاناً عبر الذكاء الاصطناعي', color:'#00d4ff' }
];

const da_systemPrompts = {
  builder: 'أنت Sovereign AI، مصمم ومبرمج مواقع محترف. مهمتك قراءة طلب المستخدم، وتوليد كود HTML و CSS و JS في ملف واحد متكامل واحترافي 100%. أجب دائماً بالعربية وركز على الـ UX/UI الراقي جداً. لا تدرج أي نصوص زائدة، فقط قدم العمل.'
};

const da_quickSuggestions = {
  builder: ['موقع لشركة تقنية','موقع لمطعم وكافيه','موقع لعيادة أسنان', 'متجر إلكتروني للملابس']
};

const da_welcomeCards = [
  { icon:'layout', text:'أريد إنشاء موقع لشركة تقنية ناشئة' },
  { icon:'building', text:'أريد بناء موقع عقاري شامل بخريطة' }
];

let da_currentDomain = 'builder';
let da_chatHistory = [];
let da_isLoading = false;
let da_messageCount = 0;
const MAX_MESSAGES = 4; // Hard Limit

function initDevopsAgent() {
  const domainList = document.getElementById('da-domainList');
  if(!domainList) return;
  domainList.innerHTML = '';
  da_domains.forEach(d => {
    const el = document.createElement('div');
    el.className = 'da-domain-item active';
    el.dataset.id = d.id;
    el.innerHTML = `<span class="da-d-icon"><i data-lucide="${d.icon}"></i></span><span class="da-d-name">${d.name}</span>`;
    // Removed onClick domain switching since there's only one.
    domainList.appendChild(el);
  });

  da_renderWelcomeCards();
  if (typeof lucide !== 'undefined') lucide.createIcons();
  da_renderQuick();
}

function da_renderWelcomeCards() {
  const wg = document.getElementById('da-welcomeGrid');
  if(!wg) return;
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
  if(!area) return;
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
    <div class="da-welcome-icon"><i data-lucide="terminal-square"></i></div>
    <div class="da-welcome-title">AI Studio Agent</div>
    <div class="da-welcome-sub">المساعد التقني الشامل. جاهز لتصميم مسودات المواقع وتوليد الأكواد مجاناً (رصيد محدود).</div>
    <div class="da-welcome-grid" id="da-welcomeGrid"></div>`;
  msgs.appendChild(welcome);
  da_renderWelcomeCards();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function da_formatText(text) {
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code>${da_escHtml(code.trim())}</code></pre>`);
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${da_escHtml(c)}</code>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
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
  
  if(role === 'ai') { av.innerHTML = '<i data-lucide="bot" style="width:20px;height:20px;"></i>'; } 
  else { av.innerHTML = '<i data-lucide="user" style="width:20px;height:20px;"></i>'; }

  const col = document.createElement('div');
  col.className = 'da-msg-col';

  const bubble = document.createElement('div');
  bubble.className = 'da-bubble ' + role;
  if (role === 'ai') { bubble.innerHTML = da_formatText(text); } 
  else { bubble.textContent = text; }

  const meta = document.createElement('div');
  meta.className = 'da-msg-meta';
  meta.textContent = new Date().toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'});

  col.appendChild(bubble);
  col.appendChild(meta);
  row.appendChild(av);
  row.appendChild(col);
  msgs.appendChild(row);
  
  if (typeof lucide !== 'undefined') lucide.createIcons({root: row});
  msgs.scrollTop = msgs.scrollHeight;
  return bubble;
}

function da_showThinking() {
  const msgs = document.getElementById('da-messages');
  const row = document.createElement('div');
  row.className = 'da-thinking-row';
  row.id = 'da-thinking';
  row.innerHTML = `
    <div class="da-avatar ai"><i data-lucide="bot" style="width:20px;height:20px;"></i></div>
    <div class="da-thinking-bubble">
      <div class="da-dot"></div><div class="da-dot"></div><div class="da-dot"></div>
      <span style="font-size:11px; margin-right:8px; color:#94a3b8; font-family:'JetBrains Mono', monospace;">ANALYZING REQUIREMENTS...</span>
    </div>`;
  msgs.appendChild(row);
  if (typeof lucide !== 'undefined') lucide.createIcons({root: row});
  msgs.scrollTop = msgs.scrollHeight;
}

function da_hideThinking() {
  const t = document.getElementById('da-thinking');
  if (t) t.remove();
}

async function da_sendMsg() {
  if (da_isLoading) return;
  const input = document.getElementById('da-userInput');
  const text = input.value.trim();
  if (!text) return;

  if (da_messageCount >= MAX_MESSAGES) {
      da_addMsg('ai', 'عذراً! لقد استنفدت رصيدك التجريبي المجاني (4/4 رسائل). يُرجى التواصل معنا للاشتراك في الخدمة الكاملة. 🛑');
      return;
  }
  
  da_messageCount++;

  input.value = '';
  input.style.height = 'auto';
  da_isLoading = true;
  document.getElementById('da-sendBtn').disabled = true;

  da_addMsg('user', text);
  da_chatHistory.push({ role: 'user', content: text });
  da_showThinking();

  try {
    // Build full message with system context
    const systemGoal = da_systemPrompts['builder'];
    const contextStr = da_chatHistory.length > 1
      ? "\n\n[سياق المحادثة السابق]:\n" + da_chatHistory.slice(0, -1).map(h => (h.role === 'user' ? 'المستخدم: ' : 'AI: ') + h.content).join('\n')
      : "";

    const fullPrompt = `[SYSTEM]: ${systemGoal}\n\n[USER]: ${text}${contextStr}`;

    // Direct REST call to Bytez API — works from browser without SDK
    const resp = await fetch('https://api.bytez.com/models/v2/anthropic/claude-opus-4-6/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Key 31b385faf5c325b4f98b432dd21a53ac',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 3000,
        stream: false
      })
    });

    da_hideThinking();

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Bytez error:', resp.status, errText);
      da_addMsg('ai', `خطأ من الخادم: ${resp.status}. تحقق من صحة الـ API Key.`);
      da_messageCount--;
    } else {
      const data = await resp.json();
      // Bytez returns { output: "..." } or OpenAI-compatible format
      const reply = data?.output 
        || data?.choices?.[0]?.message?.content 
        || data?.content?.[0]?.text 
        || (typeof data === 'string' ? data : JSON.stringify(data));
      
      da_chatHistory.push({ role: 'assistant', content: reply });
      if (da_chatHistory.length > 30) da_chatHistory = da_chatHistory.slice(-30);
      da_addMsg('ai', reply);
    }

  } catch (e) {
    console.error(e);
    da_hideThinking();
    da_addMsg('ai', 'فشل الاتصال بالخادم. تحقق من الإنترنت وأعد المحاولة.');
    da_messageCount--;
  }

  da_isLoading = false;
  document.getElementById('da-sendBtn').disabled = false;
  input.focus();
}

// Load it when DOM is ready
document.addEventListener('DOMContentLoaded', initDevopsAgent);
