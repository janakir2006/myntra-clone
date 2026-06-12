import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import axios from "axios";
import { useRouter } from "expo-router";
import { CreditCard, MapPin, Truck } from "lucide-react-native";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const handleplaceorder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`http://localhost:5000/order/create/${user._id}`, {
        shippingAddress: "123 Main Street, Apt 4B, New York, NY, 10001",
        paymentMethod: "Card",
      });

      router.push("/orders");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
          Checkout
        </Text>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <MapPin size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Shipping Address
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Full Name"
              placeholderTextColor={theme.mutedText}
              defaultValue="John Doe"
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Address Line 1"
              placeholderTextColor={theme.mutedText}
              defaultValue="123 Main Street"
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Address Line 2"
              placeholderTextColor={theme.mutedText}
              defaultValue="Apt 4B"
            />

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="City"
                placeholderTextColor={theme.mutedText}
                defaultValue="New York"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="State"
                placeholderTextColor={theme.mutedText}
                defaultValue="NY"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Postal Code"
                placeholderTextColor={theme.mutedText}
                defaultValue="10001"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Country"
                placeholderTextColor={theme.mutedText}
                defaultValue="United States"
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <CreditCard size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Payment Method
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Card Number"
              placeholderTextColor={theme.mutedText}
              defaultValue="**** **** **** 4242"
            />

            <View style={styles.row}>
              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Expiry Date"
                placeholderTextColor={theme.mutedText}
                defaultValue="12/25"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.halfInput,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="CVV"
                placeholderTextColor={theme.mutedText}
                defaultValue="***"
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Truck size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Order Summary
            </Text>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ₹3,798
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ₹99
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.mutedText }]}>
                Tax
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ₹190
              </Text>
            </View>

            <View
              style={[
                styles.summaryRow,
                styles.total,
                { borderTopColor: theme.border },
              ]}
            >
              <Text style={[styles.totalLabel, { color: theme.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                ₹4,087
              </Text>
            </View>
          </View>
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
          style={[styles.placeOrderButton, { backgroundColor: theme.primary }]}
          onPress={handleplaceorder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  section: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  form: {
    gap: 10,
  },

  input: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  summary: {
    gap: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  summaryLabel: {
    fontSize: 16,
  },

  summaryValue: {
    fontSize: 16,
  },

  total: {
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    padding: 15,
    borderTopWidth: 1,
  },

  placeOrderButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  placeOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});