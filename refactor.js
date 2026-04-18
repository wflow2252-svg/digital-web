const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Split into lines
let lines = html.split('\n');

// Find the start of AI Studio section and the start of Contact section  
let aiStudioStart = -1;
let contactStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<!-- AI Studio Section -->')) aiStudioStart = i;
  if (lines[i].includes('<!-- Contact Section -->')) { contactStart = i; break; }
}

console.log('AI Studio starts at line:', aiStudioStart + 1);
console.log('Contact starts at line:', contactStart + 1);

if (aiStudioStart === -1 || contactStart === -1) {
  console.log('ERROR: Could not find markers!');
  process.exit(1);
}

const newSection = `        <!-- AI Studio Section -->
        <section id="ai-studio">
            <div class="da-container animate-in" data-stagger="1" style="width:90%; max-width:920px; margin:0 auto; height:calc(100vh - 140px);">
                <div class="da-main" style="border-radius:24px; overflow:hidden;">
                  <div class="da-topbar">
                    <div class="da-domain-title">
                      <span class="da-domain-badge">AI Studio</span>
                      <span class="da-domain-desc">صف فكرتك وسنبني موقعك فورًا • تجربة مجانية (4 رسائل)</span>
                    </div>
                    <div>
                      <button class="da-clear-btn" onclick="da_clearChat()">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i> مسح
                      </button>
                    </div>
                  </div>
                  <div class="da-messages" id="da-messages">
                    <div class="da-welcome" id="da-welcome">
                      <div class="da-welcome-icon"><i data-lucide="wand-2"></i></div>
                      <div class="da-welcome-title">AI Studio | مولّد المواقع</div>
                      <div class="da-welcome-sub">صف فكرة موقعك وسيبنيه لك الذكاء الاصطناعي كاملاً — كود HTML احترافي جاهز للنشر. رصيدك المجاني: 4 رسائل.</div>
                      <div class="da-welcome-grid" id="da-welcomeGrid"></div>
                    </div>
                  </div>
                  <div class="da-quick-area" id="da-quickArea"></div>
                  <div class="da-input-area">
                    <div class="da-input-wrap">
                      <textarea id="da-userInput" placeholder="مثال: موقع لمطعم راقي باللون الذهبي والأسود..." rows="1"
                        onkeydown="da_handleKey(event)" oninput="da_autoResize(this)"></textarea>
                      <button class="da-send-btn" id="da-sendBtn" onclick="da_sendMsg()">
                        <i data-lucide="send" style="width:18px;height:18px;"></i>
                      </button>
                    </div>
                    <div class="da-input-hint">Enter للإرسال • Shift+Enter لسطر جديد • رصيد مجاني: 4 رسائل</div>
                  </div>
                </div>
            </div>
        </section>

        `;

// Replace from aiStudioStart to contactStart
const before = lines.slice(0, aiStudioStart).join('\n');
const after = lines.slice(contactStart).join('\n');

const result = before + '\n' + newSection + after;
fs.writeFileSync('index.html', result);
console.log('SUCCESS: AI Studio replaced cleanly!');
