# Real Estate Underwriting Calculator

A comprehensive, professional web dashboard for real estate underwriting analysis. Built for analyzing and underwriting real estate deals with advanced financial metrics, sensitivity analysis, and beautiful visualizations.

🌐 **Live Demo**: [underwrite.cybersell.us](https://underwrite.cybersell.us)

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-v16+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## � Quick Deploy to Your Website

### For Static Hosting (Simplest - Works on any web host):

1. **Run the deployment script:**
   ```cmd
   prepare-deployment.bat
   ```
   This creates a clean deployment folder with only the necessary files.

2. **Upload via FTP/cPanel:**
   - Connect to your web server
   - Navigate to `public_html/` (or your web root)
   - Create `underwrite` folder
   - Upload all files from `UnderwritingCalculator-Deploy` folder
   - Visit: `https://yourdomain.com/underwrite/`

📖 **Detailed Instructions**: See [QUICK_UPLOAD.md](QUICK_UPLOAD.md) or [STATIC_DEPLOYMENT.md](STATIC_DEPLOYMENT.md)

---

## �📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Deployment Options](#deployment-options)
  - [Option 1: Nginx (Recommended)](#option-1-nginx-recommended)
  - [Option 2: Cloudflare Pages](#option-2-cloudflare-pages)
  - [Option 3: Static Hosting](#option-3-static-hosting)
- [API Documentation](#api-documentation)
- [Financial Calculations](#financial-calculations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- ✅ **Deal Dashboard** - View and manage all active real estate deals
- ✅ **Comprehensive Input Form** - Capture all property and financial details
- ✅ **Automatic Calculations** - Real-time calculation of key metrics
- ✅ **Sensitivity Analysis** - Interactive sliders to test different scenarios
- ✅ **Data Visualization** - Charts powered by Chart.js
- ✅ **Data Persistence** - Save/load deals via local storage or backend
- ✅ **Export Functionality** - Export to CSV, JSON, or print reports
- ✅ **Responsive Design** - Works perfectly on desktop and mobile

### Financial Metrics Calculated
- **NOI** (Net Operating Income)
- **Cap Rate** (Capitalization Rate)
- **Cash-on-Cash Return**
- **DSCR** (Debt Service Coverage Ratio)
- **IRR** (Internal Rate of Return)
- **Break-even Occupancy**
- **Monthly/Annual Cash Flow**
- **ROI** over holding period

### Design Features
- Professional financial color palette (Navy, White, Silver)
- Tailwind CSS for modern, responsive UI
- Smooth animations and transitions
- Mobile-first responsive design
- Print-friendly layouts

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES6+)
- Chart.js for data visualization

**Backend:**
- Node.js
- Express.js
- File-based JSON storage
- RESTful API architecture

**Optional Integrations:**
- Claude API (for AI insights)
- Zillow API (for property data)
- HomeJunction API (for market data)

---

## 📁 Project Structure

```
UnderwritingCalculator/
├── index.html              # Main application page
├── server.js               # Express server
├── package.json            # Node dependencies
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── DEPLOYMENT.md          # Detailed deployment guide
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       └── main.js        # Application logic & calculations
└── data/
    ├── .gitkeep
    └── deals.json         # Persisted deals (auto-generated)
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git (optional)

### Local Setup

1. **Clone or download the project:**
```bash
cd /path/to/UnderwritingCalculator
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
copy .env.example .env
```

4. **Edit `.env` file** with your configuration:
```env
PORT=3000
NODE_ENV=development
DOMAIN=localhost
```

5. **Start the development server:**
```bash
npm start
```

Or use nodemon for auto-restart:
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

---

## 🌐 Deployment Options

### Option 1: Nginx (Recommended for Production)

#### Prerequisites
- Linux server (Ubuntu/Debian recommended)
- Root or sudo access
- Domain name pointing to your server IP

#### Step 1: Install Node.js and Nginx

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Verify installations
node --version
npm --version
nginx -v
```

#### Step 2: Upload Project Files

```bash
# Create web directory
sudo mkdir -p /var/www/underwrite

# Upload files (use SCP, SFTP, or Git)
# Example with SCP from local machine:
scp -r ./UnderwritingCalculator/* user@your-server:/var/www/underwrite/

# Or clone from Git:
cd /var/www/underwrite
git clone your-repo-url .

# Set permissions
sudo chown -R www-data:www-data /var/www/underwrite
sudo chmod -R 755 /var/www/underwrite
```

#### Step 3: Install Dependencies and Configure

```bash
cd /var/www/underwrite

# Install npm packages
npm install --production

# Create environment file
sudo nano .env
```

Add the following to `.env`:
```env
PORT=3000
NODE_ENV=production
DOMAIN=underwrite.cybersell.us
```

#### Step 4: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start server.js --name underwriting-app

# Configure PM2 to start on boot
pm2 startup systemd
pm2 save

# View logs
pm2 logs underwriting-app
```

#### Step 5: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/underwrite.cybersell.us
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name underwrite.cybersell.us www.underwrite.cybersell.us;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name underwrite.cybersell.us www.underwrite.cybersell.us;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/underwrite.cybersell.us/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/underwrite.cybersell.us/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/underwrite.access.log;
    error_log /var/log/nginx/underwrite.error.log;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 6: Enable Site and SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/underwrite.cybersell.us /etc/nginx/sites-enabled/

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d underwrite.cybersell.us -d www.underwrite.cybersell.us

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

#### Step 7: Configure Firewall

```bash
# Allow HTTP/HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

#### Step 8: Verify Deployment

Visit: `https://underwrite.cybersell.us`

---

### Option 2: Cloudflare Pages

Cloudflare Pages is perfect for static hosting with built-in CDN.

#### Step 1: Prepare Static Build

For static deployment (no backend), the app uses browser localStorage for data persistence.

```bash
# Create a build directory
mkdir build
cp index.html build/
cp -r assets build/
```

#### Step 2: Deploy to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository or upload files directly
4. Configure build settings:
   - **Build command**: (leave empty for static)
   - **Build output directory**: `/`
   - **Root directory**: `/`

5. Add environment variables (if using backend):
   - `NODE_VERSION`: `18`

6. Click **Save and Deploy**

#### Step 3: Configure Custom Domain

1. In Cloudflare Pages, go to **Custom domains**
2. Add `underwrite.cybersell.us`
3. Cloudflare will automatically configure DNS

**Note**: For full backend functionality, consider using Cloudflare Workers or deploy the Node.js server separately.

---

### Option 3: Static Hosting (No Backend)

For simple deployment without a backend server:

#### Using any static host (Netlify, Vercel, GitHub Pages):

1. Upload these files:
   - `index.html`
   - `assets/` folder

2. The app will use browser localStorage for data persistence

3. No server-side API endpoints will be available

---

## 📚 API Documentation

### Base URL
```
https://underwrite.cybersell.us/api
```

### Endpoints

#### Deals

**Get All Deals**
```http
GET /api/deals
```

Response:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

**Get Single Deal**
```http
GET /api/deals/:id
```

**Create Deal**
```http
POST /api/deals
Content-Type: application/json

{
  "propertyName": "123 Main St",
  "address": "123 Main St, City, State",
  "purchasePrice": 300000,
  ...
}
```

**Update Deal**
```http
PUT /api/deals/:id
```

**Delete Deal**
```http
DELETE /api/deals/:id
```

#### Analytics

**Get Portfolio Analytics**
```http
GET /api/analytics
```

Response:
```json
{
  "success": true,
  "data": {
    "totalDeals": 10,
    "totalValue": 3000000,
    "avgCapRate": 7.5,
    "avgCashOnCash": 12.3,
    ...
  }
}
```

#### Export

**Export to CSV**
```http
GET /api/export/csv
```

**Export to JSON**
```http
GET /api/export/json
```

#### Property Lookup (Mock)

**Lookup Property Data**
```http
GET /api/property-lookup?address=123%20Main%20St
```

---

## 🧮 Financial Calculations

### Net Operating Income (NOI)
```
NOI = Effective Gross Income - Operating Expenses
```

### Cap Rate
```
Cap Rate = (NOI / Total Investment) × 100
```

### Cash-on-Cash Return
```
CoC = (Annual Cash Flow / Cash Invested) × 100
```

### DSCR (Debt Service Coverage Ratio)
```
DSCR = NOI / Annual Debt Service
```

### IRR (Internal Rate of Return)
```
IRR = ((Exit Value / Initial Investment)^(1/Years) - 1) × 100
```

### Break-even Occupancy
```
Break-even = ((Operating Expenses + Debt Service) / Gross Income) × 100
```

---

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and multi-user support
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time property data API integration (Zillow, MLS)
- [ ] Claude AI integration for deal insights
- [ ] Comparative market analysis (CMA)
- [ ] Deal comparison tool
- [ ] Email notifications for deal updates
- [ ] Advanced charting and reports
- [ ] PDF export with branding
- [ ] Mobile app (React Native)
- [ ] Team collaboration features

### API Integration Templates

The codebase includes commented examples for:
- **Zillow API** - Property valuations
- **HomeJunction API** - Rental estimates
- **Claude API** - AI-powered insights

To activate, uncomment relevant sections in `server.js` and add API keys to `.env`.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**CyberSell**
- Website: [underwrite.cybersell.us](https://underwrite.cybersell.us)

---

## 🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: [your-email@cybersell.us]

---

## 📝 Additional Notes

### Security Considerations
- Never commit `.env` files
- Use HTTPS in production
- Implement rate limiting for APIs
- Sanitize all user inputs
- Regular security updates

### Performance Tips
- Enable Gzip compression (included)
- Use CDN for static assets
- Implement caching strategies
- Monitor server resources with PM2

### Maintenance
```bash
# View PM2 logs
pm2 logs underwriting-app

# Restart application
pm2 restart underwriting-app

# Update application
cd /var/www/underwrite
git pull
npm install
pm2 restart underwriting-app

# Renew SSL certificate (auto-renews, but manual option)
sudo certbot renew
```

---

## 🎉 Quick Start Checklist

- [ ] Install Node.js and dependencies
- [ ] Configure `.env` file
- [ ] Test locally (`npm start`)
- [ ] Set up server (Nginx/Cloudflare)
- [ ] Upload files to `/var/www/underwrite`
- [ ] Configure domain DNS
- [ ] Install SSL certificate
- [ ] Start with PM2
- [ ] Configure Nginx proxy
- [ ] Test at underwrite.cybersell.us
- [ ] Set up automatic backups

---

**Built with ❤️ for Real Estate Professionals**
