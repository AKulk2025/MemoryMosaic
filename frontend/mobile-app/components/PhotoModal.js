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

  const formatDateTime = (isoString) => {
    if (!isoString) return "Unknown time";
    
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

  const { dateStr, timeStr } = formatDateTime(photo.timestamp);

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
            <Image
              source={{ uri: photo.uri }}
              style={styles.image}
              resizeMode="cover"
            />

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
                  <Text style={styles.metadataValue}>{dateStr}</Text>
                  <Text style={styles.metadataTime}>{timeStr}</Text>
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
                    {photo.address || "Unknown location"}
                  </Text>
                  {photo.latitude && photo.longitude && (
                    <Text style={styles.coordinatesText}>
                      {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                    </Text>
                  )}
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
  metadataContainer: {
    width: "100%",
    padding: 20,
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