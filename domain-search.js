// ===== DOMAIN SEARCH JS =====
function tryExample(name) {
  document.getElementById('domain-input').value = name;
  searchDomain();
}

document.getElementById('domain-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchDomain();
});

async function searchDomain() {
  const input = document.getElementById('domain-input');
  const raw = input.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!raw) { input.focus(); return; }

  const resultsDiv = document.getElementById('domain-results');
  const loadingDiv = document.getElementById('domain-loading');
  const gridDiv = document.getElementById('domain-grid');

  resultsDiv.style.display = 'block';
  loadingDiv.style.display = 'block';
  gridDiv.innerHTML = '';

  try {
    const res = await fetch(`/api/check-domain?domain=${encodeURIComponent(raw)}`);
    const data = await res.json();
    loadingDiv.style.display = 'none';
    renderResults(data);
  } catch (err) {
    loadingDiv.style.display = 'none';
    gridDiv.innerHTML = `<div style="text-align:center;color:#ff6b6b;padding:2rem;">حصل خطأ، حاول تاني بعد شوية 🙁</div>`;
  }
}

function renderResults(data) {
  const grid = document.getElementById('domain-grid');
  if (!data.results || data.results.length === 0) {
    grid.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:2rem;">مفيش نتائج</div>';
    return;
  }

  grid.innerHTML = data.results.map(r => {
    if (r.available === null) return '';
    const available = r.available;
    return `
      <div class="domain-card glassmorphism ${available ? 'available' : 'taken'}">
        <div class="domain-name">
          <span class="domain-text">${r.domain}</span>
          <span class="domain-badge ${available ? 'badge-available' : 'badge-taken'}">
            ${available ? '✅ متاح' : '❌ محجوز'}
          </span>
        </div>
        ${available && r.price ? `
          <div class="domain-price">
            <span class="price-egp">${r.price.egp} جنيه / سنة</span>
            <span class="price-usd">≈ $${r.price.usd}</span>
          </div>
          <button class="domain-order-btn" onclick="orderDomain('${r.domain}')">
            احجز دلوقتي 🚀
          </button>
        ` : available ? `
          <button class="domain-order-btn" onclick="orderDomain('${r.domain}')">
            احجز دلوقتي 🚀
          </button>
        ` : `
          <div class="domain-taken-msg">اختار امتداد تاني 👆</div>
        `}
      </div>
    `;
  }).join('');
}

function orderDomain(domain) {
  if (window.dwOpenChat) {
    window.dwOpenChat();
    setTimeout(() => {
      const input = document.getElementById('dw-chat-input');
      if (input) {
        input.value = `عايز احجز الدومين: ${domain}`;
        input.focus();
      }
    }, 500);
  }
}
