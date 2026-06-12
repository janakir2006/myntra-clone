const { Expo } = require("expo-server-sdk");
const NotificationToken = require("../models/NotificationToken");

const expo = new Expo();

const sendPushNotification = async ({ userId, title, body, data = {} }) => {
  const tokens = await NotificationToken.find({
    userId,
    isActive: true,
  });

  const messages = [];

  for (const item of tokens) {
    if (!Expo.isExpoPushToken(item.token)) {
      item.isActive = false;
      await item.save();
      continue;
    }

    messages.push({
      to: item.token,
      sound: "default",
      title,
      body,
      data,
    });
  }

  if (messages.length === 0) {
    console.log("No valid push tokens found");
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      try {
        attempts++;

        const tickets = await expo.sendPushNotificationsAsync(chunk);

        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];

          if (ticket.status === "error") {
            console.log("Notification ticket error:", ticket);

            if (ticket.details?.error === "DeviceNotRegistered") {
              const invalidToken = chunk[i].to;

              await NotificationToken.findOneAndUpdate(
                { token: invalidToken },
                { isActive: false }
              );
            }
          }
        }

        success = true;
      } catch (error) {
        console.log(`Push attempt ${attempts} failed`, error.message);

        if (attempts >= 3) {
          console.log("Push notification failed after 3 attempts");
        }
      }
    }
  }
};

module.exports = { sendPushNotification };