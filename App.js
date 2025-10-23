import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import SpeedAlert from './components/speedAlert';
import { startLocationTracking, checkProximity } from './services/locationService'; // Same import as before

export default function App() {
  const [alertInfo, setAlertInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 30.862848,
    longitude: 75.860023,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    console.log('🗺️ Highway Halo with Maps Started');
    
    startLocationTracking(async ({ latitude, longitude, speed }) => {
      const speedKmh = speed * 3.6;
      
      // Update user location for map
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      console.log(`🎯 Processing location - Speed: ${speedKmh.toFixed(1)}km/h`);
      
      try {
        const nearbyAlerts = await checkProximity(latitude, longitude, speedKmh);
        
        if (nearbyAlerts.length > 0) {
          console.log('🔴 Alert:', nearbyAlerts[0]);
          setAlertInfo(nearbyAlerts[0]);
          
          Alert.alert(
            '🗺️ Map Alert!',
            `${nearbyAlerts[0].name}\nType: ${nearbyAlerts[0].type}\nSpeed: ${nearbyAlerts[0].yourSpeed} km/h\nDistance: ${nearbyAlerts[0].distance}m`,
            [{ text: 'OK' }]
          );
        } else {
          setAlertInfo(null);
        }
      } catch (error) {
        console.log('❌ Error:', error);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView 
        style={styles.map} 
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description={`Speed: ${alertInfo?.yourSpeed || 0} km/h`}
            pinColor="blue"
          />
        )}
        
        {/* Camera Locations */}
        {require('./data/camera.json').map((camera, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: camera.lat, longitude: camera.lng }}
            title={camera.name}
            description={camera.type}
            pinColor="red"
          />
        ))}
        
        {/* Detection Radius Circle */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={15}
            strokeColor="rgba(255,0,0,0.5)"
            fillColor="rgba(255,0,0,0.2)"
          />
        )}
      </MapView>
      
      {/* Alert Info Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.text}>Highway Halo with Maps 🗺️</Text>
        <Text style={styles.subtext}>
          {alertInfo ? `ALERT: ${alertInfo.name}` : 'No alerts - walk near red markers'}
        </Text>
        <Text style={styles.subtext}>
          Your Speed: {alertInfo?.yourSpeed || 0} km/h
        </Text>
      </View>
      
      {/* Speed Alert Modal */}
      {alertInfo && (
        <SpeedAlert 
          visible={true} 
          locationName={`${alertInfo.name}`} 
          type={`${alertInfo.type} | Speed: ${alertInfo.yourSpeed} km/h`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtext: {
    fontSize: 12,
     color: '#666',
    textAlign: 'center',
  },
});