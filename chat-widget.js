// Digital Web - Chat Widget (WhatsApp-Style Realistic Design)
(function () {
  let sessionId = localStorage.getItem('dw_session');
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('dw_session', sessionId);
  }

  let userInfo = JSON.parse(localStorage.getItem('dw_user') || 'null');

  // Load Firebase Scripts
  const scriptApp = document.createElement('script');
  scriptApp.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
  scriptApp.onload = () => {
    const scriptDb = document.createElement('script');
    scriptDb.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
    scriptDb.onload = initChat;
    document.head.appendChild(scriptDb);
  };
  document.head.appendChild(scriptApp);

  function initChat() {
    const firebaseConfig = {
      apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
      projectId: "chat-75d30",
      databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    let isOpen = false;
    let messages = [];
    let userRegistered = !!userInfo;
    let dbListenerStarted = false;
    let unreadCount = 0;

    if (userRegistered) { startListening(); }

    // ===================== CSS =====================
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');

      #dw-fab-wrapper {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      #dw-chat-btn {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(145deg, #25D366, #128C7E);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(37,211,102,0.5), 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        outline: none;
      }
      #dw-chat-btn:hover { transform: scale(1.08); box-shadow: 0 8px 30px rgba(37,211,102,0.6), 0 4px 12px rgba(0,0,0,0.3); }
      #dw-chat-btn svg { width: 30px; height: 30px; fill: white; transition: transform 0.3s ease; }
      #dw-chat-btn.open svg { transform: rotate(90deg); }

      #dw-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 20px;
        height: 20px;
        background: #ff3b30;
        color: white;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 700;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: 'Cairo', sans-serif;
        padding: 0 5px;
        border: 2px solid white;
        animation: dw-pop 0.3s ease;
      }
      
      #dw-chat-label {
        background: rgba(0,0,0,0.75);
        color: white;
        font-family: 'Cairo', sans-serif;
        font-size: 12px;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 20px;
        white-space: nowrap;
        pointer-events: none;
        backdrop-filter: blur(10px);
        display: none;
      }

      @keyframes dw-pop { 0%{transform:scale(0)} 80%{transform:scale(1.15)} 100%{transform:scale(1)} }
      @keyframes dw-slideUp { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes dw-slideDown { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(20px) scale(0.95)} }
      @keyframes dw-msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

      /* ========== CHAT WINDOW ========== */
      #dw-chat-window {
        position: fixed;
        bottom: 96px;
        left: 24px;
        width: 360px;
        height: 580px;
        max-height: calc(100dvh - 110px);
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
        z-index: 999998;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2);
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      }
      #dw-chat-window.open {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0) scale(1);
      }

      /* HEADER */
      #dw-header {
        background: linear-gradient(135deg, #075E54, #128C7E);
        padding: 14px 16px 14px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
      #dw-header-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        flex-shrink: 0;
        border: 2px solid rgba(255,255,255,0.3);
        overflow: hidden;
      }
      #dw-header-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
       }
      #dw-header-info { flex: 1; }
      #dw-header-name {
        color: white;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.2;
      }
      #dw-header-status {
        color: rgba(255,255,255,0.75);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 1px;
      }
      #dw-status-pulse {
        width: 6px; height: 6px; border-radius: 50%;
        background: #9EE89E;
        display: inline-block;
      }
      #dw-close-btn {
        background: none;
        border: none;
        color: rgba(255,255,255,0.8);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        transition: 0.2s;
        flex-shrink: 0;
      }
      #dw-close-btn:hover { background: rgba(255,255,255,0.15); color: white; }
      #dw-close-btn svg { width: 20px; height: 20px; fill: currentColor; }

      /* WALLPAPER */
      #dw-messages-area {
        flex: 1;
        overflow-y: auto;
        padding: 12px 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        background-color: #E5DDD5;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23E5DDD5'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='150' cy='100' r='20' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='250' cy='50' r='40' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='350' cy='100' r='25' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='100' cy='200' r='35' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='300' cy='200' r='30' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='50' cy='300' r='20' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='200' cy='300' r='45' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='350' cy='300' r='25' fill='none' stroke='%23D4C7BB' stroke-width='1' opacity='0.4'/%3E%3C/svg%3E");
        scroll-behavior: smooth;
      }
      #dw-messages-area::-webkit-scrollbar { width: 4px; }
      #dw-messages-area::-webkit-scrollbar-track { background: transparent; }
      #dw-messages-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 2px; }

      /* DATE DIVIDER */
      .dw-date-divider {
        text-align: center;
        margin: 6px 0;
        position: relative;
      }
      .dw-date-divider span {
        background: rgba(255,255,255,0.75);
        backdrop-filter: blur(4px);
        color: #667781;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 8px;
      }

      /* WELCOME MSG */
      #dw-welcome-msg {
        background: rgba(255,255,255,0.8);
        backdrop-filter: blur(4px);
        border-radius: 12px;
        padding: 12px 16px;
        text-align: center;
        color: #667781;
        font-size: 13px;
        margin: 6px 0;
        line-height: 1.6;
      }
      #dw-welcome-msg strong { color: #128C7E; }

      /* BUBBLES */
      .dw-msg-row {
        display: flex;
        margin-bottom: 2px;
        animation: dw-msgIn 0.2s ease;
      }
      .dw-msg-row.user { justify-content: flex-start; }
      .dw-msg-row.admin { justify-content: flex-end; }

      .dw-bubble {
        max-width: 75%;
        padding: 7px 10px 5px;
        border-radius: 8px;
        position: relative;
        word-break: break-word;
        line-height: 1.5;
        font-size: 14px;
      }
      /* User bubble = right side green */
      .dw-bubble.user {
        background: #DCF8C6;
        color: #111;
        border-radius: 8px 8px 8px 2px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.13);
      }
      .dw-bubble.user::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: auto;
        left: -6px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 8px 8px;
        border-color: transparent transparent #DCF8C6 transparent;
      }
      /* Admin bubble = white */
      .dw-bubble.admin {
        background: white;
        color: #111;
        border-radius: 8px 8px 2px 8px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.13);
      }
      .dw-bubble.admin::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: -6px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 8px 8px 0;
        border-color: transparent white transparent transparent;
      }
      .dw-bubble-meta {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 3px;
        margin-top: 2px;
      }
      .dw-bubble-time { font-size: 10.5px; color: #999; }
      .dw-read-tick { color: #53BDEB; font-size: 13px; }
      
      /* TYPING */
      #dw-typing {
        display: none;
        align-items: center;
        gap: 4px;
        padding: 0 4px;
      }
      #dw-typing .dw-bubble {
        display: flex;
        gap: 3px;
        align-items: center;
        padding: 10px 14px;
      }
      .dw-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #999;
        animation: dw-type 1.2s ease-in-out infinite;
      }
      .dw-dot:nth-child(2) { animation-delay: 0.2s; }
      .dw-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes dw-type { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

      /* REGISTRATION */
      #dw-reg-form {
        background: #F0F2F5;
        flex: 1;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 13px;
        overflow-y: auto;
      }
      .dw-reg-hello {
        background: white;
        border-radius: 10px;
        padding: 14px;
        text-align: center;
        border: 1px solid #E9EDEF;
      }
      .dw-reg-hello .emoji { font-size: 36px; display: block; margin-bottom: 8px; }
      .dw-reg-hello h3 {
        color: #111;
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 5px;
      }
      .dw-reg-hello p { color: #667781; font-size: 12.5px; margin: 0; line-height: 1.5; }

      .dw-form-group { display: flex; flex-direction: column; gap: 5px; }
      .dw-form-label { color: #128C7E; font-size: 12px; font-weight: 700; }
      .dw-form-input {
        background: white;
        border: 1.5px solid #E9EDEF;
        border-radius: 8px;
        padding: 11px 14px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        color: #111;
        direction: rtl;
        outline: none;
        transition: 0.2s;
        width: 100%;
        box-sizing: border-box;
      }
      .dw-form-input:focus { border-color: #25D366; box-shadow: 0 0 0 3px rgba(37,211,102,0.1); }
      .dw-form-input::placeholder { color: #aaa; }
      .dw-form-input.error { border-color: #FF3B30; }

      .dw-start-btn {
        background: linear-gradient(135deg, #25D366, #128C7E);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 13px;
        font-family: 'Cairo', sans-serif;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s;
        box-shadow: 0 3px 12px rgba(37,211,102,0.35);
      }
      .dw-start-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37,211,102,0.45); }
      .dw-form-privacy { text-align: center; color: #aaa; font-size: 11px; }

      /* INPUT AREA */
      #dw-input-bar {
        background: #F0F2F5;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        border-top: 1px solid #E9EDEF;
      }
      #dw-chat-input {
        flex: 1;
        background: white;
        border: none;
        border-radius: 24px;
        padding: 10px 16px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        color: #111;
        direction: rtl;
        outline: none;
        resize: none;
        line-height: 1.4;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }
      #dw-chat-input::placeholder { color: #aaa; }

      #dw-send-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #25D366, #128C7E);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: 0.2s;
        box-shadow: 0 2px 8px rgba(37,211,102,0.4);
      }
      #dw-send-btn:hover { transform: scale(1.08); }
      #dw-send-btn svg { width: 20px; height: 20px; fill: white; }

      /* RESPONSIVE MOBILE */
      @media (max-width: 500px) {
        #dw-fab-wrapper {
          bottom: 16px;
          left: 16px;
        }
        #dw-chat-window {
          position: fixed;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
          border-top-left-radius: 20px !important;
          border-top-right-radius: 20px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // ===================== HTML =====================
    const fabWrapper = document.createElement('div');
    fabWrapper.id = 'dw-fab-wrapper';
    fabWrapper.innerHTML = `
      <button id="dw-chat-btn" title="كلمنا دلوقتي">
        <div id="dw-unread-badge"></div>
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-3 9H7v-2h10v2zm0-4H7V5h10v2z"/></svg>
      </button>
    `;
    document.body.appendChild(fabWrapper);

    const chatWindow = document.createElement('div');
    chatWindow.id = 'dw-chat-window';

    const regFormHTML = `
      <div id="dw-header">
        <div id="dw-header-avatar">💬</div>
        <div id="dw-header-info">
          <div id="dw-header-name">Digital Web</div>
          <div id="dw-header-status">
            <span id="dw-status-pulse"></span>
            <span>متاحين دلوقتي</span>
          </div>
        </div>
        <button id="dw-close-btn"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
      </div>
      <div id="dw-reg-form">
        <div class="dw-reg-hello">
          <span class="emoji">👋</span>
          <h3>أهلاً وسهلاً!</h3>
          <p>كلمنا في أي حاجة، عشان نبدأ البرجمة إدينا بياناتك الأول</p>
        </div>
        <div class="dw-form-group">
          <label class="dw-form-label">👤 الاسم</label>
          <input class="dw-form-input" id="dw-name-input" type="text" placeholder="اسمك هنا..." maxlength="50">
        </div>
        <div class="dw-form-group">
          <label class="dw-form-label">📱 الواتساب أو التليفون</label>
          <input class="dw-form-input" id="dw-phone-input" type="tel" placeholder="01xxxxxxxxx" maxlength="15" dir="ltr">
        </div>
        <button class="dw-start-btn" id="dw-start-chat">ابدأ المحادثة →</button>
        <div class="dw-form-privacy">🔒 بياناتك محمية تماماً</div>
      </div>
    `;

    const chatUIHTML = `
      <div id="dw-header">
        <div id="dw-header-avatar">
          <img src="https://ui-avatars.com/api/?name=DW&background=128C7E&color=fff&bold=true" alt="avatar">
        </div>
        <div id="dw-header-info">
          <div id="dw-header-name">Digital Web</div>
          <div id="dw-header-status">
            <span id="dw-status-pulse"></span>
            <span id="dw-typing-status">متاحين دلوقتي</span>
          </div>
        </div>
        <button id="dw-close-btn"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
      </div>
      <div id="dw-messages-area">
        <div class="dw-date-divider"><span>اليوم</span></div>
        <div id="dw-welcome-msg">
          🔒 الرسائل محمية. فريق <strong>Digital Web</strong> هيرد عليك في أقرب وقت.
        </div>
        <div id="dw-typing" class="dw-msg-row admin">
          <div class="dw-bubble admin"><div class="dw-dot"></div><div class="dw-dot"></div><div class="dw-dot"></div></div>
        </div>
      </div>
      <div id="dw-input-bar">
        <button id="dw-send-btn">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
        <input id="dw-chat-input" type="text" placeholder="اكتب رسالة..." maxlength="500" autocomplete="off">
      </div>
    `;

    chatWindow.innerHTML = userRegistered ? chatUIHTML : regFormHTML;
    document.body.appendChild(chatWindow);

    // Setup events
    const btn = document.getElementById('dw-chat-btn');
    btn.addEventListener('click', toggleChat);

    chatWindow.addEventListener('click', e => {
      if (e.target.id === 'dw-close-btn' || e.target.closest('#dw-close-btn')) closeChat();
      if (e.target.id === 'dw-start-chat') submitReg();
    });

    chatWindow.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.activeElement.id === 'dw-chat-input') { e.preventDefault(); sendMsg(); }
    });

    document.getElementById('dw-send-btn')?.addEventListener('click', sendMsg);

    if (userRegistered) {
      // listen but don't render welcome again
      renderMessages();
    }

    function toggleChat() {
      isOpen ? closeChat() : openChat();
    }

    function openChat() {
      isOpen = true;
      chatWindow.classList.add('open');
      btn.classList.add('open');
      clearUnread();
      setTimeout(() => {
        document.getElementById('dw-chat-input')?.focus();
        scrollToBottom();
      }, 100);
    }

    function closeChat() {
      isOpen = false;
      chatWindow.classList.remove('open');
      btn.classList.remove('open');
    }

    function clearUnread() {
      unreadCount = 0;
      const badge = document.getElementById('dw-unread-badge');
      if (badge) badge.style.display = 'none';
    }

    function showUnread() {
      if (isOpen) return;
      unreadCount++;
      const badge = document.getElementById('dw-unread-badge');
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
      }
    }

    function startListening() {
      if (dbListenerStarted) return;
      dbListenerStarted = true;
      if (userInfo) {
        db.ref(`conversations/${sessionId}`).update({
          id: sessionId, name: userInfo.name, phone: userInfo.phone
        });
      }
      db.ref(`conversations/${sessionId}/messages`).on('child_added', snap => {
        const msg = snap.val();
        if (msg) {
          messages.push(msg);
          renderMessages();
          if (msg.from === 'admin') {
            showUnread();
            playPing();
          }
        }
      });
    }

    function submitReg() {
      const nameEl = document.getElementById('dw-name-input');
      const phoneEl = document.getElementById('dw-phone-input');
      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();
      if (!name) { nameEl.classList.add('error'); nameEl.focus(); return; }
      if (!phone || phone.length < 8) { phoneEl.classList.add('error'); phoneEl.focus(); return; }

      userInfo = { name, phone };
      localStorage.setItem('dw_user', JSON.stringify(userInfo));
      userRegistered = true;

      chatWindow.innerHTML = chatUIHTML;
      chatWindow.querySelector('#dw-close-btn').addEventListener('click', closeChat);
      chatWindow.querySelector('#dw-send-btn').addEventListener('click', sendMsg);
      chatWindow.querySelector('#dw-chat-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
      });

      startListening();
      scrollToBottom();
    }

    function sendMsg() {
      const input = document.getElementById('dw-chat-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const msg = { from: 'user', text, time: new Date().toISOString() };
      db.ref(`conversations/${sessionId}/messages`).push().set(msg);
      db.ref(`conversations/${sessionId}`).transaction(conv => {
        if (conv) { conv.unread = (conv.unread || 0) + 1; conv.lastSeen = msg.time; }
        return conv;
      });
    }

    function renderMessages() {
      const area = document.getElementById('dw-messages-area');
      if (!area) return;

      // Remove old message rows
      area.querySelectorAll('.dw-msg-row').forEach(el => {
        if (!el.id) el.remove(); // keep typing indicator which has no id set
      });

      const typing = document.getElementById('dw-typing');

      messages.forEach(m => {
        const row = document.createElement('div');
        row.className = `dw-msg-row ${m.from === 'user' ? 'user' : 'admin'}`;
        const tick = m.from === 'user' ? `<span class="dw-read-tick">✓✓</span>` : '';
        row.innerHTML = `
          <div class="dw-bubble ${m.from === 'user' ? 'user' : 'admin'}">
            ${escHtml(m.text)}
            <div class="dw-bubble-meta">
              <span class="dw-bubble-time">${formatTime(m.time)}</span>
              ${tick}
            </div>
          </div>`;
        area.insertBefore(row, typing || null);
      });

      scrollToBottom();
    }

    function scrollToBottom() {
      const area = document.getElementById('dw-messages-area');
      if (area) area.scrollTop = area.scrollHeight;
    }

    function playPing() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Notification sound like WhatsApp
        const o1 = ctx.createOscillator();
        const g = ctx.createGain();
        o1.connect(g); g.connect(ctx.destination);
        o1.type = 'sine';
        o1.frequency.setValueAtTime(1046, ctx.currentTime); // C6
        o1.frequency.setValueAtTime(1318, ctx.currentTime + 0.07); // E6
        o1.frequency.setValueAtTime(1568, ctx.currentTime + 0.14); // G6
        g.gain.setValueAtTime(0.35, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.5);
      } catch (_) {}
    }

    function escHtml(str) {
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function formatTime(iso) {
      try {
        return new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      } catch { return ''; }
    }

    // Register dwOpenChat globally for "Contact Us" button
    window.dwOpenChat = openChat;
  }
})();
