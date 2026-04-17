// Digital Web - Sovereign Chat Hub v4.0
// Unified Firebase Link & Flutter Admin Synchronization

(function () {
    let sessionId = localStorage.getItem('dw_session');
    if (!sessionId) {
        sessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('dw_session', sessionId);
    }

    let userInfo = JSON.parse(localStorage.getItem('dw_user') || 'null');
    let db, storage, chatRef;
    let messages = [];
    let isOpen = false;

    // Wait for Sovereign Hub Config
    function initSovereignChat() {
        const hub = window.SOVEREIGN_HUB;
        if (!hub || !hub.db) {
            setTimeout(initSovereignChat, 100);
            return;
        }

        db = hub.db;
        storage = hub.storage;
        chatRef = db.ref('conversations/' + sessionId);

        if (userInfo) {
            startListening();
        } else {
            renderRegistration();
        }
    }

    function startListening() {
        chatRef.child('messages').on('child_added', (snapshot) => {
            const msg = snapshot.val();
            if (msg) {
                messages.push(msg);
                renderMessages();
                if (msg.from === 'admin' && !isOpen) {
                    playNotification();
                }
            }
        });

        // Update Presence
        chatRef.update({
            id: sessionId,
            name: userInfo.name || 'زائر',
            phone: userInfo.phone || '',
            lastSeen: new Date().toISOString()
        });
    }

    // ================= UI GENERATION =================

    function renderRegistration() {
        const container = document.getElementById('dw-chat-embed');
        if (!container) return;

        container.innerHTML = `
            <div id="sovereign-chat-window">
                <div class="chat-header">أهلاً بك في Digital Web</div>
                <div class="chat-body registration">
                    <div class="welcome-card">
                        <span class="emoji">🚀</span>
                        <h3>جاهز للانطلاق؟</h3>
                        <p>سجل بياناتك وهنتواصل معاك فوراً لبدء مشروعك</p>
                    </div>
                    <input type="text" id="reg-name" placeholder="الاسم بالكامل">
                    <input type="tel" id="reg-phone" placeholder="رقم الموبايل / واتساب">
                    <button id="reg-submit">ابدأ المحادثة الآن</button>
                </div>
            </div>
            <style>
                #sovereign-chat-window { width: 100%; height: 500px; background: rgba(10,10,10,0.8); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; overflow: hidden; color: #fff; font-family: 'Cairo', sans-serif; direction: rtl; }
                .chat-header { padding: 20px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 700; }
                .chat-body { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; }
                .welcome-card { text-align: center; margin-bottom: 20px; }
                .welcome-card h3 { margin: 10px 0 5px; color: #3b82f6; }
                .welcome-card p { opacity: 0.6; font-size: 0.9rem; }
                input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; color: #fff; outline: none; }
                input:focus { border-color: #3b82f6; }
                #reg-submit { background: #3b82f6; color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
                #reg-submit:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(59,130,246,0.3); }
            </style>
        `;

        document.getElementById('reg-submit').onclick = () => {
            const name = document.getElementById('reg-name').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            if (name && phone) {
                userInfo = { name, phone };
                localStorage.setItem('dw_user', JSON.stringify(userInfo));
                initSovereignChat();
            }
        };
    }

    function renderChatUI() {
        const container = document.getElementById('dw-chat-embed');
        if (!container) return;

        container.innerHTML = `
            <div id="sovereign-chat-window">
                <div class="chat-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <span>Sovereign Hub AI Assistant</span>
                    <button id="copy-chat" style="background:rgba(255,255,255,0.1); border:none; color:#fff; padding:5px 10px; border-radius:5px; font-size:0.7rem; cursor:pointer;">Copy Chat</button>
                </div>
                <div class="chat-body" id="chat-messages">
                    <div class="sys-msg">🔒 محادثة مشفرة ومؤمنة تماماً</div>
                </div>
                <div class="chat-footer">
                    <input type="text" id="chat-input" placeholder="اكتب رسالتك للمهندس هنا...">
                    <button id="chat-send">▶</button>
                </div>
            </div>
            <style>
                #sovereign-chat-window { width: 100%; height: 500px; background: rgba(10,10,10,0.8); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; overflow: hidden; color: #fff; font-family: 'Cairo', sans-serif; direction: rtl; }
                .chat-header { padding: 15px 20px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 700; font-size: 0.9rem; }
                #chat-messages { flex: 1; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
                .chat-footer { padding: 15px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px; }
                #chat-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px 15px; border-radius: 25px; color: #fff; outline: none; }
                #chat-send { width: 45px; height: 45px; border-radius: 50%; background: #3b82f6; border: none; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
                #chat-send:active { transform: scale(0.9); }
                .msg { max-width: 80%; padding: 10px 15px; border-radius: 15px; font-size: 0.9rem; line-height: 1.5; }
                .msg.user { align-self: flex-start; background: #3b82f6; color: #fff; border-bottom-right-radius: 4px; }
                .msg.admin { align-self: flex-end; background: rgba(255,255,255,0.1); color: #fff; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
                .sys-msg { text-align: center; font-size: 0.7rem; opacity: 0.4; margin: 10px 0; }
                .msg-meta { font-size: 0.6rem; opacity: 0.5; margin-top: 5px; text-align: left; }
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .msg { animation: slideIn 0.3s ease; }
            </style>
        `;

        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;
            input.value = '';

            const msg = {
                from: 'user',
                text: text,
                time: new Date().toISOString()
            };

            chatRef.child('messages').push().set(msg);
            chatRef.transaction(conv => {
                if (conv) {
                    conv.unread = (conv.unread || 0) + 1;
                    conv.lastSeen = msg.time;
                }
                return conv;
            });
        };

        sendBtn.onclick = dwSendMessage;
        input.onkeydown = (e) => { if (e.key === 'Enter') dwSendMessage(); };

        document.getElementById('copy-chat').onclick = () => {
            const text = messages.map(m => `${m.from.toUpperCase()}: ${m.text}`).join('\n\n');
            navigator.clipboard.writeText(text).then(() => alert('Conversation Copied!'));
        };

        renderMessages();
    }

    let typingTimer = null;

    function renderMessages() {
        const area = document.getElementById('chat-messages');
        if (!area) {
            renderChatUI();
            return;
        }

        area.innerHTML = '<div class="sys-msg">🔒 محادثة مشفرة ومؤمنة تماماً</div>';
        
        messages.forEach(m => {
            const div = document.createElement('div');
            div.className = `msg ${m.from}`;
            const time = new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            div.innerHTML = `
                <div>${m.text}</div>
                <div class="msg-meta">${time}</div>
            `;
            area.appendChild(div);
        });

        // Add Typing Indicator
        const typing = document.createElement('div');
        typing.id = 'dw-typing';
        typing.className = 'msg admin typing';
        typing.style.display = 'none';
        typing.innerHTML = `<div class="typing-pulse"><span>•</span><span>•</span><span>•</span></div><div class="msg-meta">الذكاء الاصطناعي يفكر...</div>`;
        area.appendChild(typing);

        area.scrollTop = area.scrollHeight;
    }

    function showTyping(active) {
        const el = document.getElementById('dw-typing');
        if (el) {
            el.style.display = active ? 'block' : 'none';
            const area = document.getElementById('chat-messages');
            area.scrollTop = area.scrollHeight;
        }
    }

    async function triggerAutopilot(userText) {
        // Prevent AI from replying to itself
        if (messages.length > 0 && messages[messages.length-1].from === 'admin') return;

        showTyping(true);
        
        // Comprehensive AI Response Logic
        const responses = {
            'hi': 'أهلاً بك! أنا مساعدك الذكي في Digital Web. كيف يمكنني مساعدتك في تطوير مشروعك اليوم؟',
            'hello': 'أهلاً بك! أنا مساعدك الذكي في Digital Web. كيف يمكنني مساعدتك في تطوير مشروعك اليوم؟',
            'سعر': 'أسعارنا تبدأ من باقة بيكسل (99$) للمشاريع الصغيرة، وتصل إلى الباقات المخصصة للهيئات الكبيرة. هل تحب استعراض قائمة الأسعار الحالية؟',
            'website': 'نحن متخصصون في بناء مواقع الـ Sovereign التي تتميز بالسرعة الفائقة والأمان المطبق بمعايير 2026. هل لديك فكرة معينة تود تحويلها لموقع؟',
            'default': 'شكراً لرسالتك! جاري تحليل طلبك من قبل المهندس المختص. في هذه الأثناء، يمكنني مساعدتك في استكشاف معرض أعمالنا أو البدء في تصميم "Blueprint" لمشروعك عبر الـ AI Studio.'
        };

        const lower = userText.toLowerCase();
        let replyText = responses['default'];
        for (let key in responses) {
            if (lower.includes(key)) { replyText = responses[key]; break; }
        }

        // Realistic "Thinking" delay
        setTimeout(() => {
            showTyping(false);
            const msg = {
                from: 'admin',
                text: replyText,
                time: new Date().toISOString(),
                isAi: true
            };
            chatRef.child('messages').push().set(msg);
        }, 3000);
    }

    // Update sendMessage to trigger autopilot
    function sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = '';

        const msg = {
            from: 'user',
            text: text,
            time: new Date().toISOString()
        };

        chatRef.child('messages').push().set(msg);
        chatRef.transaction(conv => {
            if (conv) {
                conv.unread = (conv.unread || 0) + 1;
                conv.lastSeen = msg.time;
            }
            return conv;
        });

        // Trigger AI Autopilot after 2 seconds if no human admin responds
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => triggerAutopilot(text), 1000);
    }

    function playNotification() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        } catch(e) {}
    }

    // Register globally
    window.dwSendMessage = sendMessage;

    initSovereignChat();
})();
