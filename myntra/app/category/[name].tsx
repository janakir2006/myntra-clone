import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAppTheme } from "@/context/ThemeContext";

export default function CategoryPage() {
  const { name } = useLocalSearchParams();
  const { theme } = useAppTheme();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://myntra-backend-fn7s.onrender.com/product"
      );

      const filteredProducts = response.data.filter(
        (item: any) =>
          item.category.toLowerCase() === String(name).toLowerCase()
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {name} Products
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item: any) => item._id}
        numColumns={2}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text
                style={[
                  styles.brand,
                  { color: theme.mutedText },
                ]}
              >
                {item.brand}
              </Text>

              <Text
                style={[
                  styles.name,
                  { color: theme.text },
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.price,
                  { color: theme.text },
                ]}
              >
                ₹{item.price}
              </Text>

              <Text
                style={[
                  styles.discount,
                  { color: theme.primary },
                ]}
              >
                {item.discount}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  info: {
    padding: 10,
  },

  brand: {
    fontSize: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
  },

  discount: {
    fontSize: 14,
    marginTop: 4,
  },
});