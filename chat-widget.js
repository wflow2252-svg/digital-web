// Digital Web - Chat Widget (Professional Version with Name & Phone)
(function () {
  const SERVER_URL = 'https://8eefb223-7dd7-4a6f-9a65-6a5e5c82a046-00-38o502oe3ekp0.spock.replit.dev';

  // Generate or retrieve session ID
  let sessionId = localStorage.getItem('dw_session');
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('dw_session', sessionId);
  }

  // Check if user already registered
  let userInfo = JSON.parse(localStorage.getItem('dw_user') || 'null');

  // Load Socket.io
  const script = document.createElement('script');
  script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
  script.onload = initChat;
  document.head.appendChild(script);

  function initChat() {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: { "Bypass-Tunnel-Reminder": "true" }
    });
    let isOpen = false;
    let messages = [];
    let connected = false;
    let userRegistered = !!userInfo;

    socket.on('connect', () => {
      connected = true;
      if (userRegistered) {
        socket.emit('web:identify', { sessionId, name: userInfo.name, phone: userInfo.phone });
      }
      updateStatus(true);
    });

    socket.on('disconnect', () => {
      connected = false;
      updateStatus(false);
    });

    socket.on('web:history', (history) => {
      messages = history;
      renderMessages();
    });

    socket.on('web:reply', (msg) => {
      messages.push(msg);
      renderMessages();
      if (!isOpen) showNotificationDot();
      playReceiveSound();
    });

    // === Inject CSS ===
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
      #dw-chat-btn {
        position: fixed; bottom: 30px; left: 30px; z-index: 9999;
        width: 62px; height: 62px; border-radius: 50%;
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 30px rgba(0,240,255,0.45);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: dw-pulse 2.5s infinite;
      }
      #dw-chat-btn:hover { transform: scale(1.1) translateY(-3px); box-shadow: 0 15px 40px rgba(0,240,255,0.6); }
      @keyframes dw-pulse {
        0%,100% { box-shadow: 0 8px 30px rgba(0,240,255,0.45); }
        50% { box-shadow: 0 8px 45px rgba(112,0,255,0.65); }
      }
      #dw-chat-btn svg { width: 28px; height: 28px; fill: white; }
      #dw-notif-dot {
        position: absolute; top: 0; right: 0; width: 16px; height: 16px;
        background: #ff4757; border-radius: 50%; border: 2px solid #0a0a0f;
        display: none; animation: dw-bounce 0.5s ease;
      }
      @keyframes dw-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
      #dw-chat-window {
        position: fixed; bottom: 108px; left: 30px; z-index: 9998;
        width: 370px; border-radius: 22px;
        background: linear-gradient(160deg, #0d0d1a 0%, #120a24 100%);
        border: 1px solid rgba(255,255,255,0.07);
        box-shadow: 0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,240,255,0.05);
        display: flex; flex-direction: column; overflow: hidden;
        transform: scale(0.85) translateY(20px); opacity: 0;
        transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease;
        pointer-events: none; font-family: 'Cairo', sans-serif; direction: rtl;
        max-height: 560px;
      }
      #dw-chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
      #dw-chat-header {
        padding: 18px 20px;
        background: linear-gradient(135deg, rgba(0,240,255,0.08), rgba(112,0,255,0.08));
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex; align-items: center; gap: 13px;
      }
      #dw-chat-header .avatar {
        width: 44px; height: 44px; border-radius: 50%;
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        display: flex; align-items: center; justify-content: center;
        font-size: 22px; flex-shrink: 0;
        box-shadow: 0 4px 15px rgba(0,240,255,0.3);
      }
      .dw-header-info { flex: 1; }
      .dw-header-name { color: #fff; font-weight: 700; font-size: 1rem; letter-spacing: 0.3px; }
      .dw-header-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
      .dw-header-status { font-size: 0.78rem; margin-top: 3px; display: flex; align-items: center; gap: 5px; }
      .dw-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #ccc; flex-shrink: 0; transition: 0.3s; }
      .dw-status-dot.online { background: #2ed573; box-shadow: 0 0 8px #2ed573; }

      /* Registration Form */
      #dw-reg-form {
        padding: 25px 20px; display: flex; flex-direction: column; gap: 14px;
      }
      .dw-reg-title {
        color: #fff; font-size: 1.05rem; font-weight: 700; text-align: center; margin-bottom: 4px;
        background: linear-gradient(135deg, #00f0ff, #a855f7);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
      .dw-reg-sub {
        color: rgba(255,255,255,0.45); font-size: 0.82rem; text-align: center; margin-top: -8px; margin-bottom: 4px;
      }
      .dw-input-group { display: flex; flex-direction: column; gap: 6px; }
      .dw-input-label { color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 600; }
      .dw-field {
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px; padding: 11px 16px; color: #fff;
        font-family: 'Cairo', sans-serif; font-size: 0.92rem; outline: none;
        transition: 0.3s; direction: rtl; width: 100%; box-sizing: border-box;
      }
      .dw-field:focus { border-color: rgba(0,240,255,0.5); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(0,240,255,0.08); }
      .dw-field::placeholder { color: rgba(255,255,255,0.25); }
      .dw-start-btn {
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        border: none; border-radius: 14px; padding: 13px;
        color: #fff; font-family: 'Cairo', sans-serif; font-size: 1rem;
        font-weight: 700; cursor: pointer; transition: 0.3s; margin-top: 4px;
        box-shadow: 0 6px 20px rgba(0,240,255,0.3);
        letter-spacing: 0.5px;
      }
      .dw-start-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,240,255,0.4); }
      .dw-privacy { color: rgba(255,255,255,0.3); font-size: 0.72rem; text-align: center; }

      /* Chat Messages */
      #dw-chat-messages {
        flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
        scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;
        min-height: 260px; max-height: 320px;
      }
      .dw-bubble {
        max-width: 82%; padding: 11px 16px; border-radius: 18px; font-size: 0.93rem; line-height: 1.55;
        word-break: break-word; animation: dw-fadeIn 0.35s ease;
      }
      @keyframes dw-fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
      .dw-bubble.user {
        background: linear-gradient(135deg, #7000ff, #4a00b4); color: #fff;
        align-self: flex-end; border-bottom-left-radius: 5px;
        box-shadow: 0 4px 15px rgba(112,0,255,0.3);
      }
      .dw-bubble.admin {
        background: rgba(255,255,255,0.07); color: #e8e8e8;
        align-self: flex-start; border-bottom-right-radius: 5px;
        border: 1px solid rgba(255,255,255,0.05);
      }
      .dw-bubble-time { font-size: 0.68rem; color: rgba(255,255,255,0.35); margin-top: 5px; }
      .dw-welcome {
        text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; padding: 25px 15px;
        display: flex; flex-direction: column; align-items: center; gap: 10px;
      }
      .dw-welcome-icon { font-size: 3rem; }
      #dw-chat-input-area {
        padding: 13px 15px;
        background: rgba(0,0,0,0.2);
        border-top: 1px solid rgba(255,255,255,0.05);
        display: flex; gap: 10px; align-items: center;
      }
      #dw-chat-input {
        flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 25px; padding: 11px 18px; color: #fff; font-family: 'Cairo', sans-serif;
        font-size: 0.92rem; outline: none; transition: 0.3s; direction: rtl;
      }
      #dw-chat-input:focus { border-color: rgba(0,240,255,0.4); background: rgba(255,255,255,0.09); }
      #dw-chat-input::placeholder { color: rgba(255,255,255,0.28); }
      #dw-send-btn {
        width: 43px; height: 43px; border-radius: 50%;
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,240,255,0.35);
      }
      #dw-send-btn:hover { transform: scale(1.1); }
      #dw-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      #dw-send-btn svg { width: 18px; height: 18px; fill: white; }
      .dw-user-badge {
        padding: 10px 18px;
        background: rgba(0,240,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        display: flex; align-items: center; gap: 10px;
        font-size: 0.8rem; color: rgba(255,255,255,0.5);
      }
      .dw-user-badge span { color: rgba(0,240,255,0.8); font-weight: 700; }
      @media (max-width: 480px) {
        #dw-chat-window { width: calc(100vw - 20px); left: 10px; right: 10px; bottom: 90px; }
        #dw-chat-btn { bottom: 20px; left: 20px; }
      }
    `;
    document.head.appendChild(style);

    // === Inject HTML ===
    const btnWrapper = document.createElement('div');
    btnWrapper.style.cssText = 'position:fixed;bottom:30px;left:30px;z-index:9999;';
    btnWrapper.innerHTML = `
      <div id="dw-notif-dot"></div>
      <button id="dw-chat-btn" title="كلمنا دلوقتي">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
      </button>
    `;
    document.body.appendChild(btnWrapper);

    const chatWindow = document.createElement('div');
    chatWindow.id = 'dw-chat-window';

    // Registration form HTML
    const regFormHTML = `
      <div id="dw-chat-header">
        <div class="avatar">💬</div>
        <div class="dw-header-info">
          <div class="dw-header-name">Digital Web</div>
          <div class="dw-header-sub">محتاج مساعدة؟ إحنا هنا!</div>
          <div class="dw-header-status">
            <div class="dw-status-dot" id="dw-status-dot"></div>
            <span id="dw-status-text" style="color:rgba(255,255,255,0.4);">جاري الاتصال...</span>
          </div>
        </div>
      </div>
      <div id="dw-reg-form">
        <div class="dw-reg-title">✨ أهلاً وسهلاً بيك!</div>
        <div class="dw-reg-sub">عشان نقدر نساعدك بشكل أفضل، اكتب بياناتك الأول</div>
        <div class="dw-input-group">
          <label class="dw-input-label">👤 الاسم الكريم</label>
          <input class="dw-field" id="dw-name-input" type="text" placeholder="اكتب اسمك هنا..." maxlength="50">
        </div>
        <div class="dw-input-group">
          <label class="dw-input-label">📱 رقم الواتساب أو التليفون</label>
          <input class="dw-field" id="dw-phone-input" type="tel" placeholder="01xxxxxxxxx" maxlength="15" dir="ltr">
        </div>
        <button class="dw-start-btn" id="dw-start-chat">ابدأ المحادثة 🚀</button>
        <div class="dw-privacy">🔒 بياناتك محمية وآمنة تماماً</div>
      </div>
    `;

    // Chat UI HTML
    const chatHTML = `
      <div id="dw-chat-header">
        <div class="avatar">💬</div>
        <div class="dw-header-info">
          <div class="dw-header-name">Digital Web</div>
          <div class="dw-header-status">
            <div class="dw-status-dot" id="dw-status-dot"></div>
            <span id="dw-status-text" style="color:rgba(255,255,255,0.4);">جاري الاتصال...</span>
          </div>
        </div>
      </div>
      <div class="dw-user-badge">تتكلم كـ: <span id="dw-user-name-badge">-</span></div>
      <div id="dw-chat-messages">
        <div class="dw-welcome">
          <div class="dw-welcome-icon">👋</div>
          <div>أهلاً! ابعتلنا رسالتك وهنرد عليك في أقرب وقت.</div>
        </div>
      </div>
      <div id="dw-chat-input-area">
        <input id="dw-chat-input" type="text" placeholder="اكتب رسالتك هنا..." maxlength="500">
        <button id="dw-send-btn">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;

    chatWindow.innerHTML = userRegistered ? chatHTML : regFormHTML;
    document.body.appendChild(chatWindow);

    if (userRegistered) {
      document.getElementById('dw-user-name-badge').textContent = userInfo.name;
    }

    // === Events ===
    const triggerToggle = () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      if (isOpen) {
        document.getElementById('dw-notif-dot').style.display = 'none';
        if (userRegistered) {
          const input = document.getElementById('dw-chat-input');
          if (input) { input.focus(); scrollToBottom(); }
        } else {
          const nameInput = document.getElementById('dw-name-input');
          if (nameInput) nameInput.focus();
        }
      }
    };
    
    document.getElementById('dw-chat-btn').addEventListener('click', triggerToggle);
    window.dwOpenChat = () => { if (!isOpen) triggerToggle(); };


    // Registration submit
    chatWindow.addEventListener('click', (e) => {
      if (e.target.id === 'dw-start-chat') submitRegistration();
    });
    chatWindow.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !userRegistered) submitRegistration();
      if (e.key === 'Enter' && userRegistered) sendMessage();
    });

    function submitRegistration() {
      const name = (document.getElementById('dw-name-input')?.value || '').trim();
      const phone = (document.getElementById('dw-phone-input')?.value || '').trim();
      if (!name) { document.getElementById('dw-name-input').style.borderColor = 'rgba(255,71,87,0.7)'; return; }
      if (!phone || phone.length < 8) { document.getElementById('dw-phone-input').style.borderColor = 'rgba(255,71,87,0.7)'; return; }
      userInfo = { name, phone };
      localStorage.setItem('dw_user', JSON.stringify(userInfo));
      userRegistered = true;
      chatWindow.innerHTML = chatHTML;
      document.getElementById('dw-user-name-badge').textContent = name;
      socket.emit('web:identify', { sessionId, name, phone });
      updateStatus(connected);
      document.getElementById('dw-chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
      document.getElementById('dw-send-btn').addEventListener('click', sendMessage);
    }

    if (userRegistered) {
      document.getElementById('dw-chat-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
      document.getElementById('dw-send-btn')?.addEventListener('click', sendMessage);
    }

    function sendMessage() {
      const input = document.getElementById('dw-chat-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text || !connected) return;
      socket.emit('web:message', { sessionId, text });
      messages.push({ from: 'user', text, time: new Date().toISOString() });
      input.value = '';
      renderMessages();
    }

    function renderMessages() {
      const container = document.getElementById('dw-chat-messages');
      if (!container || messages.length === 0) return;
      container.innerHTML = messages.map(m => `
        <div>
          <div class="dw-bubble ${m.from === 'user' ? 'user' : 'admin'}">${escHtml(m.text)}</div>
          <div class="dw-bubble-time" style="text-align:${m.from === 'user' ? 'left' : 'right'}">${formatTime(m.time)}</div>
        </div>
      `).join('');
      scrollToBottom();
    }

    function scrollToBottom() {
      const c = document.getElementById('dw-chat-messages');
      if (c) c.scrollTop = c.scrollHeight;
    }

    function showNotificationDot() {
      const dot = document.getElementById('dw-notif-dot');
      if (dot) dot.style.display = 'block';
    }

    function updateStatus(online) {
      const dot = document.getElementById('dw-status-dot');
      const text = document.getElementById('dw-status-text');
      if (!dot || !text) return;
      if (online) {
        dot.classList.add('online');
        text.textContent = 'متاحين دلوقتي ✓';
        text.style.color = '#2ed573';
      } else {
        dot.classList.remove('online');
        text.textContent = 'جاري الاتصال...';
        text.style.color = 'rgba(255,255,255,0.4)';
      }
    }

    function playReceiveSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
      } catch (_) {}
    }

    function escHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function formatTime(iso) {
      const d = new Date(iso);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }
  }
})();
