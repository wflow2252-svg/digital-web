# 🏛️ Sovereign Deployment Guide: Digital Web

This guide provides the full blueprint to host your **Digital Web** project on your own private server with a custom domain, ensuring total control and "Sovereignty".

## 1. Requirement Checklist
- **Domain Name**: e.g., `digital-web-eg.com` (Purchase from Namecheap or GoDaddy).
- **VPS Server**: Ubuntu 22.04 LTS (Recommended: Hetzner, DigitalOcean, or Linode).
- **SSH Access**: Your server IP and root password.

## 2. Point Your Domain (DNS)
Log in to your Domain Provider and add these **A Records**:
| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| A | @ | `YOUR_SERVER_IP` | 3600 |
| A | * | `YOUR_SERVER_IP` | 3600 |

*The `*` record allows you to have unlimited custom subdomains (e.g., `site1.yourdomain.com`).*

## 3. Server Initialization (SSH)
Connect to your server:
```bash
ssh root@YOUR_SERVER_IP
```

Install the core infrastructure:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx nodejs npm certbot python3-certbot-nginx -y
sudo npm install -g pm2
```

## 4. Deploy the Project
Create the project directory and upload your files (via SFTP or Git):
```bash
mkdir -p /var/www/digital-web
# Upload your index.html, style.css, main.js, etc., to this folder.
```

## 5. Configure Nginx (Sovereign Gateway)
Create a new Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/digital-web
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com *.yourdomain.com;

    root /var/www/digital-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Handle the Dynamic Demo Links
    location /demo/ {
        rewrite ^/demo/(.*)$ /demo.html?id=$1 last;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/digital-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Secure with SSL
Run Certbot to enable HTTPS for free:
```bash
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com
```

## 7. Performance & Persistence
If you use any background Node.js processes for the AI synthesis, run them with PM2:
```bash
pm2 start server.js --name "digital-web-core"
pm2 save
pm2 startup
```

---
**Your Sovereign Hub is now live at `https://yourdomain.com`!**
