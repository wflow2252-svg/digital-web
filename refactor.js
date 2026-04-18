const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove DevOps Agent button
html = html.replace(/<button class="nav-item" onclick="switchSection\('devops-agent'\)">[\s\S]*?<\/button>/, '');

// Find the old AI Studio section
const aiStudioStart = html.indexOf('<!-- AI Studio Section -->');
const devopsAgentStart = html.indexOf('<!-- DevOps AI Agent Section -->');
const devopsAgentEnd = html.indexOf('</section>', devopsAgentStart) + 10;

// Extract devops agent
let devopsAgentSection = html.slice(devopsAgentStart, devopsAgentEnd);
devopsAgentSection = devopsAgentSection.replace('id="devops-agent"', 'id="ai-studio"');
devopsAgentSection = devopsAgentSection.replace('Sovereign DevOps', 'AI Studio | مولّد المواقع الذكي');
devopsAgentSection = devopsAgentSection.replace('DevOps AI Agent', 'AI Studio Agent');
devopsAgentSection = devopsAgentSection.replace('DEVOPS//AI', 'AI//STUDIO');
devopsAgentSection = devopsAgentSection.replace('Senior Architecture Engine v1.0', 'Sovereign Website Architect');

// Remove both old sections and add the updated devops agent as AI Studio
html = html.slice(0, aiStudioStart) + devopsAgentSection + '\n' + html.slice(devopsAgentEnd);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully');
