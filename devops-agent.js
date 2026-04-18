// Digital Web - DevOps AI Agent Logic

const da_domains = [
  { id:'general',  icon:'terminal', name:'عام',         desc:'أسئلة مفتوحة واستشارات',       color:'#00d4ff' },
  { id:'frontend', icon:'layout', name:'Frontend',    desc:'React, CSS, Perf',   color:'#00d4ff' },
  { id:'backend',  icon:'server', name:'Backend',     desc:'APIs, Microservices', color:'#00ff88' },
  { id:'database', icon:'database', name:'Database',    desc:'SQL, NoSQL, Redis',  color:'#ffaa00' },
  { id:'cloud',    icon:'cloud', name:'Cloud',       desc:'AWS, GCP, Azure',    color:'#00d4ff' },
  { id:'cicd',     icon:'git-merge', name:'CI/CD',       desc:'Pipelines, Deploy',  color:'#00ff88' },
  { id:'security', icon:'shield', name:'Security',    desc:'OWASP, IAM, Secrets',color:'#ff4455' },
  { id:'containers',icon:'box',name:'Containers',  desc:'Docker, K8s, Helm',  color:'#ffaa00' },
  { id:'monitoring',icon:'activity',name:'Monitoring',  desc:'Prometheus, Grafana', color:'#00d4ff' },
  { id:'networking',icon:'network',name:'Networking',  desc:'DNS, LB, VPC',       color:'#00ff88' },
  { id:'cdn',      icon:'zap', name:'CDN',         desc:'Cloudflare, Caching', color:'#ffaa00' },
  { id:'backup',   icon:'save', name:'Backup',      desc:'DR, RTO/RPO',        color:'#ff4455' },
];

const da_systemPrompts = {
  general:   'أنت Senior DevOps Engineer وFull-Stack Architect بخبرة +10 سنين. أجب بالعربي بشكل واضح وعملي. دائماً أعطِ كود شغال وعملي. اذكر البدائل والـ trade-offs. نبّه على الـ pitfalls الشائعة. فكر دائماً في الـ production readiness والـ security.',
  frontend:  'أنت Senior Frontend Engineer متخصص في React, Next.js, Vue, performance optimization, Core Web Vitals, CSS, Tailwind, و state management. أجب بالعربي مع كود عملي شغال. ركز على الـ performance والـ DX.',
  backend:   'أنت Senior Backend Engineer متخصص في Node.js, Python, Go, REST APIs, GraphQL, gRPC, microservices, message queues (Kafka/RabbitMQ), و system design. أجب بالعربي مع أمثلة حقيقية.',
  database:  'أنت Senior Database Engineer متخصص في PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, indexing, query optimization, sharding, و replication. أجب بالعربي مع كود SQL وشرح عملي.',
  cloud:     'أنت Senior Cloud Architect متخصص في AWS, GCP, Azure, Terraform, IaC, multi-region deployment, و cost optimization. أجب بالعربي مع architecture diagrams نصية وأمثلة Terraform.',
  cicd:      'أنت Senior DevOps Engineer متخصص في GitHub Actions, GitLab CI, Jenkins, ArgoCD, blue-green/canary deployments, و GitOps. أجب بالعربي مع YAML configs حقيقية.',
  security:  'أنت Senior Security Engineer متخصص في OWASP, secrets management, IAM, RBAC, SSL/TLS, vulnerability scanning, و Zero Trust. أجب بالعربي مع تطبيق عملي وأمثلة.',
  containers:'أنت Senior Kubernetes & Docker Expert متخصص في multi-stage builds, K8s orchestration, Helm, service mesh, و container security. أجب بالعربي مع Dockerfiles وK8s manifests.',
  monitoring:'أنت Senior SRE متخصص في Prometheus, Grafana, ELK Stack, OpenTelemetry, SLOs/SLAs, error budgets, و incident response. أجب بالعربي مع configs حقيقية.',
  networking:'أنت Senior Network Engineer متخصص في DNS, load balancing, VPC, firewalls, Nginx/Traefik, و network security. أجب بالعربي مع أمثلة config حقيقية.',
  cdn:       'أنت Senior Performance Engineer متخصص في Cloudflare, CloudFront, caching strategies, edge computing, image optimization, و web performance. أجب بالعربي.',
  backup:    'أنت Senior Site Reliability Engineer متخصص في backup strategies, disaster recovery, RTO/RPO, database replication, و chaos engineering. أجب بالعربي مع خطط عملية.',
};

const da_quickSuggestions = {
  general:   ['ايه الفرق بين REST و GraphQL؟','ازاي أعمل high availability system؟','معايير الـ production-ready app؟'],
  frontend:  ['ازاي أحسن Core Web Vitals؟','الفرق بين SSR و CSR و SSG؟','ازاي أعمل code splitting صح؟'],
  backend:   ['ازاي أعمل rate limiting؟','الفرق بين monolith و microservices؟','ازاي أعمل idempotent API؟'],
  database:  ['ازاي أعمل database indexing؟','الفرق بين SQL و NoSQL؟','ازاي أحل N+1 problem؟'],
  cloud:     ['الفرق بين EC2 و Lambda؟','ازاي أعمل multi-region؟','Terraform أو Pulumi؟'],
  cicd:      ['ازاي أعمل zero-downtime deployment؟','blue-green vs canary؟','ازاي أأمن secrets في CI؟'],
  security:  ['ازاي أحمي API من attacks؟','ايه هو Zero Trust؟','ازاي أعمل secrets rotation؟'],
  containers:['ازاي أعمل multi-stage Dockerfile؟','K8s vs Docker Swarm؟','ازاي أعمل pod autoscaling؟'],
  monitoring:['ازاي أعمل alerting صح؟','الفرق بين metrics و logs و traces؟','ازاي أعمل SLO؟'],
  networking:['الفرق بين L4 و L7 load balancer؟','ازاي أعمل VPC peering؟','DNS propagation بيشتغل ازاي؟'],
  cdn:       ['ازاي أعمل cache invalidation؟','الفرق بين push و pull CDN؟','edge functions إيه هي؟'],
  backup:    ['الفرق بين RTO و RPO؟','ازاي أعمل database backup strategy؟','3-2-1 rule إيه معناها؟'],
};

const da_welcomeCards = [
  { icon:'git-merge', text:'ازاي أبني CI/CD pipeline كامل؟' },
  { icon:'shield-check', text:'ازاي أأمن الـ API بتاعتي بقوة؟' },
  { icon:'box', text:'ازاي أعمل Docker multi-stage build؟' },
  { icon:'cloud', text:'كود Infrastructure بـ Terraform لبيئة AWS.' },
];

let da_currentDomain = 'general';
let da_chatHistory = [];
let da_isLoading = false;

function initDevopsAgent() {
  const domainList = document.getElementById('da-domainList');
  if(!domainList) return;
  domainList.innerHTML = '';
  da_domains.forEach(d => {
    const el = document.createElement('div');
    el.className = 'da-domain-item' + (d.id === 'general' ? ' active' : '');
    el.dataset.id = d.id;
    el.innerHTML = `<span class="da-d-icon"><i data-lucide="${d.icon}"></i></span><span class="da-d-name">${d.name}</span>`;
    el.onclick = () => da_selectDomain(d.id);
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

function da_selectDomain(id) {
  da_currentDomain = id;
  document.querySelectorAll('.da-domain-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  const d = da_domains.find(x => x.id === id);
  document.getElementById('da-domainBadge').textContent = d.name;
  document.getElementById('da-domainDesc').textContent = d.desc;
  da_renderQuick();
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
  const msgs = document.getElementById('da-messages');
  msgs.innerHTML = '';
  const welcome = document.createElement('div');
  welcome.className = 'da-welcome';
  welcome.id = 'da-welcome';
  welcome.innerHTML = `
    <div class="da-welcome-icon"><i data-lucide="terminal-square"></i></div>
    <div class="da-welcome-title">DevOps AI Agent</div>
    <div class="da-welcome-sub">المساعد التقني الشامل. جاهز لتصميم، نشر، وإدارة أكوادك وبنيتك التحتية بأقصى كفاءة.</div>
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
      <span style="font-size:11px; margin-right:8px; color:#94a3b8; font-family:'JetBrains Mono', monospace;">PROCESSING...</span>
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

  input.value = '';
  input.style.height = 'auto';
  da_isLoading = true;
  document.getElementById('da-sendBtn').disabled = true;

  da_addMsg('user', text);
  da_chatHistory.push({ role: 'user', content: text });
  da_showThinking();

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: da_systemPrompts[da_currentDomain] + '\n\nكن واضحاً ومختصراً. استخدم code blocks للكود. لا تطول بدون فائدة.',
        messages: da_chatHistory
      })
    });
    const data = await resp.json();
    da_hideThinking();
    const reply = data.content?.[0]?.text || 'تم قطع الاتصال. تأكد من إعدادات الـ CROS أو الـ API Key في البيئة المحلية.';
    da_chatHistory.push({ role: 'assistant', content: reply });
    if (da_chatHistory.length > 30) da_chatHistory = da_chatHistory.slice(-30);
    da_addMsg('ai', reply);
  } catch (e) {
    da_hideThinking();
    da_addMsg('ai', 'لم يتم العثور على Endpoint مفعل أو توقفت الخدمة بشكل طارئ. يٌرجى التحقق من الشبكة.');
  }

  da_isLoading = false;
  document.getElementById('da-sendBtn').disabled = false;
  input.focus();
}

// Load it when DOM is ready
document.addEventListener('DOMContentLoaded', initDevopsAgent);
