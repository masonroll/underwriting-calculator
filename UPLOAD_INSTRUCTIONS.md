# 📖 Step-by-Step Deployment Instructions
## Upload Your Calculator to underwrite.cybersell.us

---

## 🎯 What You're Doing

You're uploading your calculator files to your web server so anyone can access it at:
**https://underwrite.cybersell.us/login.html** or **https://cybersell.us/underwrite/login.html**

---

## 📁 Files Ready to Upload

All your files are ready in this folder:
```
L:\VSCodeProjects\UnderwritingCalculator-Deploy\
```

You need to upload:
- `login.html` (Login page - users start here)
- `index.html` (Main calculator)
- `assets` folder (with css and js subfolders)
- `README.md` (optional - documentation)

---

## 🚀 Method 1: Using FileZilla (Recommended - Free & Easy)

### Step 1: Download FileZilla (if you don't have it)

1. Go to: **https://filezilla-project.org/**
2. Click "Download FileZilla Client" (it's free)
3. Install it on your computer

### Step 2: Get Your FTP Login Info

You need these details from your hosting provider:
- **Host/Server**: Usually `ftp.cybersell.us` or your server IP
- **Username**: Your FTP username (check your hosting email or cPanel)
- **Password**: Your FTP password
- **Port**: Usually `21` for FTP or `22` for SFTP

**Where to find this:**
- Check your hosting provider's welcome email
- OR Login to your hosting control panel (cPanel/Plesk)
- OR Contact your hosting provider's support

### Step 3: Connect with FileZilla

1. Open FileZilla
2. At the top, fill in:
   - **Host**: `ftp.cybersell.us` (or your FTP address)
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: `21`
3. Click **"Quickconnect"**
4. Wait for connection (you'll see files appear on the right side)

### Step 4: Navigate to Your Website Folder

On the **RIGHT side** (Remote Site):
1. Look for one of these folders:
   - `public_html/`
   - `www/`
   - `htdocs/`
   - `html/`
2. Double-click to open it (this is your website root)

### Step 5: Create the "underwrite" Folder

On the **RIGHT side** (Remote Site):
1. Right-click in the file list
2. Select **"Create directory"**
3. Name it: `underwrite`
4. Press Enter
5. Double-click to enter the `underwrite` folder

### Step 6: Upload Your Files

On the **LEFT side** (Local Site):
1. Navigate to: `L:\VSCodeProjects\UnderwritingCalculator-Deploy\`
2. You should see: `login.html`, `index.html`, `assets` folder, `README.md`

**Now drag and drop:**
1. Select ALL files on the left (`login.html`, `index.html`, `assets`, `README.md`)
2. Drag them to the right side (into your `underwrite` folder)
3. Wait for upload to complete (progress bar at bottom)
4. ✅ Done when FileZilla says "Transfer finished"

### Step 7: Test Your Site

1. Open your web browser
2. Go to: **https://cybersell.us/underwrite/login.html**
3. You should see your login page!
4. Create an account and test it

---

## 🚀 Method 2: Using cPanel File Manager (If You Have cPanel)

### Step 1: Login to cPanel

1. Go to: **https://cybersell.us:2083** (or your hosting provider's cPanel URL)
2. Enter your cPanel username and password
3. Click "Log in"

### Step 2: Open File Manager

1. Look for the "Files" section
2. Click **"File Manager"**
3. A new tab will open

### Step 3: Navigate to Your Website Root

1. On the left sidebar, click **"public_html"**
2. You'll see your website files

### Step 4: Create "underwrite" Folder

1. Click the **"+ Folder"** button (top menu)
2. Name: `underwrite`
3. Click **"Create New Folder"**
4. Double-click the `underwrite` folder to enter it

### Step 5: Upload Files

1. Click the **"Upload"** button (top menu)
2. A new tab opens with upload interface
3. Click **"Select File"** button
4. Navigate to: `L:\VSCodeProjects\UnderwritingCalculator-Deploy\`
5. Select `login.html` and click "Open"
6. Wait for upload (green checkmark when done)
7. Repeat for:
   - `index.html`
   - `README.md`

### Step 6: Upload the "assets" Folder

**Option A: Upload as ZIP (Faster)**
1. On your computer, right-click the `assets` folder in the Deploy folder
2. Select "Send to → Compressed (zipped) folder"
3. Name it `assets.zip`
4. In cPanel File Manager upload tab, upload `assets.zip`
5. After upload, go back to File Manager
6. Right-click `assets.zip`
7. Select "Extract"
8. Click "Extract Files"
9. Delete `assets.zip` (right-click → Delete)

**Option B: Upload Files Individually**
1. In cPanel File Manager, create folder: `assets`
2. Inside `assets`, create folders: `css` and `js`
3. Enter `css` folder, upload `style.css`
4. Enter `js` folder, upload `main.js`

### Step 7: Set Permissions (Usually Not Needed)

If files don't work:
1. Select all files
2. Click "Permissions" button
3. Set files to: `644`
4. Set folders to: `755`
5. Click "Change Permissions"

### Step 8: Test Your Site

1. Open your web browser
2. Go to: **https://cybersell.us/underwrite/login.html**
3. You should see your login page!

---

## 🚀 Method 3: Using Windows File Explorer (If Your Host Supports WebDAV/Network Drive)

Some hosting providers let you connect as a network drive:

1. Open File Explorer
2. Right-click "This PC"
3. Select "Map network drive"
4. Enter your FTP details
5. Browse to `public_html/underwrite/`
6. Copy and paste files from Deploy folder

---

## ✅ After Upload - Testing Checklist

1. **Visit login page:**
   - URL: `https://cybersell.us/underwrite/login.html`
   - ✅ Page loads with login form

2. **Create test account:**
   - Click "Don't have an account? Sign up"
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Click "Create Account"
   - ✅ Redirects to calculator

3. **Test calculator:**
   - ✅ See "Welcome, Test User" in top right
   - ✅ Click "Add Deal"
   - ✅ Fill in property details
   - ✅ Click "Calculate Metrics"
   - ✅ See results

4. **Test logout:**
   - Click "Logout" button
   - ✅ Returns to login page

5. **Test login again:**
   - Email: test@example.com
   - Password: test123
   - ✅ Logs in successfully

6. **Test on mobile:**
   - Open on your phone
   - ✅ Responsive design works
   - ✅ Login and calculator work

---

## 🎯 Setting Up the Subdomain (Optional)

If you want **underwrite.cybersell.us** instead of **cybersell.us/underwrite/**:

### Using cPanel:

1. Login to cPanel
2. Find "Domains" or "Subdomains" section
3. Click "Create A New Subdomain"
4. Subdomain: `underwrite`
5. Domain: `cybersell.us`
6. Document Root: `/public_html/underwrite` (or auto-filled)
7. Click "Create"
8. Wait 5-10 minutes for DNS to propagate
9. Visit: **https://underwrite.cybersell.us/login.html**

### Enable SSL for Subdomain:

1. In cPanel, find "SSL/TLS Status"
2. Look for `underwrite.cybersell.us`
3. Click "Run AutoSSL"
4. Wait for SSL certificate to install
5. ✅ Now accessible via HTTPS

---

## 🐛 Troubleshooting

### Problem: "404 Not Found"
**Solution:**
- Check files are in correct folder: `public_html/underwrite/`
- Check file names are exact: `login.html` (not `Login.html`)
- Clear browser cache (Ctrl+Shift+Delete)

### Problem: "Page loads but no styling"
**Solution:**
- Check `assets` folder uploaded correctly
- Verify folder structure: `assets/css/style.css` and `assets/js/main.js`
- Check file permissions: 644 for files, 755 for folders

### Problem: "Can't create account"
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Make sure `main.js` is loading (check Network tab)
- Try different browser

### Problem: "Login doesn't work"
**Solution:**
- Clear browser cache and cookies
- Try incognito/private mode
- Check browser console for errors
- Verify localStorage is enabled in browser

### Problem: "SSL/HTTPS not working"
**Solution:**
- Wait 10-15 minutes for SSL to propagate
- In cPanel, check SSL/TLS Status
- Run AutoSSL for your subdomain
- Contact hosting support if still not working

---

## 📞 Need Help?

### Common Hosting Providers:

**GoDaddy:**
- FTP Host: Usually your domain or IP address
- cPanel: https://yourdomain.com:2083

**Bluehost:**
- FTP Host: Your domain name
- cPanel: Through Bluehost dashboard

**HostGator:**
- FTP Host: gator####.hostgator.com
- cPanel: https://gator####.hostgator.com:2083

**SiteGround:**
- Use Site Tools instead of cPanel
- FTP details in Site Tools → FTP Accounts

**Namecheap:**
- FTP Host: Your domain or server name
- cPanel: Through Namecheap panel

### Contact Your Hosting Support:

If you're stuck, contact your hosting provider's support and say:

```
"Hi, I need to upload website files to my domain cybersell.us. 
Can you provide:
1. FTP hostname
2. FTP username
3. FTP password
4. Which folder should I upload to?

I want to create a subdomain: underwrite.cybersell.us"
```

They'll help you out! Most hosting companies have 24/7 chat support.

---

## 🎉 You're Done!

Once uploaded, share this with your users:

```
🎯 Real Estate Underwriting Calculator

Login: https://underwrite.cybersell.us/login.html
(or: https://cybersell.us/underwrite/login.html)

First time?
1. Click "Sign up"
2. Create your account
3. Start analyzing deals!

Features:
✅ Professional underwriting calculations
✅ Cap Rate, NOI, Cash-on-Cash Return
✅ Save and manage multiple deals
✅ Export to CSV
✅ Mobile-friendly
```

---

## 📋 Quick Reference

**Your Files Location:**
- Local: `L:\VSCodeProjects\UnderwritingCalculator-Deploy\`
- Server: `public_html/underwrite/`

**Live URLs:**
- Option 1: `https://cybersell.us/underwrite/login.html`
- Option 2: `https://underwrite.cybersell.us/login.html` (if subdomain set up)

**What to Upload:**
- `login.html` ← Users start here
- `index.html` ← Main calculator
- `assets/` folder ← Styling and functionality
- `README.md` ← Optional documentation

**Test Account:**
- Email: test@example.com
- Password: test123

---

**Need more help?** Let me know which hosting provider you use (GoDaddy, Bluehost, etc.) and I can give you specific instructions! 🚀
