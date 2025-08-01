/**
 * Google Maps API Debug Utility
 * Helps diagnose API configuration issues
 */

export const debugGoogleMapsAPI = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDdkfFy_y0wAyyxC_ixzniD1vOyWTTvctk';
  
  console.log('🔍 Google Maps API Debug Information:');
  console.log('=====================================');
  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...');
  console.log('🌐 Environment:', import.meta.env.MODE);
  console.log('📍 Origin:', window.location.origin);
  console.log('🔗 Referrer:', document.referrer || 'none');
  
  // Test API accessibility
  const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
  console.log('🧪 Test URL:', testUrl);
  
  // Check if script is loaded
  if (window.google && window.google.maps) {
    console.log('✅ Google Maps API is loaded');
    console.log('📚 Available libraries:', Object.keys(window.google.maps));
  } else {
    console.log('❌ Google Maps API not loaded yet');
  }
  
  console.log('=====================================');
  console.log('');
  console.log('🛠️ To fix REQUEST_DENIED errors:');
  console.log('1. ✅ Enable these APIs in Google Cloud Console:');
  console.log('   - Maps JavaScript API');
  console.log('   - Directions API');
  console.log('   - Places API');
  console.log('   - Geocoding API');
  console.log('');
  console.log('2. ✅ Add authorized domains:');
  console.log('   - http://localhost:5173');
  console.log('   - https://localhost:5173');
  console.log('   - Your production domain');
  console.log('');
  console.log('3. ✅ Check billing is enabled');
  console.log('4. ✅ Verify API key restrictions match your domain');
  console.log('');
  
  return {
    apiKey: apiKey.substring(0, 20) + '...',
    environment: import.meta.env.MODE,
    origin: window.location.origin,
    mapsLoaded: !!(window.google && window.google.maps)
  };
};

// Auto-run debug on import during development
if (import.meta.env.DEV) {
  setTimeout(debugGoogleMapsAPI, 1000);
}
