const mongoose = require("mongoose");

const transactionAuditSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },

    eventType: {
      type: String,
      enum: ["created", "success", "failed", "refunded"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

transactionAuditSchema.index({ transactionId: 1 });
transactionAuditSchema.index({ eventType: 1 });

module.exports = mongoose.model("TransactionAudit", transactionAuditSchema);