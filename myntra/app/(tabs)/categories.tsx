import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
import axios from "axios";
import { useAppTheme } from "@/context/ThemeContext";

export default function TabTwoScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          "https://myntra-backend-fn7s.onrender.com/product"
        );

        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredProducts =
    searchQuery.trim() === ""
      ? products
      : products.filter(
          (product: any) =>
            product.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.brand
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.category
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

  if (isLoading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.text,
            },
          ]}
        >
          Search Products
        </Text>
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Search
            size={20}
            color={theme.mutedText}
            style={styles.searchIcon}
          />

          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.text,
              },
            ]}
            placeholder="Search products, brands, categories..."
            placeholderTextColor={theme.mutedText}
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={theme.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product: any) => (
            <TouchableOpacity
              key={product._id}
              style={[
                styles.productCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() =>
                router.push(`/product/${product._id}` as any)
              }
            >
              <Image
                source={{
                  uri:
                    product.images?.[0] ||
                    "https://via.placeholder.com/300",
                }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text
                  style={[
                    styles.brandName,
                    {
                      color: theme.mutedText,
                    },
                  ]}
                >
                  {product.brand}
                </Text>

                <Text
                  style={[
                    styles.productName,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {product.name}
                </Text>

                <Text
                  style={[
                    styles.subcategoryText,
                    {
                      color: theme.primary,
                    },
                  ]}
                >
                  {product.category}
                </Text>

                <View style={styles.priceRow}>
                  <Text
                    style={[
                      styles.price,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    ₹{product.price}
                  </Text>

                  <Text
                    style={[
                      styles.discount,
                      {
                        color: theme.primary,
                      },
                    ]}
                  >
                    {product.discount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View
            style={{
              alignItems: "center",
              padding: 40,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
              }}
            >
              No products found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
  },

  header: {
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
  },

  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  content: {
    flex: 1,
  },

  categoriesGrid: {
    padding: 15,
  },

  categoryCard: {
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },

  categoryImage: {
    width: "100%",
    height: 150,
  },

  categoryInfo: {
    padding: 15,
  },

  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subcategories: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  subcategoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },

  subcategoryText: {
    fontSize: 14,
  },

  categoryDetail: {
    flex: 1,
    padding: 15,
  },

  categoryHeader: {
    marginBottom: 15,
  },

  backButton: {
    marginBottom: 10,
  },

  backButtonText: {
    fontSize: 16,
  },

  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  subcategoriesScroll: {
    marginBottom: 15,
  },

  subcategoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },

  subcategoryButtonText: {
    fontSize: 14,
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  productInfo: {
    padding: 10,
  },

  brandName: {
    fontSize: 14,
    marginBottom: 4,
  },

  productName: {
    fontSize: 16,
    marginBottom: 8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },

  discount: {
    fontSize: 14,
  },
});