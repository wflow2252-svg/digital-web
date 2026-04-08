// Digital Web - Chat Widget
// بيتضاف في كل صفحات الموقع إملأ SERVER_URL بعد رفع السيرفر على Render
(function () {
  const SERVER_URL = 'https://8eefb223-7dd7-4a6f-9a65-6a5e5c82a046-00-38o502oe3ekp0.spock.replit.dev';

  // Generate or retrieve session ID
  let sessionId = localStorage.getItem('dw_session');
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('dw_session', sessionId);
  }

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

    socket.on('connect', () => {
      connected = true;
      socket.emit('web:identify', { sessionId, name: 'زائر' });
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
      #dw-chat-btn {
        position: fixed; bottom: 30px; left: 30px; z-index: 9999;
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 25px rgba(0,240,255,0.4);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: dw-pulse 2.5s infinite;
      }
      #dw-chat-btn:hover { transform: scale(1.1) translateY(-3px); box-shadow: 0 15px 35px rgba(0,240,255,0.5); }
      @keyframes dw-pulse {
        0%,100% { box-shadow: 0 8px 25px rgba(0,240,255,0.4); }
        50% { box-shadow: 0 8px 40px rgba(112,0,255,0.6); }
      }
      #dw-chat-btn svg { width: 28px; height: 28px; fill: white; }
      #dw-notif-dot {
        position: absolute; top: 0; right: 0; width: 16px; height: 16px;
        background: #ff4757; border-radius: 50%; border: 2px solid var(--bg-dark, #0a0a0f);
        display: none; animation: dw-bounce 0.5s ease;
      }
      @keyframes dw-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
      #dw-chat-window {
        position: fixed; bottom: 105px; left: 30px; z-index: 9998;
        width: 360px; height: 500px; border-radius: 20px;
        background: #0f0f18; border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        display: flex; flex-direction: column; overflow: hidden;
        transform: scale(0.8) translateY(20px); opacity: 0;
        transition: transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease;
        pointer-events: none; font-family: 'Cairo', sans-serif; direction: rtl;
      }
      #dw-chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
      #dw-chat-header {
        padding: 16px 20px; background: linear-gradient(135deg, #0a0a14, #120a24);
        border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 12px;
      }
      #dw-chat-header .avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, #00f0ff, #7000ff);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; flex-shrink: 0;
      }
      .dw-header-info { flex: 1; }
      .dw-header-name { color: #fff; font-weight: 700; font-size: 1rem; }
      .dw-header-status { font-size: 0.78rem; margin-top: 2px; display: flex; align-items: center; gap: 5px; }
      .dw-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #ccc; flex-shrink: 0; transition: 0.3s; }
      .dw-status-dot.online { background: #2ed573; box-shadow: 0 0 6px #2ed573; }
      #dw-chat-messages {
        flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px;
        scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
      }
      .dw-bubble {
        max-width: 80%; padding: 10px 15px; border-radius: 18px; font-size: 0.92rem; line-height: 1.5;
        word-break: break-word; animation: dw-fadeIn 0.3s ease;
      }
      @keyframes dw-fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      .dw-bubble.user { background: linear-gradient(135deg, #7000ff, #4a00b4); color: #fff; align-self: flex-end; border-bottom-left-radius: 5px; }
      .dw-bubble.admin { background: rgba(255,255,255,0.07); color: #e0e0e0; align-self: flex-start; border-bottom-right-radius: 5px; }
      .dw-bubble-time { font-size: 0.68rem; color: rgba(255,255,255,0.4); margin-top: 4px; }
      .dw-welcome {
        text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem; padding: 20px;
        display: flex; flex-direction: column; align-items: center; gap: 10px;
      }
      .dw-welcome-icon { font-size: 3rem; }
      #dw-chat-input-area {
        padding: 12px 15px; background: rgba(255,255,255,0.03);
        border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; align-items: center;
      }
      #dw-chat-input {
        flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 25px; padding: 10px 18px; color: #fff; font-family: 'Cairo', sans-serif;
        font-size: 0.92rem; outline: none; transition: 0.3s; direction: rtl;
      }
      #dw-chat-input:focus { border-color: rgba(0,240,255,0.4); background: rgba(255,255,255,0.08); }
      #dw-chat-input::placeholder { color: rgba(255,255,255,0.3); }
      #dw-send-btn {
        width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #00f0ff, #7000ff);
        border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,240,255,0.3);
      }
      #dw-send-btn:hover { transform: scale(1.1); }
      #dw-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      #dw-send-btn svg { width: 18px; height: 18px; fill: white; }
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
      <button id="dw-chat-btn" title="تكلم معانا">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
      </button>
    `;
    document.body.appendChild(btnWrapper);

    const chatWindow = document.createElement('div');
    chatWindow.id = 'dw-chat-window';
    chatWindow.innerHTML = `
      <div id="dw-chat-header">
        <div class="avatar">💬</div>
        <div class="dw-header-info">
          <div class="dw-header-name">فريق Digital Web</div>
          <div class="dw-header-status">
            <div class="dw-status-dot" id="dw-status-dot"></div>
            <span id="dw-status-text" style="color:rgba(255,255,255,0.5);">جاري الاتصال...</span>
          </div>
        </div>
      </div>
      <div id="dw-chat-messages">
        <div class="dw-welcome">
          <div class="dw-welcome-icon">👋</div>
          <div>أهلاً بيك! إزيك؟<br>إبعتلنا رسالة وهنرد عليك في أقرب وقت.</div>
        </div>
      </div>
      <div id="dw-chat-input-area">
        <input id="dw-chat-input" type="text" placeholder="اكتب رسالتك هنا..." maxlength="500">
        <button id="dw-send-btn">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(chatWindow);

    // === Events ===
    document.getElementById('dw-chat-btn').addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      if (isOpen) {
        document.getElementById('dw-notif-dot').style.display = 'none';
        document.getElementById('dw-chat-input').focus();
        scrollToBottom();
      }
    });

    document.getElementById('dw-chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    document.getElementById('dw-send-btn').addEventListener('click', sendMessage);

    function sendMessage() {
      const input = document.getElementById('dw-chat-input');
      const text = input.value.trim();
      if (!text || !connected) return;
      socket.emit('web:message', { sessionId, text });
      messages.push({ from: 'user', text, time: new Date().toISOString() });
      input.value = '';
      renderMessages();
    }

    function renderMessages() {
      const container = document.getElementById('dw-chat-messages');
      if (messages.length === 0) return;
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
        text.textContent = 'متاحين دلوقتي';
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
