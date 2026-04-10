const fs = require('fs');
let c = fs.readFileSync('chat-widget.js', 'utf8');
c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('chat-widget.js', c);
