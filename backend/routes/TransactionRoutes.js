const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const TransactionAudit = require("../models/TransactionAudit");
const fastcsv = require("fast-csv");
const PDFDocument = require("pdfkit");

router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      paymentId,
      paymentMode,
      amount,
    } = req.body;

    const existing = await Transaction.findOne({
      paymentId,
    });

    if (existing) {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existing,
      });
    }

    const invoiceId =
      "INV-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000);

    const transaction = await Transaction.create({
      userId,
      orderId,
      paymentId,
      paymentMode,
      amount,
      invoiceId,
      status: "success",
    });

    await TransactionAudit.create({
      transactionId: transaction._id,
      eventType: "created",
      message: "Transaction created successfully",
      metadata: {
        paymentId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const sortField = req.query.sortField || "paidAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const status = req.query.status;

    const query = {
      userId: req.params.userId,
    };

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .sort({
        [sortField]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      page,
      limit,
      total,
      transactions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/export/csv/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions-${userId}.csv`
    );

    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(res);

    const cursor = Transaction.find({ userId })
      .sort({ paidAt: -1 })
      .cursor();

    for await (const transaction of cursor) {
      csvStream.write({
        InvoiceID: transaction.invoiceId,
        PaymentID: transaction.paymentId,
        PaymentMode: transaction.paymentMode,
        Amount: transaction.amount,
        Status: transaction.status,
        PaidAt: transaction.paidAt,
      });
    }

    csvStream.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "CSV export failed",
    });
  }
});

router.get("/receipt/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    ).populate("userId", "fullName email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${transaction.invoiceId}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(22).text("Myntra Clone Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice ID: ${transaction.invoiceId}`);
    doc.text(`Transaction ID: ${transaction._id}`);
    doc.text(`Payment ID: ${transaction.paymentId}`);
    doc.text(`Payment Mode: ${transaction.paymentMode}`);
    doc.text(`Amount: ₹${transaction.amount}`);
    doc.text(`Status: ${transaction.status}`);
    doc.text(`Paid At: ${transaction.paidAt}`);
    doc.text(`Generated At: ${new Date().toISOString()}`);

    doc.moveDown();

    if (transaction.userId) {
      doc.text(`Customer Name: ${transaction.userId.fullName || "N/A"}`);
      doc.text(`Customer Email: ${transaction.userId.email || "N/A"}`);
    }

    doc.moveDown();
    doc.text("Thank you for shopping with us!", { align: "center" });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "PDF receipt generation failed",
    });
  }
});

router.patch("/:transactionId/status", async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!["failed", "refunded", "success"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const transaction = await Transaction.findById(req.params.transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    transaction.status = status;
    await transaction.save();

    await TransactionAudit.create({
      transactionId: transaction._id,
      eventType: status,
      message: message || `Transaction marked as ${status}`,
      metadata: {
        updatedAt: new Date().toISOString(),
      },
    });

    res.json({
      message: "Transaction status updated",
      transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Status update failed",
    });
  }
});

module.exports = router;