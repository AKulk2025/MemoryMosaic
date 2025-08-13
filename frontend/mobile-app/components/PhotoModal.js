import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PhotoModal({ visible, onClose, photo }) {
  if (!photo) return null;

  // Handle both server photos (image_url) and local photos (uri)
  const imageSource = photo.image_url || photo.uri;
  
  console.log("PhotoModal photo data:", photo); // Debug log

  const formatDateTime = (isoString) => {
    if (!isoString) return { dateStr: "Unknown date", timeStr: "Unknown time" };
    
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(photo.timestamp || photo.created_at);

  // Get title - handle different data sources
  const getTitle = () => {
    if (photo.title) return photo.title;
    return "Untitled Photo";
  };

  // Get description/address - handle different data sources  
  const getDescription = () => {
    if (photo.description) return photo.description;
    if (photo.address) return photo.address;
    return "No description available";
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Photo */}
            {imageSource ? (
              <Image
                source={{ uri: imageSource }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) => {
                  console.log("Image load error:", error);
                }}
              />
            ) : (
              <View style={[styles.image, styles.noImageContainer]}>
                <MaterialCommunityIcons name="image-off" size={50} color="#ccc" />
                <Text style={styles.noImageText}>Image not available</Text>
              </View>
            )}

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.photoTitle}>{getTitle()}</Text>
            </View>

            {/* Metadata */}
            <View style={styles.metadataContainer}>
              {/* Date and Time */}
              <View style={styles.metadataRow}>
                <MaterialCommunityIcons 
                  name="calendar-clock" 
                  size={20} 
                  color="#6200ee" 
                  style={styles.metadataIcon}
                />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>When</Text>
                  <Text style={styles.metadataValue}>${dateStr}</Text>
                  <Text style={styles.metadataTime}>${timeStr}</Text>
                </View>
              </View>

              {/* Location */}
              <View style={styles.metadataRow}>
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={20} 
                  color="#6200ee" 
                  style={styles.metadataIcon}
                />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Where</Text>
                  <Text style={styles.metadataValue}>
                    {getDescription()}
                  </Text>
                  {photo.latitude && photo.longitude && (
                    <Text style={styles.coordinatesText}>
                      {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Photo source indicator */}
              <View style={styles.metadataRow}>
                <MaterialCommunityIcons 
                  name={photo.image_url ? "cloud-check" : "cellphone"} 
                  size={20} 
                  color={photo.image_url ? "#4CAF50" : "#FF9800"} 
                  style={styles.metadataIcon}
                />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Status</Text>
                  <Text style={styles.metadataValue}>
                    {photo.image_url ? "Synced to cloud" : "Stored locally"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="share" size={20} color="#6200ee" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="download" size={20} color="#6200ee" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="delete" size={20} color="#ff4757" />
                <Text style={[styles.actionButtonText, { color: '#ff4757' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxWidth: "90%",
    maxHeight: "85%",
    width: 350,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noImageText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 8,
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  photoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  metadataContainer: {
    width: "100%",
    padding: 20,
    paddingTop: 10,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  metadataIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  metadataTextContainer: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    lineHeight: 22,
  },
  metadataTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  coordinatesText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontFamily: "monospace",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    alignItems: "center",
    padding: 10,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#6200ee",
    marginTop: 4,
    fontWeight: "500",
  },
});