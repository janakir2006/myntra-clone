import { useState, useEffect, useRef } from "react";
import { addLocalRecentlyViewed } from "@/utils/recentlyViewedStorage";
import { useAppTheme } from "@/context/ThemeContext";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, ShoppingBag } from "lucide-react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [product, setproduct] = useState<any>(null);
  const [iswishlist, setiswishlist] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setIsLoading(true);

        console.log("OPENING PRODUCT ID:", id);
        const product = await axios.get(`https://myntra-backend-fn7s.onrender.com/product/${id}`);

        setproduct(product.data);
        await addLocalRecentlyViewed(String(id));

        if (user?._id) {
          await axios.post("https://myntra-backend-fn7s.onrender.com/api/recently-viewed", {
            userId: user._id,
            productId: id,
          });

          const recRes = await axios.get(
            `https://myntra-backend-fn7s.onrender.com/recommendations/${user._id}?currentProductId=${id}`
          );

          setRecommendations(recRes.data.recommendations || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchproduct();
  }, [id, user]);

  useEffect(() => {
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [product, currentImageIndex]);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    autoScrollTimer.current = setInterval(() => {
      if (product?.images?.length > 0 && scrollViewRef.current) {
        const nextIndex = (currentImageIndex + 1) % product.images.length;

        scrollViewRef.current.scrollTo({
          x: nextIndex * width,
          animated: true,
        });

        setCurrentImageIndex(nextIndex);
      }
    }, 3000);
  };

  const handleAddwishlist = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await axios.post("https://myntra-backend-fn7s.onrender.com/wishlist", {
        userId: user._id,
        productId: id,
      });

      setiswishlist(true);
      router.push("/wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBag = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    try {
      setLoading(true);

      await axios.post("https://myntra-backend-fn7s.onrender.com/bag", {
        userId: user._id,
        productId: id,
        size: selectedSize,
        quantity: 1,
      });

      router.push("/bag");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.round(contentOffset.x / width);
    setCurrentImageIndex(imageIndex);

    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      startAutoScroll();
    }
  };

  if (isLoading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {product.images?.map((image: any, index: any) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[styles.productImage, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {product.images?.map((_: any, index: any) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      currentImageIndex === index
                        ? theme.primary
                        : theme.border,
                  },
                  currentImageIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.brand, { color: theme.mutedText }]}>
                {product.brand}
              </Text>

              <Text style={[styles.name, { color: theme.text }]}>
                {product.name}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.wishlistButton}
              onPress={handleAddwishlist}
            >
              <Heart
                size={26}
                color={iswishlist ? theme.primary : theme.mutedText}
                fill={iswishlist ? theme.primary : "none"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.text }]}>
              ₹{product.price}
            </Text>

            <Text style={[styles.discount, { color: theme.primary }]}>
              {product.discount}
            </Text>
          </View>

          <Text style={[styles.description, { color: theme.mutedText }]}>
            {product.description}
          </Text>

          <View style={styles.sizeSection}>
            <Text style={[styles.sizeTitle, { color: theme.text }]}>
              Select Size
            </Text>

            <View style={styles.sizeGrid}>
              {product.sizes?.map((size: any) => {
                const isSelected = selectedSize === size;

                return (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      {
                        borderColor: isSelected
                          ? theme.primary
                          : theme.border,
                        backgroundColor: isSelected
                          ? theme.primaryLight
                          : theme.background,
                      },
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        {
                          color: isSelected ? theme.primary : theme.text,
                        },
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {recommendations.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text
                style={[
                  styles.recommendationTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                You May Also Like
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recommendationScroll}
              >
                {recommendations.map((item: any) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[
                      styles.recommendationCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => router.push(`/product/${item._id}`)}
                  >
                    <Image
                      source={{
                        uri: item.images?.[0],
                      }}
                      style={styles.recommendationImage}
                    />

                    <View style={styles.recommendationInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.recommendationName,
                          { color: theme.text },
                        ]}
                      >
                        {item.name}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={[
                          styles.recommendationBrand,
                          { color: theme.mutedText },
                        ]}
                      >
                        {item.brand}
                      </Text>

                      <Text
                        style={[
                          styles.recommendationPrice,
                          { color: theme.primary },
                        ]}
                      >
                        ₹{item.price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.addToBagButton, { backgroundColor: theme.primary }]}
          onPress={handleAddToBag}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <ShoppingBag size={20} color="#fff" />
              <Text style={styles.addToBagText}>ADD TO BAG</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  carouselContainer: {
    position: "relative",
  },

  productImage: {
    height: 400,
  },

  pagination: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  content: {
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brand: {
    fontSize: 16,
    marginBottom: 5,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  wishlistButton: {
    padding: 10,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },

  discount: {
    fontSize: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },

  sizeSection: {
    marginBottom: 20,
  },

  sizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  sizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sizeText: {
    fontSize: 16,
  },

  recommendationSection: {
    marginTop: 25,
    marginBottom: 20,
  },

  recommendationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  recommendationScroll: {
    marginTop: 5,
  },

  recommendationCard: {
    width: 170,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },

  recommendationImage: {
    width: "100%",
    height: 220,
  },

  recommendationInfo: {
    padding: 10,
  },

  recommendationName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },

  recommendationBrand: {
    fontSize: 13,
    marginBottom: 4,
  },

  recommendationPrice: {
    fontSize: 15,
    fontWeight: "bold",
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
  },

  addToBagButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },

  addToBagText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});