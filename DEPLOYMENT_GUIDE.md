# 🚀 AE-FUNAI Navigator - Complete Deployment Guide

This guide will help you set up and deploy the AE-FUNAI Campus Navigator from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Windows, Mac, or Linux computer
- [ ] Internet connection
- [ ] Administrator access to install software
- [ ] Google account (for Maps API)
- [ ] Credit card (for Google Cloud - free tier available)

## 🛠️ Step 1: Install Required Software

### 1.1 Install Node.js

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS version** (recommended)
   - Run the installer and follow instructions

2. **Verify Installation**:
   - Open Terminal/Command Prompt
   - Type: `node --version`
   - Should show version like `v20.x.x`
   - Type: `npm --version`
   - Should show version like `10.x.x`

### 1.2 Install Git

1. **Download Git**:
   - Go to [https://git-scm.com/](https://git-scm.com/)
   - Download for your operating system
   - Install with default settings

2. **Verify Installation**:
   - Open Terminal/Command Prompt
   - Type: `git --version`
   - Should show Git version

### 1.3 Install VS Code (Optional but Recommended)

1. **Download VS Code**:
   - Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download and install

## 🔑 Step 2: Set Up Google Maps API

### 2.1 Create Google Cloud Project

1. **Go to Google Cloud Console**:
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create New Project**:
   - Click "Select a project" → "New Project"
   - Name: "AE-FUNAI Navigator"
   - Click "Create"

3. **Enable Billing**:
   - Go to "Billing" in left menu
   - Set up billing account (credit card required)
   - **Note**: Free tier includes $300 credit

### 2.2 Enable Required APIs

1. **Go to APIs & Services**:
   - Click "APIs & Services" → "Library"

2. **Enable These APIs** (search and enable each):
   - ✅ Maps JavaScript API
   - ✅ Directions API
   - ✅ Places API
   - ✅ Geocoding API

### 2.3 Create API Key

1. **Create Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (save it securely!)

2. **Restrict API Key** (Recommended):
   - Click on your API key to edit
   - Under "API restrictions": Select the 4 APIs you enabled
   - Under "Website restrictions": Add your domain
   - Click "Save"

## 📥 Step 3: Download and Set Up Project

### 3.1 Download from GitHub

**Option A: Download ZIP**
1. Go to the GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract to your desired folder

**Option B: Clone with Git**
```bash
git clone https://github.com/YOUR_USERNAME/ae-funai-navigator.git
cd ae-funai-navigator
```

### 3.2 Install Dependencies

1. **Open Terminal in Project Folder**:
   - Navigate to `ae-funai-navigator/client_loc`
   - Or open VS Code and open this folder

2. **Install Dependencies**:
```bash
cd client_loc
npm install
```

Wait for installation to complete (may take 2-5 minutes).

### 3.3 Set Up Environment Variables

1. **Create .env File**:
   - In the `client_loc` folder, create a file named `.env`
   - Add your Google Maps API key:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDdkfFy_y0wAyyxC_ixzniD1vOyWTTvctk
```

Replace with your actual API key!

## 🚀 Step 4: Run the Application

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Open in Browser

- The app will automatically open at `http://localhost:5173`
- If not, manually go to this URL

### 4.3 Test the Application

1. **Allow Location Access** when prompted
2. **Try searching** for campus locations
3. **Test navigation** by selecting destinations
4. **Check mobile** by opening on your phone

## 🌐 Step 5: Deploy to Production

### Option A: Vercel (Easiest)

1. **Install Vercel**:
```bash
npm install -g vercel
```

2. **Build and Deploy**:
```bash
npm run build
vercel --prod
```

3. **Add Environment Variables**:
   - Go to Vercel dashboard
   - Add `VITE_GOOGLE_MAPS_API_KEY` in settings

### Option B: Netlify

1. **Build the Project**:
```bash
npm run build
```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Add environment variables in site settings

### Option C: GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Deploy**:
```bash
npm run deploy
```

## 🔧 Step 6: Configuration

### 6.1 Update API Key Restrictions

Once deployed, update your Google Cloud API key restrictions:

1. Go to Google Cloud Console → Credentials
2. Edit your API key
3. Add your production domain to "Website restrictions"
4. Save changes

### 6.2 Test Production Version

1. Visit your deployed URL
2. Test all features work correctly
3. Check mobile compatibility
4. Verify maps load properly

## 📱 Step 7: Mobile Optimization

### 7.1 Test on Mobile Devices

1. **Open on smartphone**
2. **Test location services**
3. **Try navigation features**
4. **Check performance**

### 7.2 PWA Installation (Optional)

The app can be installed as a Progressive Web App:

1. Open in Chrome/Safari
2. Look for "Install" prompt
3. Add to home screen

## 🔍 Step 8: Troubleshooting

### Common Issues and Solutions

**🔴 Map not loading?**
- ✅ Check API key in `.env` file
- ✅ Verify all APIs are enabled in Google Cloud
- ✅ Check browser console for errors

**🔴 Location not working?**
- ✅ Use HTTPS (required for geolocation)
- ✅ Allow location permissions
- ✅ Check if location services are enabled

**🔴 Build errors?**
- ✅ Delete `node_modules` and run `npm install`
- ✅ Check Node.js version (v18+ required)
- ✅ Clear browser cache

**🔴 Slow performance?**
- ✅ Run `npm run build` for production
- ✅ Check internet connection
- ✅ Use CDN for deployment

## 📊 Step 9: Monitoring and Maintenance

### 9.1 Monitor API Usage

1. Go to Google Cloud Console → APIs & Services → Quotas
2. Monitor daily/monthly usage
3. Set up billing alerts

### 9.2 Regular Updates

1. **Update dependencies**: `npm update`
2. **Check for security issues**: `npm audit`
3. **Monitor performance**: Use browser dev tools

## 💰 Step 10: Cost Management

### 10.1 Google Maps Pricing

- **Free Tier**: $300 credit (covers ~40,000 map loads)
- **After Free Tier**: $7 per 1000 map loads
- **Set billing alerts** to avoid surprises

### 10.2 Optimization Tips

1. **Enable API key restrictions**
2. **Monitor usage regularly**
3. **Use caching when possible**
4. **Implement usage limits if needed**

## 📞 Support and Help

### Getting Help

1. **Check the README.md** for technical details
2. **Google Cloud Support** for API issues
3. **GitHub Issues** for bug reports
4. **Stack Overflow** for development questions

### Emergency Contacts

- **Technical Issues**: Check browser console
- **API Billing**: Google Cloud Console
- **Deployment Issues**: Check hosting platform docs

## ✅ Final Checklist

Before going live, ensure:

- [ ] Google Maps API key is working
- [ ] All APIs are enabled and billing is set up
- [ ] Application loads without errors
- [ ] Location services work properly
- [ ] Search functionality is operational
- [ ] Navigation provides accurate directions
- [ ] Mobile version is responsive
- [ ] Production deployment is successful
- [ ] API key restrictions are properly set
- [ ] Monitoring and alerts are configured

## 🎉 Congratulations!

You've successfully deployed the AE-FUNAI Campus Navigator! 

The application is now ready to help students, staff, and visitors navigate the campus with professional-grade mapping and real-time directions.

---

**Need Help?** 
- 📧 Email: [support@example.com](mailto:support@example.com)
- 📱 WhatsApp: +234-XXX-XXX-XXXX
- 🌐 Documentation: Check README.md

**🗺️ Happy Navigating!**
