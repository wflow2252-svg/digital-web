// Digital Web - Chat Widget (WhatsApp-Style Realistic Design)
(function () {
  let sessionId = localStorage.getItem('dw_session');
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('dw_session', sessionId);
  }

  let userInfo = JSON.parse(localStorage.getItem('dw_user') || 'null');

  // Load External Scripts
  const scripts = [
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js',
    'https://cdn.socket.io/4.7.2/socket.io.min.js'
  ];

  let loadedCount = 0;
  scripts.forEach(src => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => {
      loadedCount++;
      if (loadedCount === scripts.length) initChat();
    };
    document.head.appendChild(s);
  });

  function initChat() {
    const firebaseConfig = {
      apiKey: "AIzaSyDooOAEk-xqZ57SeqN9YMlNSvvy5w454mg",
      projectId: "chat-75d30",
      databaseURL: "https://chat-75d30-default-rtdb.firebaseio.com",
      storageBucket: "chat-75d30.appspot.com"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const storage = firebase.storage();
    
    // AI Server Connection (Socket.io)
    const socket = io('http://localhost:3000'); // Use absolute URL for the scratch server
    socket.on('connect', () => console.log('✅ Connected to Smart AI Server'));
    socket.on('web:reply', (msg) => {
        // If it's an AI message, it might already be in Firebase or handled separately
        // For "Scratch" feel, we'll let the server handle responses
    });

    let isOpen = false;
    let messages = [];
    let userRegistered = !!userInfo;
    let dbListenerStarted = false;
    let unreadCount = 0;

    // Media Recording Variables
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    if (userRegistered) { startListening(); }

    // ===================== CSS =====================
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');

      #dw-fab-wrapper { display: none !important; }

      #dw-chat-btn {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(145deg, var(--accent, #3b82f6), #2563eb);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(59,130,246,0.5), 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        outline: none;
      }
      #dw-chat-btn:hover { transform: scale(1.08); box-shadow: 0 8px 30px rgba(59,130,246,0.6), 0 4px 12px rgba(0,0,0,0.3); }
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
        position: relative;
        width: 100%;
        height: 500px;
        max-width: 100%;
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
        z-index: 10;
        background: rgba(10, 10, 10, 0.4);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        opacity: 1; /* Always visible in embed */
        pointer-events: all;
        user-select: none;
        -webkit-user-select: none;
      }

      @media (max-width: 640px) {
        #dw-chat-window {
            height: 100%;
            min-height: 520px;
            border-radius: 16px;
        }
        #dw-header {
            padding: 15px 20px !important;
        }
        .dw-reg-hello {
            padding: 10px !important;
            margin-bottom: 15px;
        }
        .dw-form-group {
            margin-bottom: 12px;
        }
        .msg-bubble {
            max-width: 90% !important;
            font-size: 13px !important;
        }
      }

      #dw-chat-window.open {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0) scale(1);
      }

      /* HEADER */
      #dw-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 18px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
      #dw-close-btn { display: none !important; }

      /* WALLPAPER */
      #dw-messages-area {
        flex: 1;
        overflow-y: auto;
        padding: 12px 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: transparent;
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
      #dw-welcome-msg strong { color: #3b82f6; }

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
        background: #3b82f6;
        color: white;
        border-radius: 12px 12px 4px 12px;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
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
        border-color: transparent transparent #3b82f6 transparent;
      }
      /* Admin bubble = white */
      .dw-bubble.admin {
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px 12px 12px 4px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      .dw-bubble.admin.is-ai {
        border-color: var(--accent);
        background: rgba(59, 130, 246, 0.05);
      }
      .dw-ai-badge {
        font-size: 9px;
        background: var(--accent);
        color: white;
        padding: 1px 4px;
        border-radius: 4px;
        margin-left: 6px;
        font-weight: 800;
        vertical-align: middle;
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
        background: transparent;
        flex: 1;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 13px;
        overflow-y: auto;
      }
      .dw-reg-hello {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 10px;
        padding: 14px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
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
      .dw-form-label { color: #3b82f6; font-size: 12px; font-weight: 700; }
      .dw-form-input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 11px 14px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        color: white;
        direction: rtl;
        outline: none;
        transition: 0.2s;
        width: 100%;
        box-sizing: border-box;
      }
      .dw-form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      .dw-form-input::placeholder { color: #aaa; }
      .dw-form-input.error { border-color: #FF3B30; }

      .dw-start-btn {
        background: linear-gradient(135deg, #3b82f6, #1e3a8a);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 13px;
        font-family: 'Cairo', sans-serif;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s;
        box-shadow: 0 3px 12px rgba(59,130,246,0.35);
      }
      .dw-start-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(59,130,246,0.45); }
      .dw-form-privacy { text-align: center; color: #aaa; font-size: 11px; }

      /* INPUT AREA */
      #dw-input-bar {
        background: rgba(0, 0, 0, 0.2);
        padding: 12px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      #dw-chat-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 10px 16px;
        font-family: 'Cairo', sans-serif;
        font-size: 14px;
        color: white;
        direction: rtl;
        outline: none;
        resize: none;
        line-height: 1.4;
      }
      #dw-chat-input::placeholder { color: #aaa; }

      #dw-send-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1e3a8a);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: 0.2s;
        box-shadow: 0 2px 8px rgba(59,130,246,0.4);
      }
      #dw-send-btn:hover { transform: scale(1.08); }
      #dw-send-btn svg { width: 20px; height: 20px; fill: white; }

      .dw-icon-btn {
        background: none;
        border: none;
        color: rgba(255,255,255,0.6);
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
        border-radius: 50%;
      }
      .dw-icon-btn:hover { background: rgba(255,255,255,0.05); color: white; }
      .dw-icon-btn.active { color: #ff3b30; animation: dw-pulse 1.5s infinite; }
      @keyframes dw-pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

      .dw-media-bubble img, .dw-media-bubble video {
        max-width: 100%;
        border-radius: 12px;
        display: block;
        cursor: pointer;
      }
      .dw-audio-player {
        min-width: 200px;
        height: 40px;
      }

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
    // FAB Removed

    const chatWindow = document.createElement('div');
    chatWindow.id = 'dw-chat-window';

    const regFormHTML = `
      <div id="dw-header">
        <div id="dw-header-info">
          <div id="dw-header-name">Start Conversation</div>
          <div id="dw-header-status">
            <span id="dw-status-pulse"></span>
            <span>Online Now</span>
          </div>
        </div>
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
        <div id="dw-header-info">
          <div id="dw-header-name">Digital Web AI <span class="dw-ai-badge">SMART</span></div>
          <div id="dw-header-status">
            <span id="dw-status-pulse" style="background: #3b82f6; box-shadow: 0 0 10px #3b82f6;"></span>
            <span id="dw-typing-status">AI Assistant Active</span>
          </div>
        </div>
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
        <input id="dw-chat-input" type="text" placeholder="اكتب رسالة..." maxlength="500" autocomplete="off">
        <button id="dw-send-btn">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;

    // Setup events
    const btn = document.getElementById('dw-chat-btn');
    if (btn) btn.addEventListener('click', toggleChat);

    chatWindow.addEventListener('click', e => {
      if (e.target.id === 'dw-close-btn' || e.target.closest('#dw-close-btn')) closeChat();
      if (e.target.id === 'dw-start-chat' || e.target.closest('#dw-start-chat')) submitReg();
    });

    chatWindow.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.activeElement.id === 'dw-chat-input') { e.preventDefault(); sendMsg(); }
    });

    document.getElementById('dw-send-btn')?.addEventListener('click', sendMsg);

    chatWindow.innerHTML = userRegistered ? chatUIHTML : regFormHTML;
    if (userRegistered) setupChatListeners();
    
    const embedContainer = document.getElementById('dw-chat-embed');
    if (embedContainer) {
      embedContainer.appendChild(chatWindow);
      openChat(); // Working now because btn is initialized
    } else {
      document.body.appendChild(chatWindow);
    }

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
      if (btn) btn.classList.add('open');
      clearUnread();
      setTimeout(() => {
        document.getElementById('dw-chat-input')?.focus();
        scrollToBottom();
      }, 100);
    }

    function setupChatListeners() {
      const sendBtn = chatWindow.querySelector('#dw-send-btn');
      if (sendBtn) sendBtn.addEventListener('click', sendMsg);
      const chatInp = chatWindow.querySelector('#dw-chat-input');
      if (chatInp) chatInp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
      });
      
      // Media Listeners
      chatWindow.querySelector('#dw-attach-btn')?.addEventListener('click', () => chatWindow.querySelector('#dw-media-input').click());
      chatWindow.querySelector('#dw-media-input')?.addEventListener('change', handleMediaSelect);
      chatWindow.querySelector('#dw-mic-btn')?.addEventListener('click', toggleMic);
    }

    function closeChat() {
      isOpen = false;
      chatWindow.classList.remove('open');
      if (btn) btn.classList.remove('open');
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

    // Media Handlers
    function handleMediaSelect(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      uploadAndSend(file, type);
      e.target.value = ''; // Reset
    }

    async function toggleMic() {
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    }

    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          uploadAndSend(audioBlob, 'voice');
          stream.getTracks().forEach(t => t.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        document.getElementById('dw-mic-btn').classList.add('active');
      } catch (err) {
        alert('تحتاج إذن الميكروفون لتسجيل الصوت');
      }
    }

    function stopRecording() {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        document.getElementById('dw-mic-btn').classList.remove('active');
      }
    }

    function uploadAndSend(file, type) {
      const ext = type === 'voice' ? 'webm' : file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${ext}`;
      const path = `chats/${sessionId}/${fileName}`;
      const ref = storage.ref(path);
      
      // Temporary "Uploading" indicator
      const tempId = 'temp_' + Date.now();
      messages.push({ from: 'user', text: type === 'image' ? 'جاري رفع صورة...' : (type === 'video' ? 'جاري رفع فيديو...' : 'جاري رفع صوت...'), time: new Date().toISOString(), tempId });
      renderMessages();

      console.log('Starting upload to:', path);
      
      const uploadTask = ref.put(file);
      
      // Auto-timeout after 40 seconds
      const timeout = setTimeout(() => {
        console.error('Upload timeout for:', path);
        alert('المشكلة لسه مستمرة؟ غالباً دي محتاجة تعديل الـ Rules في Firebase Storage لـ Public.');
        messages = messages.filter(m => m.tempId !== tempId);
        renderMessages();
      }, 40000);

      uploadTask.then(async snapshot => {
        clearTimeout(timeout);
        console.log('Upload successful for:', path);
        const url = await ref.getDownloadURL();
        const msg = { from: 'user', type, content: url, time: new Date().toISOString() };
        db.ref(`conversations/${sessionId}/messages`).push().set(msg);
        
        // Remove temp message
        messages = messages.filter(m => m.tempId !== tempId);
        renderMessages();
      }).catch(err => {
        clearTimeout(timeout);
        console.error('Upload error detail:', err);
        alert('خطأ في الرفع: ' + err.message + '\nتأكد إنك مفعل الـ Storage ومخلي الـ Rules تسمح بالـ Write.');
        messages = messages.filter(m => m.tempId !== tempId);
        renderMessages();
      });
    }

    function submitReg() {
      const nameEl = document.getElementById('dw-name-input');
      const phoneEl = document.getElementById('dw-phone-input');
      const name = nameEl.value.trim();
      const phone = phoneEl.value.trim();

      // Admin Login Check
      if (name === 'hazemelsayed2252' && phone === '01200969689') {
          window.location.href = 'admin.html';
          return;
      }

      if (!name) { nameEl.classList.add('error'); nameEl.focus(); return; }
      if (!phone || phone.length < 8) { phoneEl.classList.add('error'); phoneEl.focus(); return; }

      userInfo = { name, phone };
      localStorage.setItem('dw_user', JSON.stringify(userInfo));
      userRegistered = true;

      chatWindow.innerHTML = chatUIHTML;
      setupChatListeners();

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
      
      // CLIENT-SIDE AI FALLBACK (Scratch AI)
      if (typeof handleAIQuery === 'function') {
          const aiResponse = handleAIQuery(text);
          if (aiResponse) {
              setTimeout(() => {
                  const aiMsg = {
                      from: 'admin',
                      text: aiResponse,
                      isAi: true,
                      time: new Date().toISOString()
                  };
                  db.ref(`conversations/${sessionId}/messages`).push().set(aiMsg);
              }, 1000);
          }
      }

      db.ref(`conversations/${sessionId}`).transaction(conv => {
        if (conv) { conv.unread = (conv.unread || 0) + 1; conv.lastSeen = msg.time; }
        return conv;
      });
    }

    // AI Logic (Duplicate from server for scratch feel)
    const PROJECT_KNOWLEDGE = {
        'ai': 'مشروع AI Vision Dashboard هو منصة لتحليل البيانات البصرية باستخدام الذكاء الاصطناعي مع واجهة عصرية وسرعة استجابة فائقة.',
        'عطور': 'متجر Luxe Scents هو منصة تجارة إلكترونية فاخرة مخصصة للعطور، تركز على تجربة المستخدم الراقية والتصميم الأنيق.',
        'saas': 'NextGen SaaS هي واجهة مستقبلية مصممة للشركات التقنية التي تحتاج إلى سرعة في الأداء ونمو متسارع.',
        'عقارات': 'Estate Elite هو بوابة عقارية فاخرة تتيح تصفح العقارات الراقية بأسلوب عصري وجذاب.',
        'بنك': 'Luxe Banking هو تطبيق Fintech يعيد تعريف التعاملات المالية بلمسة فنية وتجربة مستخدم فريدة.',
        'موضة': 'Urban Trend هو متجر ملابس شبابي يركز على الموضة العصرية والقطع النادرة بتصميم فريد.',
        'خدمات': 'نقدم خدمات تطوير الويب، تطبيقات الموبايل، تصميم تجربة المستخدم (UI/UX)، وحلول الذكاء الاصطناعي المخصصة.'
    };

    function handleAIQuery(text) {
        const input = text.toLowerCase();
        for (const [key, info] of Object.entries(PROJECT_KNOWLEDGE)) {
            if (input.includes(key)) return info;
        }
        if (input.includes('سعر') || input.includes('تكلفة')) return 'التكلفة تعتمد على حجم المشروع. حابب نحسبلك عرض سعر لمشروعك؟';
        if (input.includes('من انت') || input.includes('مين')) return 'أنا الذكاء الاصطناعي الخاص بـ Digital Web، ومهمتي أساعدك تفهم أعمالنا وتختار الأنسب ليك.';
        return null; // Return null to let the server or admin handle it if no match
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
        
        let contentHTML = escHtml(m.text || '');
        if (m.type === 'image') {
          contentHTML = `<div class="dw-media-bubble"><img src="${m.content}" onclick="window.open('${m.content}')"></div>`;
        } else if (m.type === 'video') {
          contentHTML = `<div class="dw-media-bubble"><video src="${m.content}" controls></video></div>`;
        } else if (m.type === 'voice') {
          contentHTML = `<div class="dw-media-bubble"><audio src="${m.content}" controls class="dw-audio-player"></audio></div>`;
        }

        row.innerHTML = `
          <div class="dw-bubble ${m.from === 'user' ? 'user' : 'admin'}">
            ${contentHTML}
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
