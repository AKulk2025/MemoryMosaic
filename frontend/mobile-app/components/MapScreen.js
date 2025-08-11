import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import PhotoModal from "./PhotoModal";

export default function MapScreen({ navigation, photos }) {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 60,
    longitudeDelta: 60,
  });

  // Modal state management
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.log("Error getting location:", error);
      }
    })();
  }, []);

  // Auto-center map on new photo
  useEffect(() => {
    if (photos.length > 0) {
      const latestPhoto = photos[photos.length - 1];
      if (latestPhoto.latitude && latestPhoto.longitude) {
        setRegion({
          latitude: latestPhoto.latitude,
          longitude: latestPhoto.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
  }, [photos.length]);

  const handlePinPress = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  // Filter out photos without valid coordinates
  const validPhotos = photos.filter(photo => 
    photo.latitude && photo.longitude && 
    !isNaN(photo.latitude) && !isNaN(photo.longitude)
  );

  const getTimeSincePhoto = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const photoTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - photoTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Mosaic</Text>
        {photos.length > 0 && (
          <Text style={styles.subtitle}>
            {photos.length} {photos.length === 1 ? 'memory' : 'memories'} captured
          </Text>
        )}
      </View>
      
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        customMapStyle={mapStyle}
      >
        {validPhotos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{
              latitude: photo.latitude,
              longitude: photo.longitude,
            }}
            onPress={() => handlePinPress(photo)}
          >
            <View style={styles.customMarker}>
              <MaterialCommunityIcons 
                name="camera" 
                size={20} 
                color="#fff" 
              />
              {photo.timestamp && (
                <View style={styles.markerTimeTag}>
                  <Text style={styles.markerTimeText}>
                    {getTimeSincePhoto(photo.timestamp)}
                  </Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Camera")}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#fff" />
      </TouchableOpacity>
      
      {/* Photo count indicator */}
      {photos.length > 0 && (
        <View style={styles.photoCounter}>
          <MaterialCommunityIcons name="image-multiple" size={16} color="#6200ee" />
          <Text style={styles.photoCountText}>{photos.length}</Text>
        </View>
      )}
      
      {/* Add the PhotoModal here - now passing full photo object */}
      <PhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        photo={selectedPhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  map: {
    flex: 1,
    borderRadius: 20,
    margin: 10,
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "#6200ee",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  photoCounter: {
    position: "absolute",
    bottom: 40,
    left: 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoCountText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#6200ee",
  },
  customMarker: {
    backgroundColor: "#6200ee",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerTimeTag: {
    position: "absolute",
    top: -25,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  markerTimeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
});

// Your mapStyle remains the same...
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f6fa" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#b9d3c2" }],
  },
];