import { COLORS } from "@/constants/theam";
import { PixabayImage } from "@/services/pixabay";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
interface ImageDetailModalProps {
  visible: boolean;
  image: PixabayImage | null;
  onClose: () => void;
}

const ImageDetailModal = ({
  visible,
  image,
  onClose,
}: ImageDetailModalProps) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!image) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant permission to save images to your gallery.",
        );
        return;
      }

      const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache);
      const file = await FileSystem.File.downloadFileAsync(
        image.largeImageURL,
        cacheDir,
      );

      await MediaLibrary.saveToLibraryAsync(file.uri);
      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to download image.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);

      // Download the image to cache directory
      const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache);
      const file = await FileSystem.File.downloadFileAsync(
        image.largeImageURL,
        cacheDir,
      );

      // Share the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "image/jpeg",
          dialogTitle: "Share this image",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to share image");
    } finally {
      setSharing(false);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={30} color={COLORS.white} />
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image.largeImageURL }}
            style={[
              styles.image,
              { aspectRatio: image.imageWidth / image.imageHeight },
            ]}
            contentFit="contain"
            transition={300}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <View style={styles.tagContainer}>
              {image.tags
                .split(",")
                .slice(0, 3)
                .map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.trim()}</Text>
                  </View>
                ))}
            </View>
            <Text style={styles.userText}>By {image.user}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionButton}
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="download-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
              )}
              <Text style={styles.actionText}>Save</Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={handleShare}
              disabled={sharing}
            >
              {sharing ? (
                <ActivityIndicator color="white" />
              ) : (
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: COLORS.primary },
                  ]}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
              )}
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageDetailModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  imageContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "center", // Center vertical
    alignItems: "center", // Center horizontal
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  userText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 14,
  },
});
