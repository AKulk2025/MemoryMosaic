import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
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
  const [isLoading, setIsLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
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
    if (photos.length > 0 && mapReady) {
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
  }, [photos.length, mapReady]);

  const handlePinPress = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const handleMapReady = () => {
    setMapReady(true);
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

  // Function to handle refresh (optional - for pull to refresh)
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - in a real app, this might refetch from server
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Memory Mosaic</Text>
          {photos.length > 0 && (
            <Text style={styles.subtitle}>
              {photos.length} {photos.length === 1 ? 'memory' : 'memories'} captured
            </Text>
          )}
        </View>
        {isLoading && (
          <ActivityIndicator size="small" color="#6200ee" style={styles.headerLoader} />
        )}
      </View>
      
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onMapReady={handleMapReady}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        loadingEnabled={true}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#6200ee"
          />
        }
      >
        {/* OpenStreetMap tiles - works on both platforms without API key */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        
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
      
      {/* Photo count indicator with server status */}
      {photos.length > 0 && (
        <View style={styles.photoCounter}>
          <MaterialCommunityIcons name="image-multiple" size={16} color="#6200ee" />
          <Text style={styles.photoCountText}>{photos.length}</Text>
          <View style={styles.syncIndicator}>
            <MaterialCommunityIcons 
              name="cloud-check" 
              size={12} 
              color="#4CAF50" 
            />
          </View>
        </View>
      )}
      
      {/* Photo modal for displaying photo details */}
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
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    flex: 1,
  },
  headerLoader: {
    position: "absolute",
    right: 20,
    top: Platform.OS === 'ios' ? 60 : 50,
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
  syncIndicator: {
    marginLeft: 6,
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