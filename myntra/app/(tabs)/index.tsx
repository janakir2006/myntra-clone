import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";

const categories = [
  {
    id: 1,
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1618244972963-dbad0c4abf18?w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop",
  },
];

const products = [
  {
    id: "6a28fbc0113accbc395c891b",
    name: "Baggy Jeans",
    brand: "H&M",
    price: "₹1499",
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop",
  },
];

const deals = [
  {
    id: 1,
    title: "Under ₹599",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "40-70% Off",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop",
  },
];

export default function Home() {
  const router = useRouter();
  const [product] = useState(products);
  const [categoryList] = useState(categories);
  const { user } = useAuth();
  const { theme, toggleTheme, themeName } = useAppTheme();

  const handleProductPress = (productId: string) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/product/${productId}`);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
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
        <Text style={[styles.logo, { color: theme.text }]}>MYNTRA</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color={theme.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}
          >
            <Text style={[styles.themeButtonText, { color: theme.primary }]}>
              {themeName === "light" ? "Dark" : "Light"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
        }}
        style={styles.banner}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            SHOP BY CATEGORY
          </Text>

          <TouchableOpacity style={styles.viewAll}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              View All
            </Text>
            <ChevronRight size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryList.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
              />
              <Text style={[styles.categoryName, { color: theme.text }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            DEALS OF THE DAY
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {deals.map((deal) => (
            <TouchableOpacity key={deal.id} style={styles.dealCard}>
              <Image source={{ uri: deal.image }} style={styles.dealImage} />
              <View style={styles.dealOverlay}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          TRENDING NOW
        </Text>

        <View style={styles.productsGrid}>
          {product.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.productCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => handleProductPress(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />

              <View style={styles.productInfo}>
                <Text style={[styles.brandName, { color: theme.mutedText }]}>
                  {item.brand}
                </Text>

                <Text style={[styles.productName, { color: theme.text }]}>
                  {item.name}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={[styles.productPrice, { color: theme.text }]}>
                    {item.price}
                  </Text>
                  <Text style={[styles.discount, { color: theme.primary }]}>
                    {item.discount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logo: {
    fontSize: 24,
    fontWeight: "bold",
  },

  searchButton: {
    padding: 8,
  },

  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },

  themeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  section: {
    padding: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    marginRight: 5,
  },

  categoryCard: {
    width: 100,
    marginHorizontal: 8,
  },

  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  categoryName: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },

  dealCard: {
    width: 280,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 10,
    overflow: "hidden",
  },

  dealImage: {
    width: "100%",
    height: "100%",
  },

  dealOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },

  dealTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },

  productCard: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  productImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  productInfo: {
    padding: 10,
  },

  brandName: {
    fontSize: 14,
    marginBottom: 2,
  },

  productName: {
    fontSize: 16,
    marginBottom: 5,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },

  discount: {
    fontSize: 14,
    fontWeight: "500",
  },
});