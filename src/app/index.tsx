import FilterModal from "@/components/FilterModal";
import { ImageCard } from "@/components/ImageCard";
import ImageDetailModal from "@/components/ImageDetaillModal";
import { COLORS, SIZES } from "@/constants/theam";
import { fetchWallpapers, PixabayImage } from "@/services/pixabay";
import { Ionicons } from "@expo/vector-icons";
import MasonryList from "@react-native-seoul/masonry-list";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PixabayImage | null>(null);

  const loadWallpapers = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);

      const nextPage = reset ? 1 : page + 1;
      const newWallpapers = await fetchWallpapers(
        searchQuery,
        category,
        color,
        nextPage,
      );

      if (reset) {
        setWallpapers(newWallpapers!);
        setPage(1);
      } else {
        setWallpapers((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNew = newWallpapers?.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prev, ...uniqueNew!];
        });

        setPage(nextPage);
      }

      setLoading(false);
    },
    [page, searchQuery, category, color, loading],
  );

  useEffect(() => {
    loadWallpapers(true);
  }, [searchQuery, category, color]);

  const handleSearch = () => {
    setSearchQuery(query);
  };

  const renderItem = ({ item, i }: { item: any; i: number }) => (
    <ImageCard
      item={item}
      onPress={() => setSelectedImage(item)}
      style={{ marginLeft: i % 2 === 0 ? 0 : 12 }}
    />
  );

  const handleApplyFilters = (newCategory: string, newColor: string) => {
    setCategory(newCategory);
    setColor(newColor);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appTitle}>
          Pixel<Text style={styles.appTitleHighlight}>Wall</Text>
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Wallpapers.."
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => {
                setQuery("");
                setSearchQuery("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => loadWallpapers(true)}
            style={styles.iconButton}
          >
            <Ionicons name="refresh" size={20} color={COLORS.text} />
          </Pressable>
          <Pressable
            onPress={() => {
              setQuery("");
              setSearchQuery("");
              setCategory("");
              setColor("");
              // loadWallpapers will triggered by useEffect due to state changes
            }}
            style={styles.iconButton}
          >
            <Ionicons name="home" size={20} color={COLORS.text} />
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.filterButton,
            (category || color) && styles.filterButtonActive,
          ]}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons
            name="options"
            size={24}
            color={category || color ? COLORS.white : COLORS.text}
          />
        </Pressable>

        {/* TODO: ACTIONS */}
      </View>
      <View style={styles.content}>
        <MasonryList
          data={wallpapers}
          keyExtractor={(item): string => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onEndReached={() => loadWallpapers(false)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && wallpapers.length > 0 ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && wallpapers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="images-outline"
                  size={64}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.emptyText}>No wallpapers found</Text>
              </View>
            ) : null
          }
          refreshing={loading && wallpapers.length === 0}
          onRefresh={() => loadWallpapers(true)}
        />
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        selectedCategory={category}
        selectedColor={color}
      />

      <ImageDetailModal
        visible={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  appTitleHighlight: {
    color: COLORS.primary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
