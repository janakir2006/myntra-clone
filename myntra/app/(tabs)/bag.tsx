import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import axios from "axios";

export default function Bag() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [activeItems, setActiveItems] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchproduct();
  }, [user]);

  const fetchproduct = async () => {
    if (user) {
      try {
        setIsLoading(true);

        const bag = await axios.get(`https://myntra-backend-fn7s.onrender.com/bag/${user._id}`);

        setActiveItems(bag.data.activeItems || []);
        setSavedItems(bag.data.savedItems || []);
        setTotal(bag.data.activeTotal || 0);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handledelete = async (itemid: any) => {
    try {
      await axios.delete(`https://myntra-backend-fn7s.onrender.com/bag/${itemid}`);
      fetchproduct();
    } catch (error) {
      console.log(error);
    }
  };

  const saveForLater = async (itemId: string) => {
    try {
      await axios.patch(`https://myntra-backend-fn7s.onrender.com/bag/${itemId}/save-for-later`);
      fetchproduct();
    } catch (error) {
      console.log(error);
    }
  };

  const moveToCart = async (itemId: string) => {
    try {
      await axios.patch(`https://myntra-backend-fn7s.onrender.com/bag/${itemId}/move-to-cart`);
      fetchproduct();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.card,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Shopping Bag
          </Text>
        </View>

        <View style={styles.emptyState}>
          <ShoppingBag size={64} color={theme.primary} />

          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Please login to view your bag
          </Text>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

  const updateQuantity = async (item: any, newQuantity: number) => {
  try {
    if (newQuantity < 1) {
      await handledelete(item._id);
      return;
    }

    await axios.patch(`https://myntra-backend-fn7s.onrender.com/bag/${item._id}/quantity`, {
      quantity: newQuantity,
      version: item.version,
    });

    fetchproduct();
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
        "Could not update quantity. Please refresh and try again."
    );
  }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Shopping Bag
        </Text>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: theme.background }]}
      >
        {activeItems.length === 0 && savedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color={theme.primary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Your bag is empty
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Active Cart Items
            </Text>

            {activeItems.length === 0 ? (
              <Text style={[styles.emptySmallText, { color: theme.mutedText }]}>
                No active cart items
              </Text>
            ) : (
              activeItems.map((item: any) => (
                <View
                  key={item._id}
                  style={[
                    styles.bagItem,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.productId?.images?.[0] }}
                    style={styles.itemImage}
                  />

                  <View style={styles.itemInfo}>
                    <Text style={[styles.brandName, { color: theme.mutedText }]}>
                      {item.productId?.brand}
                    </Text>

                    <Text style={[styles.itemName, { color: theme.text }]}>
                      {item.productId?.name}
                    </Text>

                    <Text style={[styles.itemSize, { color: theme.mutedText }]}>
                      Size: {item.size}
                    </Text>

                    <Text style={[styles.itemPrice, { color: theme.text }]}>
                      ₹{item.productId?.price}
                    </Text>

                    {item.priceChanged && (
                      <Text style={styles.warningText}>
                        Price has changed since you added this item
                      </Text>
                    )}

                    {item.discontinued && (
                      <Text style={styles.errorText}>Product discontinued</Text>
                    )}

                    <TouchableOpacity
                      onPress={() => saveForLater(item._id)}
                      style={styles.saveLaterButton}
                    >
                      <Text style={[styles.saveLaterText, { color: theme.primary }]}>
                        Save For Later
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={[
                          styles.quantityButton,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => updateQuantity(item, item.quantity - 1)}
                      >
                        <Minus size={20} color={theme.text} />
                      </TouchableOpacity>

                      <Text style={[styles.quantity, { color: theme.text }]}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        style={[
                          styles.quantityButton,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => updateQuantity(item, item.quantity + 1)}
                      >
                        <Plus size={20} color={theme.text} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handledelete(item._id)}
                      >
                        <Trash2 size={20} color={theme.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}

            {savedItems.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Saved For Later
                </Text>

                {savedItems.map((item: any) => (
                  <View
                    key={item._id}
                    style={[
                      styles.bagItem,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: item.productId?.images?.[0] }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemInfo}>
                      <Text
                        style={[styles.brandName, { color: theme.mutedText }]}
                      >
                        {item.productId?.brand}
                      </Text>

                      <Text style={[styles.itemName, { color: theme.text }]}>
                        {item.productId?.name}
                      </Text>

                      <Text style={[styles.itemSize, { color: theme.mutedText }]}>
                        Size: {item.size}
                      </Text>

                      <Text style={[styles.itemPrice, { color: theme.text }]}>
                        ₹{item.productId?.price}
                      </Text>

                      {item.priceChanged && (
                        <Text style={styles.warningText}>
                          Price has changed since you saved this item
                        </Text>
                      )}

                      {item.discontinued && (
                        <Text style={styles.errorText}>Product discontinued</Text>
                      )}

                      <TouchableOpacity
                        onPress={() => moveToCart(item._id)}
                        style={styles.saveLaterButton}
                      >
                        <Text
                          style={[
                            styles.saveLaterText,
                            { color: theme.primary },
                          ]}
                        >
                          Move To Cart
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeSavedButton}
                        onPress={() => handledelete(item._id)}
                      >
                        <Trash2 size={20} color={theme.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
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
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.mutedText }]}>
            Total Amount
          </Text>

          <Text style={[styles.totalAmount, { color: theme.text }]}>
            ₹{total || 0}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            {
              backgroundColor:
                activeItems.length === 0 ? theme.surface : theme.primary,
            },
          ]}
          disabled={activeItems.length === 0}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
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

  content: {
    flex: 1,
    padding: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 5,
  },

  emptySmallText: {
    fontSize: 15,
    marginBottom: 20,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  bagItem: {
    flexDirection: "row",
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

  itemImage: {
    width: 100,
    height: 140,
  },

  itemInfo: {
    flex: 1,
    padding: 15,
  },

  brandName: {
    fontSize: 14,
    marginBottom: 5,
  },

  itemName: {
    fontSize: 16,
    marginBottom: 5,
  },

  itemSize: {
    fontSize: 14,
    marginBottom: 5,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  warningText: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 8,
  },

  errorText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 8,
  },

  saveLaterButton: {
    marginBottom: 10,
  },

  saveLaterText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
  },

  removeButton: {
    marginLeft: "auto",
  },

  removeSavedButton: {
    marginTop: 5,
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 16,
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },

  checkoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});