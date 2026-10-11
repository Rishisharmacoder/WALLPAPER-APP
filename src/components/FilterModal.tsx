import { CATEGORIES, COLORS as FILTER_COLORS } from "@/constants/config";
import { COLORS, SIZES } from "@/constants/theam";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (category: string, color: string) => void;
  selectedCategory: string;
  selectedColor: string;
}

const FilterModal = ({
  visible,
  onClose,
  onApply,
  selectedCategory,
  selectedColor: initialColor,
}: FilterModalProps) => {
  const [activeCategory, setActiveCategory] = React.useState(selectedCategory);
  const [activeColor, setActiveColor] = React.useState(initialColor);

  useEffect(() => {
    setActiveCategory(selectedCategory);
    setActiveColor(initialColor);
  }, [visible, selectedCategory, initialColor]);

  const handleApply = () => {
    onApply(activeCategory, activeColor);
    onClose();
  };

  const handleReset = () => {
    setActiveCategory("");
    setActiveColor("");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Categories</Text>

            <View style={styles.chipsContainer}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.chip,
                    activeCategory === cat && styles.chipActive,
                  ]}
                  onPress={() =>
                    setActiveCategory(activeCategory === cat ? "" : cat)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      activeCategory === cat && styles.chipTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Colors</Text>

            <View style={styles.colorsContainer}>
              {FILTER_COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() =>
                    setActiveColor(activeColor === color ? "" : color)
                  }
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: color === "transparent" ? "#333" : color,
                    }, // 'transparent' visualization
                    activeColor === color && styles.colorOptionActive,
                  ]}
                >
                  {activeColor === color && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={
                        color === "white" ||
                        color === "yellow" ||
                        color === "transparent"
                          ? "black"
                          : "white"
                      }
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
    width: "100%",
    padding: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: "bold",
  },
  scrollContent: {
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  colorOptionActive: {
    borderColor: COLORS.text,
    transform: [{ scale: 1.1 }],
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    flex: 1,
    padding: 16,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  resetButtonText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    padding: 16,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
