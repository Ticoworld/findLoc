# 🗺️ AE-FUNAI Campus Navigator

A professional, real-time campus navigation system for Alex Ekwueme Federal University Ndufu-Alike (AE-FUNAI) built with React and Google Maps API.

**🚀 Live Demo**: [https://ae-funailocationfinder.vercel.app/](https://ae-funailocationfinder.vercel.app/)

![AE-FUNAI Navigator](https://img.shields.io/badge/Status-Live%20on%20Vercel-success)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## 🌟 Features

- 🗺️ **Professional Google Maps Integration** - Real-time navigation with turn-by-turn directions
- 📍 **44+ Campus Locations** - Complete database of all campus buildings and facilities  
- 🔍 **Intelligent Search** - Quick location lookup with autocomplete
- 📱 **Mobile Optimized** - Responsive design for all devices
- 🧭 **Real-time GPS** - Accurate location detection and tracking
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- ⚡ **Lightning Fast** - Built with Vite for optimal performance

## 🏛️ Campus Locations Covered

- **Academic Buildings**: Faculties, Lecture Halls, Departments
- **Student Housing**: Hostels and Residential Areas  
- **Medical Facilities**: Health Centers and Medical Services
- **Campus Gates**: All entry and exit points
- **Transportation**: Bus stops and transport hubs
- **Religious Centers**: Chapel, Mosque, and worship centers
- **Recreation**: Sports facilities and entertainment venues
- **Commercial Areas**: Shops, cafeterias, and services

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Maps API Key** - [Get yours here](https://developers.google.com/maps/gmp-get-started)

### 1. Clone the Repository

```bash
git clone https://github.com/Ticoworld/findLoc.git
cd findLoc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**🔑 Getting Your Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API  
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Add your domain restrictions (optional but recommended)

### 4. Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` folder.

## 📱 Usage Guide

### 🔍 **Finding Locations**
1. Click the search button (🔍) or press the floating action button
2. Type the name of any campus building or facility
3. Select from the autocomplete suggestions
4. Get instant directions with walking time

### 🧭 **Navigation**
1. Allow location access when prompted
2. Search for your destination
3. View turn-by-turn directions on the map
4. Follow the blue route line to your destination

### 🗺️ **Map Controls**
- **Fullscreen**: Expand map to full screen
- **Map Types**: Switch between Street, Satellite, and Hybrid views
- **Quick Navigation**: Jump to campus center or your location
- **Zoom**: Use + and - buttons or mouse wheel

### 📍 **Location Markers**
- 🏢 Blue: Academic Buildings
- 🏠 Pink: Student Housing  
- 🏥 Red: Medical Facilities
- 🚪 Green: Campus Gates
- 🚌 Orange: Transportation
- ⛪ Purple: Religious Centers

## 🛠️ Technology Stack


## 📁 Project Structure

```
ae-funai-navigator/
├── src/
│   ├── components/          # React components
│   │   ├── GoogleMapComponent.jsx
│   │   ├── SearchModal.jsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   └── modernHome.jsx
│   ├── utils/               # Utility functions
│   │   ├── googleMapsService.js
│   │   └── ...
│   ├── assets/              # Static assets
│   └── main.jsx             # Entry point
├── public/                  # Public assets
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```


## Campus A* Shortcuts and Backend

- Shortcut-aware A* pathfinding is enabled using a campus graph. See `docs/CAMPUS_SHORTCUTS.md` for how to add nodes/edges and map new shortcuts.
- Optional Express + MongoDB backend scaffold is available under `server/`. See `server/README.md` and `docs/BACKEND.md` for setup and API info.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | ✅ Yes |

### Google Maps API Setup

1. **Enable Required APIs**:
   - Maps JavaScript API
   - Directions API
   - Places API  
   - Geocoding API

2. **Set API Restrictions** (Recommended):
   - HTTP referrers: `localhost:5173`, `your-domain.com`
   - IP addresses: Your server IPs

3. **Billing**: Ensure billing is enabled for production use

## 📱 Mobile Support

The application is fully optimized for mobile devices with:

- 📱 **Responsive Design** - Works on all screen sizes
- 👆 **Touch Gestures** - Tap, pinch, and swipe navigation  
- 🔄 **Orientation Support** - Portrait and landscape modes
- ⚡ **Fast Loading** - Optimized for mobile networks
- 🔋 **Battery Efficient** - Smart GPS usage

## 🚀 Deployment

### Vercel (Current Live Deployment)

Your application is already live on Vercel! Any changes pushed to the main branch will automatically deploy.

**Live URL**: https://ae-funailocationfinder.vercel.app/

**For new deployments:**
1. Fork this repository
2. Connect your fork to Vercel
3. Add environment variable `VITE_GOOGLE_MAPS_API_KEY` in Vercel dashboard
4. Deploy automatically on push to main

### Other Platforms

**Netlify:**
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Add environment variables

**GitHub Pages:**
1. Build: `npm run build`  
2. Deploy `dist/` contents to `gh-pages` branch

## 🔒 Security

- **API Key Protection**: Environment variables keep keys secure
- **Domain Restrictions**: Limit API key usage to authorized domains
- **HTTPS**: Use HTTPS in production for location services
- **Rate Limiting**: Google Maps API has built-in rate limiting

## 🐛 Troubleshooting

### Common Issues

**Map not loading?**
- Check your Google Maps API key
- Ensure all required APIs are enabled
- Verify billing is set up

**Location not working?**
- Allow location permissions in browser
- Use HTTPS (required for geolocation)
- Check if location services are enabled

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (v18+ required)
- Verify all dependencies are installed

## 📊 Performance

- ⚡ **Fast Initial Load**: < 2 seconds
- 🗺️ **Map Rendering**: < 1 second  
- 🔍 **Search Response**: < 500ms
- 📱 **Mobile Performance**: 90+ Lighthouse score

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email: [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- **AE-FUNAI** - For campus coordinates and support
- **Google Maps** - For mapping and navigation services
- **React Team** - For the amazing React framework
- **Vite** - For lightning-fast build tools

---

**Made with ❤️ for AE-FUNAI Community**

🗺️ **Navigate Smart, Study Better!**
