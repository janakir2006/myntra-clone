import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";

export default function Transactions() {
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 5;

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let url = `http://localhost:5000/transaction/user/${user._id}?page=${page}&limit=${limit}&sortField=paidAt&sortOrder=${sortOrder}`;

      if (status) {
        url += `&status=${status}`;
      }

      const res = await axios.get(url);

      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, page, status, sortOrder]);

  const downloadCSV = () => {
    if (!user) return;
    Linking.openURL(`http://localhost:5000/transaction/export/csv/${user._id}`);
  };

  const downloadReceipt = (transactionId: string) => {
    Linking.openURL(`http://localhost:5000/transaction/receipt/${transactionId}`);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Please login to view transactions
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.card, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Transactions
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={downloadCSV}
        >
          <Text style={styles.actionText}>Export CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          <Text style={styles.actionText}>
            {sortOrder === "desc" ? "Latest" : "Oldest"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {["", "success", "failed", "refunded"].map((item) => (
          <TouchableOpacity
            key={item || "all"}
            style={[
              styles.filterButton,
              {
                backgroundColor: status === item ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              setStatus(item);
              setPage(1);
            }}
          >
            <Text
              style={{
                color: status === item ? "#fff" : theme.text,
                fontWeight: "600",
              }}
            >
              {item === "" ? "All" : item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <ScrollView style={styles.content}>
          {transactions.map((item) => (
            <View
              key={item._id}
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.invoice, { color: theme.text }]}>
                {item.invoiceId}
              </Text>

              <Text style={[styles.text, { color: theme.mutedText }]}>
                Payment Mode: {item.paymentMode}
              </Text>

              <Text style={[styles.text, { color: theme.mutedText }]}>
                Amount: ₹{item.amount}
              </Text>

              <Text style={[styles.text, { color: theme.mutedText }]}>
                Status: {item.status}
              </Text>

              <Text style={[styles.text, { color: theme.mutedText }]}>
                Date: {new Date(item.paidAt).toLocaleString()}
              </Text>

              <TouchableOpacity
                style={[styles.receiptButton, { borderColor: theme.primary }]}
                onPress={() => downloadReceipt(item._id)}
              >
                <Text style={[styles.receiptText, { color: theme.primary }]}>
                  Download Receipt
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page === 1}
          style={[
            styles.pageButton,
            { backgroundColor: page === 1 ? theme.surface : theme.primary },
          ]}
          onPress={() => setPage(page - 1)}
        >
          <Text style={styles.pageText}>Prev</Text>
        </TouchableOpacity>

        <Text style={[styles.pageNumber, { color: theme.text }]}>
          Page {page}
        </Text>

        <TouchableOpacity
          disabled={page * limit >= total}
          style={[
            styles.pageButton,
            {
              backgroundColor:
                page * limit >= total ? theme.surface : theme.primary,
            },
          ]}
          onPress={() => setPage(page + 1)}
        >
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  title: {
    fontSize: 18,
    padding: 20,
    paddingTop: 60,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },

  actionButton: {
    padding: 12,
    borderRadius: 10,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },

  content: {
    flex: 1,
    padding: 15,
  },

  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },

  invoice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    marginBottom: 4,
  },

  receiptButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  receiptText: {
    fontWeight: "bold",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },

  pageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },

  pageNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
});