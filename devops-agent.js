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
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code>${da_escHtml(code.trim())}</code></pre>`);
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
  bubble.innerHTML = role === 'ai' ? da_formatText(text) : da_escHtml(text);

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
    <div class="da-avatar ai"><i data-lucide="bot" style="width:20px;height:20px;"></i></div>
    <div class="da-thinking-bubble">
      <div class="da-dot"></div><div class="da-dot"></div><div class="da-dot"></div>
      <span style="font-size:11px; margin-right:8px; color:#94a3b8; font-family:'JetBrains Mono',monospace;">SOVEREIGN AI GENERATING...</span>
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
  da_chatHistory.push({ role: 'user', content: text });
  da_showThinking();

  try {
    const sysPrompt = da_systemPrompts['builder'];
    const ctx = da_chatHistory.length > 1
      ? '\n\n[سياق المحادثة]:\n' + da_chatHistory.slice(-5, -1)
          .map(h => (h.role === 'user' ? 'المستخدم: ' : 'AI: ') + h.content).join('\n')
      : '';
    const fullPrompt = `${sysPrompt}${ctx}\n\nطلب المستخدم: ${text}`;

    // → /api/ai  (Vercel serverless — token never on client)
    const resp = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    da_hideThinking();

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${resp.status}`);
    }

    const { reply, model } = await resp.json();

    if (reply && reply.trim().length > 5) {
      da_chatHistory.push({ role: 'assistant', content: reply });
      if (da_chatHistory.length > 30) da_chatHistory = da_chatHistory.slice(-30);
      da_addMsg('ai', reply);

      // Auto-open preview if HTML code is detected
      const htmlMatch = reply.match(/```html([\s\S]*?)```/);
      if (htmlMatch || reply.includes('<!DOCTYPE html>') || reply.includes('<html')) {
        const code = htmlMatch ? htmlMatch[1].trim() : reply;
        if (window.dwOpenPreview) {
          window.dwOpenPreview({
            html: code,
            code: code,
            analysis: { brandName: 'AI Generated Site', dialect: { welcome: 'Sovereign AI' } },
            logic: [`Real AI (${model || 'HF'})`, 'Sovereign Protocol v13']
          });
        }
      }
    } else {
      // Trigger local fallback
      da_messageCount--;
      da_addMsg('ai', '⚡ محرك الذكاء الاصطناعي مشغول الآن. جاري تفعيل محرك التوليد المحلي...');
      setTimeout(() => da_triggerLocalFallback(text), 600);
    }

  } catch (err) {
    console.error('AI Studio Error:', err);
    da_hideThinking();
    da_messageCount--;
    da_addMsg('ai', `⚡ ${err.message || 'خطأ في الاتصال'}. جاري تفعيل المحرك المحلي...`);
    setTimeout(() => da_triggerLocalFallback(text), 600);
  } finally {
    da_isLoading = false;
    document.getElementById('da-sendBtn').disabled = false;
  }
}

// ═══════════════════════════════════════════════════════════
// 🏛️ LOCAL SYNTHESIS ENGINE (Always-Available Fallback)
// ═══════════════════════════════════════════════════════════
function da_triggerLocalFallback(text) {
  const p = text.toLowerCase();
  let dialect = { welcome: 'أهلاً بك في آفاق السيادة الرقمية', cta: 'ابدأ رحلة النجاح الآن' };
  if (p.includes('ابي') || p.includes('ودي')) dialect = { welcome: 'حيّاك في عالم الفخامة الرقمية', cta: 'احجز مكانك في القمة' };
  if (p.includes('عايز') || p.includes('اعملي')) dialect = { welcome: 'أهلاً في مصنع النجاح', cta: 'سيطر على السوق دلوقتي' };

  const brandName = text.match(/(لـ|اسم|لشركة|for|called) ([\w\s\u0600-\u06FF]+)/)?.[2]?.trim() || 'Sovereign Hub';

  let accent = 'indigo-600', niche = 'تقنية متقدمة';
  if (p.includes('مطعم') || p.includes('كافيه') || p.includes('اكل')) { accent = 'orange-500'; niche = 'مطعم وكافيه'; }
  else if (p.includes('عقار') || p.includes('فيلا') || p.includes('سكن')) { accent = 'emerald-600'; niche = 'عقارات'; }
  else if (p.includes('متجر') || p.includes('ملابس') || p.includes('تسوق')) { accent = 'fuchsia-600'; niche = 'متجر إلكتروني'; }
  else if (p.includes('عيادة') || p.includes('طب') || p.includes('صحة')) { accent = 'sky-500'; niche = 'رعاية صحية'; }

  if (window.SOVEREIGN_UI_FACTORY) {
    const f = window.SOVEREIGN_UI_FACTORY;
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><script src="https://cdn.tailwindcss.com"><\/script><script src="https://unpkg.com/lucide@latest"><\/script><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Cairo',sans-serif;background:#020617;color:#f8fafc;}<\/style><\/head><body class="bg-slate-950 min-h-screen">
    ${f.header(brandName, accent)}
    ${f.hero(brandName, `منصة ${niche} احترافية لتحقيق أهدافك وتحويل زوارك لعملاء دائمين.`, 'modern', accent, dialect)}
    ${f.footer()}<script>lucide.createIcons();<\/script><\/body><\/html>`;

    da_addMsg('ai', `✅ تم توليد موقع **${brandName}** (${niche}) بالمحرك المحلي! شاهد المعاينة في اليمين.`);
    window.dwOpenPreview({ html, code: html, analysis: { dialect, brandName }, logic: ['Local Engine', 'Sovereign v13'] });
  } else {
    da_addMsg('ai', `تم التحليل: **${brandName}** (${niche}). أعد تحميل الصفحة للحصول على المعاينة الكاملة.`);
  }
}

document.addEventListener('DOMContentLoaded', initDevopsAgent);
