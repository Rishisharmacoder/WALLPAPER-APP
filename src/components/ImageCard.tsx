import { COLORS, SHADOWS, SIZES } from "@/constants/theam";
import { PixabayImage } from "@/services/pixabay";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface ImageCardProps {
  item: PixabayImage;
  onPress: () => void;
  style?: any;
}

export const ImageCard = ({ item, onPress, style }: ImageCardProps) => {
  const getAspectRatio = () => {
    return item.webformatWidth / item.webformatHeight;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: item.webformatURL }}
        style={[styles.image, { aspectRatio: getAspectRatio() }]}
        transition={500}
        contentFit="cover"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    borderRadius: SIZES.borderRadius,
  },
});
