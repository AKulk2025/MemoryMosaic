# Memory Mosaic

Memory Mosaic is a React Native mobile app that displays a world map, allows users to take photos, extracts geolocation metadata, and displays pins on the map at photo locations. Tapping a pin shows the photo. The UI is modern and visually appealing.

## Features

- Interactive world map with zoom and movement (Google/Apple Maps style)
- Floating plus button to open the camera
- Take a photo and extract geolocation metadata
- Send photo and metadata to backend for storage
- Display pins on the map at photo locations
- Tap a pin to view the photo
- Modern, visually appealing UI

## Tech Stack

- React Native
- react-native-maps
- react-native-paper
- expo-camera (or react-native-camera)
- expo-location (for permissions)
- expo-image-picker (for photo selection, fallback)
- exif-js or expo-media-library (for EXIF extraction)

## Setup

1. Install dependencies: `npm install` or `yarn install`
2. Start the app: `npx expo start` (if using Expo)
3. Follow prompts to run on iOS/Android simulator or device

## Notes

- Backend endpoints must be configured in the app for photo upload/storage.
- Some features require device permissions (camera, location, media library).
- Replace any placeholder assets with your own.
