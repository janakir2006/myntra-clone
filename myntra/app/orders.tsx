import { useEffect, useState } from "react";
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
import {
  Package,
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react-native";
import React from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";

export default function Orders() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setorder] = useState<any>(null);

  useEffect(() => {
    const fetchorder = async () => {
      if (user) {
        try {
          setIsLoading(true);

          const product = await axios.get(
            `https://myntra-backend-fn7s.onrender.com/order/user/${user._id}`
          );

          setorder(product.data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchorder();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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

  if (!orders) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Order not found</Text>
      </View>
    );
  }

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
          My Orders
        </Text>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: theme.background }]}
      >
        {orders.map((order: any) => (
          <View
            key={order._id}
            style={[
              styles.orderCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.orderHeader,
                { borderBottomColor: theme.border },
              ]}
              onPress={() => toggleOrderDetails(order._id)}
            >
              <View>
                <Text style={[styles.orderId, { color: theme.text }]}>
                  Order #{order._id}
                </Text>

                <Text style={[styles.orderDate, { color: theme.mutedText }]}>
                  {order.date}
                </Text>
              </View>

              <View style={styles.statusContainer}>
                <Package size={16} color="#00b852" />
                <Text style={styles.orderStatus}>{order.status}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.itemsContainer}>
              {order.items?.map((item: any) => (
                <View key={item._id} style={styles.orderItem}>
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

                    <Text style={[styles.itemPrice, { color: theme.text }]}>
                      ₹{item.productId?.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {expandedOrder === order._id && (
              <View
                style={[
                  styles.orderDetails,
                  { borderTopColor: theme.border },
                ]}
              >
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <MapPin size={20} color={theme.icon} />
                    <Text style={[styles.detailTitle, { color: theme.text }]}>
                      Shipping Address
                    </Text>
                  </View>
                  <Text style={[styles.detailText, { color: theme.mutedText }]}>
                    {order.shippingAddress}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <CreditCard size={20} color={theme.icon} />
                    <Text style={[styles.detailTitle, { color: theme.text }]}>
                      Payment Method
                    </Text>
                  </View>
                  <Text style={[styles.detailText, { color: theme.mutedText }]}>
                    {order.paymentMethod}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Truck size={20} color={theme.icon} />
                    <Text style={[styles.detailTitle, { color: theme.text }]}>
                      Tracking Information
                    </Text>
                  </View>

                  <View style={styles.trackingInfo}>
                    <Text
                      style={[
                        styles.trackingNumber,
                        { color: theme.mutedText },
                      ]}
                    >
                      Tracking Number: {order.tracking?.number}
                    </Text>

                    <Text
                      style={[
                        styles.trackingCarrier,
                        { color: theme.mutedText },
                      ]}
                    >
                      Carrier: {order.tracking?.carrier}
                    </Text>
                  </View>

                  <View style={styles.timeline}>
                    {order.tracking?.timeline?.map(
                      (event: any, index: any) => (
                        <View key={index} style={styles.timelineEvent}>
                          <View
                            style={[
                              styles.timelinePoint,
                              { backgroundColor: theme.primary },
                            ]}
                          />

                          <View style={styles.timelineContent}>
                            <Text
                              style={[
                                styles.timelineStatus,
                                { color: theme.text },
                              ]}
                            >
                              {event.status}
                            </Text>

                            <Text
                              style={[
                                styles.timelineLocation,
                                { color: theme.mutedText },
                              ]}
                            >
                              {event.location}
                            </Text>

                            <Text
                              style={[
                                styles.timelineTimestamp,
                                { color: theme.mutedText },
                              ]}
                            >
                              {event.timestamp}
                            </Text>
                          </View>

                          {index !== order.tracking.timeline.length - 1 && (
                            <View
                              style={[
                                styles.timelineLine,
                                { backgroundColor: theme.border },
                              ]}
                            />
                          )}
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
            )}

            <View
              style={[
                styles.orderFooter,
                { borderTopColor: theme.border },
              ]}
            >
              <View style={styles.totalContainer}>
                <Text style={[styles.totalLabel, { color: theme.mutedText }]}>
                  Order Total
                </Text>

                <Text style={[styles.totalAmount, { color: theme.text }]}>
                  ₹{order.total}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => toggleOrderDetails(order._id)}
              >
                <Text
                  style={[
                    styles.detailsButtonText,
                    { color: theme.primary },
                  ]}
                >
                  {expandedOrder === order._id
                    ? "Hide Details"
                    : "View Details"}
                </Text>

                <ChevronRight size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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

  orderCard: {
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

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },

  orderDate: {
    fontSize: 14,
    marginTop: 2,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },

  orderStatus: {
    fontSize: 14,
    color: "#00b852",
    marginLeft: 5,
  },

  itemsContainer: {
    padding: 15,
  },

  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
  },

  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 5,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },

  brandName: {
    fontSize: 14,
    marginBottom: 2,
  },

  itemName: {
    fontSize: 16,
    marginBottom: 2,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },

  orderDetails: {
    padding: 15,
    borderTopWidth: 1,
  },

  detailSection: {
    marginBottom: 20,
  },

  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },

  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },

  trackingInfo: {
    marginBottom: 15,
  },

  trackingNumber: {
    fontSize: 14,
    marginBottom: 5,
  },

  trackingCarrier: {
    fontSize: 14,
  },

  timeline: {
    marginTop: 15,
  },

  timelineEvent: {
    flexDirection: "row",
    marginBottom: 20,
    position: "relative",
  },

  timelinePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
  },

  timelineLine: {
    position: "absolute",
    left: 5,
    top: 17,
    width: 2,
    height: "100%",
  },

  timelineContent: {
    marginLeft: 15,
    flex: 1,
  },

  timelineStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },

  timelineLocation: {
    fontSize: 14,
    marginBottom: 2,
  },

  timelineTimestamp: {
    fontSize: 12,
  },

  orderFooter: {
    padding: 15,
    borderTopWidth: 1,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  totalLabel: {
    fontSize: 16,
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  detailsButtonText: {
    fontSize: 16,
    marginRight: 5,
  },
});