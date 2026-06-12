const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const NotificationToken = require("../models/NotificationToken");
const { sendPushNotification } = require("../services/notificationService");

const notificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "Too many notification requests. Please try again later.",
  },
});

router.post("/register-token", async (req, res) => {
  try {
    const { userId, token, platform } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        message: "userId and token required",
      });
    }

    const existing = await NotificationToken.findOne({ token });

    if (existing) {
      existing.userId = userId;
      existing.platform = platform || "unknown";
      existing.lastUsedAt = new Date();
      existing.isActive = true;

      await existing.save();

      return res.json({
        message: "Token updated",
      });
    }

    await NotificationToken.create({
      userId,
      token,
      platform: platform || "unknown",
    });

    res.json({
      message: "Token registered",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/send-test", notificationLimiter, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    await sendPushNotification({
      userId,
      title: "Myntra Clone",
      body: "This is a test push notification!",
      data: {
        type: "TEST_NOTIFICATION",
      },
    });

    res.json({ message: "Test notification sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send test notification" });
  }
});

module.exports = router;