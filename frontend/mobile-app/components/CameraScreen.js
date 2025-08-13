import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function CameraScreen({ navigation, onPhotoTaken }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [isUploading, setIsUploading] = useState(false);

  const takePicture = async () => {
    if (isUploading) return; // Prevent multiple uploads
    
    try {
      setIsUploading(true); 
      
      if (cameraRef.current) {
        // Get current location with better Android compatibility
        const { status } = await Location.requestForegroundPermissionsAsync();
        let location = null;
        let address = null;

        if (status === "granted") {
          try {
            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.High,
              timeout: 15000,
              maximumAge: 10000,
            });
            location = currentLocation.coords;

            // Get address/area name (city and region only)
            try {
              const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.latitude,
                longitude: location.longitude,
              });
              
              if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];
                // Create a simple city, state format
                const cityName = place.city || place.subregion || place.district;
                const regionName = place.region || place.country;
                
                if (cityName && regionName) {
                  address = `${cityName}, ${regionName}`;
                } else if (cityName) {
                  address = cityName;
                } else if (regionName) {
                  address = regionName;
                } else {
                  address = "Unknown location";
                }
              }
            } catch (error) {
              console.log("Error getting address:", error);
              address = "Unknown location";
            }
          } catch (locationError) {
            console.log("Error getting location:", locationError);
            Alert.alert(
              "Location Error", 
              "Unable to get current location. Photo will be saved without location data."
            );
          }
        }

        const photo = await cameraRef.current.takePictureAsync({
          exif: true,
          quality: Platform.OS === 'android' ? 0.7 : 0.8,
          skipProcessing: Platform.OS === 'android',
        });

        // Create photo object with metadata
        const photoWithMetadata = {
          uri: photo.uri,
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          timestamp: new Date().toISOString(),
          address: address || "Location unavailable",
        };

        await onPhotoTaken(photoWithMetadata);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    } finally {
      setIsUploading(false); 
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <View style={styles.noAccessContainer}>
        <Text style={styles.noAccessText}>Loading camera...</Text>
        <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.noAccessContainer}>
        <Text style={styles.noAccessText}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        facing={facing}
        animateShutter={false}
      >
        {/* Camera flip button */}
        <TouchableOpacity 
          style={[styles.flipButton, isUploading && styles.disabledButton]} 
          onPress={toggleCameraFacing}
          disabled={isUploading}
        >
          <MaterialCommunityIcons 
            name="camera-flip-outline" 
            size={28} 
            color={isUploading ? "#999" : "#fff"} 
          />
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity 
          style={[styles.captureButton, isUploading && styles.disabledCaptureButton]} 
          onPress={takePicture}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="camera" size={36} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity 
          style={[styles.backButton, isUploading && styles.disabledButton]} 
          onPress={() => navigation.goBack()}
          disabled={isUploading}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={28} 
            color={isUploading ? "#999" : "#fff"} 
          />
        </TouchableOpacity>

        {/* Upload status */}
        {isUploading && (
          <View style={styles.uploadStatus}>
            <Text style={styles.uploadText}>Processing photo...</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#6200ee",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 4,
    borderColor: "#fff",
  },
  disabledCaptureButton: {
    backgroundColor: "#999",
  },
  flipButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "rgba(100,100,100,0.6)",
  },
  uploadStatus: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  noAccessText: {
    color: "#6200ee",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});