const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentMode: {
      type: String,
      enum: ["Card", "UPI", "COD", "NetBanking", "Wallet"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "success", "failed", "refunded"],
      default: "created",
      index: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, paidAt: -1 });
transactionSchema.index({ status: 1, paidAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);