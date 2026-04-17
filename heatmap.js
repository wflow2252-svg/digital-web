/**
 * Digital Web - Neural Heatmap Engine
 * Tracks user interactions and renders a high-performance visual overlay.
 */
(function() {
    let heatmapData = JSON.parse(localStorage.getItem('dw-heatmap-data')) || [];
    let isAnalyticsMode = false;
    let canvas, ctx;

    function initHeatmap() {
        // Track Clicks
        document.addEventListener('mousedown', (e) => {
            const point = {
                x: e.pageX,
                y: e.pageY,
                t: Date.now()
            };
            heatmapData.push(point);
            
            // Limit data to last 1000 points for performance
            if (heatmapData.length > 1000) heatmapData.shift();
            
            localStorage.setItem('dw-heatmap-data', JSON.stringify(heatmapData));
            
            if (isAnalyticsMode) renderHeatmap();
        });

        // Add Toggle UI
        injectToggle();
    }

    function injectToggle() {
        const toggle = document.createElement('div');
        toggle.id = 'heatmap-toggle';
        toggle.innerHTML = `
            <div class="analytics-btn">
                <span class="material-symbols-outlined">insights</span>
                <span class="btn-text">Neural Analytics</span>
            </div>
            <div class="analytics-status">MODE: <span id="h-status">STANDARD</span></div>
        `;
        document.body.appendChild(toggle);

        toggle.onclick = () => {
            isAnalyticsMode = !isAnalyticsMode;
            document.getElementById('h-status').innerText = isAnalyticsMode ? 'BRAIN_VIEW' : 'STANDARD';
            document.body.classList.toggle('analytics-active', isAnalyticsMode);
            
            if (isAnalyticsMode) {
                showHeatmap();
            } else {
                hideHeatmap();
            }
        };
    }

    function showHeatmap() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'heatmap-canvas';
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
        }
        
        canvas.width = document.documentElement.scrollWidth;
        canvas.height = document.documentElement.scrollHeight;
        renderHeatmap();
    }

    function hideHeatmap() {
        if (canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
    }

    function renderHeatmap() {
        if (!canvas) return;
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render Points
        heatmapData.forEach(p => {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 40);
            
            // ELITE NEON PALETTE
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)'); // Purple
            gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)'); // Cyan
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(p.x - 40, p.y - 40, 80, 80);
            
            // Core Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#8b5cf6';
            ctx.fill();
        });
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeatmap);
    } else {
        initHeatmap();
    }

    // Respond to resize
    window.addEventListener('resize', () => {
        if (isAnalyticsMode && canvas) {
            canvas.width = document.documentElement.scrollWidth;
            canvas.height = document.documentElement.scrollHeight;
            renderHeatmap();
        }
    });
})();
