import * as Location from 'expo-location';
import { getDistanceFromLatLonInMeters } from '../utils/haversine';
const camerasData = require('../data/camera.json');

export async function checkProximity(currentLat, currentLng, currentSpeed) {
  const alerts = [];

  console.log(`🗺️ Google Maps - Checking proximity - Lat: ${currentLat}, Lng: ${currentLng}, Speed: ${currentSpeed}km/h`);
  console.log(`📊 Total cameras in data: ${camerasData.length}`);

  camerasData.forEach(camera => {
    const distance = getDistanceFromLatLonInMeters(
      currentLat, currentLng,
      camera.lat, camera.lng
    );

    console.log(`📷 Camera: ${camera.name}, Distance: ${distance.toFixed(1)}m`);

    if(distance <= 15) {
      console.log(`🚨 PROXIMITY ALERT TRIGGERED for ${camera.name}!`);
      alerts.push({
        name: `MAP ALERT: ${camera.name}`, 
        type: camera.type,
        distance: Math.round(distance),
        yourSpeed: Math.round(currentSpeed),
        cameraLat: camera.lat,
        cameraLng: camera.lng,
        yourLat: currentLat,
        yourLng: currentLng
      });
    }
  });

  console.log(`📢 Total alerts found: ${alerts.length}`);
  return alerts;
}

export async function startLocationTracking(callback) {
  console.log('🗺️ Starting Google Maps location tracking...');
  
  const { status } = await Location.requestForegroundPermissionsAsync();
  if(status !== 'granted') {
    console.log('❌ Location permission denied');
    return;
  }
  
  console.log('✅ Location permission granted');

  Location.watchPositionAsync({
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 1,
    timeInterval: 1000
  }, (location) => {
    const { latitude, longitude, speed } = location.coords;
    const speedKmh = speed * 3.6;
    console.log(`🗺️ Maps Location - Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}, Speed: ${speedKmh.toFixed(1)}km/h`);
    callback({latitude, longitude, speed});
  });
}