import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert } from "react-native";
import MapScreen from "./components/MapScreen";
import CameraScreen from "./components/CameraScreen";

const Stack = createStackNavigator();

// Expo-specific backend URL configuration
const BACKEND_URL = __DEV__ 
  ? "http://COMP_IP:8000"  
  : "https://your-production-backend.com"; 

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch photos from backend on app start
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching photos from:", `${BACKEND_URL}/photos/`);
      
      const response = await fetch(`${BACKEND_URL}/photos/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPhotos(data);
      console.log("Photos fetched successfully:", data.length);
    } catch (error) {
      console.error("Error fetching photos:", error);
      Alert.alert("Error", "Failed to fetch photos from server. Make sure your backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhotoToBackend = async (photo) => {
    try {
      setIsLoading(true);
      console.log("Uploading photo to backend...", photo);
      
      // Create FormData for multipart upload - matching your backend exactly
      const formData = new FormData();
      
      // Add the image file
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
      });
      
      // Add form fields to match your backend parameters
      formData.append('title', photo.title || `Photo taken at ${new Date().toLocaleString()}`);
      formData.append('description', photo.address || photo.description || '');
      formData.append('latitude', photo.latitude.toString());
      formData.append('longitude', photo.longitude.toString());

      console.log("Sending request to:", `${BACKEND_URL}/photos/`);
      
      const response = await fetch(`${BACKEND_URL}/photos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Photo uploaded successfully:", result);
      
      // Refresh photos from server to get the latest data
      await fetchPhotos();
      
      Alert.alert("Success", "Photo uploaded successfully!");
      return result;
      
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Upload Error", `Failed to upload photo: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoTaken = async (photo) => {
    // Photo comes with location data, timestamp, and address from CameraScreen
    console.log("Photo taken:", photo);
    
    // Only process photos with valid coordinates
    if (photo.latitude && photo.longitude) {
      try {
        // Upload photo to backend
        await uploadPhotoToBackend(photo);
      } catch (error) {
        // If upload fails, add to local state as fallback
        console.log("Upload failed, keeping photo locally");
        const localPhoto = {
          ...photo,
          id: Date.now(),
          title: photo.title || `Photo taken at ${new Date().toLocaleString()}`,
          description: photo.address || '',
          image_url: photo.uri, // Use local URI for display
        };
        setPhotos(prevPhotos => [...prevPhotos, localPhoto]);
      }
    } else {
      console.log("Photo taken but no location available");
      Alert.alert(
        "Location Required", 
        "Please enable location services to save photos with location data."
      );
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map">
          {(props) => (
            <MapScreen 
              {...props} 
              photos={photos}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Camera">
          {(props) => (
            <CameraScreen 
              {...props} 
              onPhotoTaken={handlePhotoTaken}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}