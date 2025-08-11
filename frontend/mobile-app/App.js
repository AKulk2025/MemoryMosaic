import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./components/MapScreen";
import CameraScreen from "./components/CameraScreen";

const Stack = createStackNavigator();

export default function App() {
  const [photos, setPhotos] = useState([]);

  const handlePhotoTaken = (photo) => {
    // Photo now comes with location data, timestamp, and address from CameraScreen
    const newPhoto = {
      ...photo,
      id: Date.now(), // Add unique ID
    };
    
    // Only add photos with valid coordinates
    if (newPhoto.latitude && newPhoto.longitude) {
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
      console.log("Photo added:", newPhoto); // For debugging
    } else {
      // Fallback: use a default location or show an alert
      console.log("Photo taken but no location available");
      // You could add a default location or ask user to manually place the pin
    }
    // TODO: send photo and metadata to backend here
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map">
          {(props) => (
            <MapScreen {...props} photos={photos} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Camera">
          {(props) => (
            <CameraScreen {...props} onPhotoTaken={handlePhotoTaken} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}