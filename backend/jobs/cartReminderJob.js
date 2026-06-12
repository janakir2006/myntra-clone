const cron = require("node-cron");
const Bag = require("../models/Bag");
const { sendPushNotification } = require("../services/notificationService");

const startCartReminderJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("Running cart abandonment reminder job...");

      const carts = await Bag.aggregate([
        {
          $group: {
            _id: "$userId",
            itemCount: { $sum: 1 },
            lastUpdated: { $max: "$updatedAt" },
          },
        },
      ]);

      const now = new Date();

      for (const cart of carts) {
        const minutesInactive =
          (now - new Date(cart.lastUpdated)) / (1000 * 60);

        if (minutesInactive >= 30) {
          await sendPushNotification({
            userId: cart._id,
            title: "Items waiting in your bag",
            body: `You have ${cart.itemCount} item(s) waiting in your bag.`,
            data: {
              type: "CART_ABANDONMENT",
            },
          });
        }
      }
    } catch (error) {
      console.log("Cart reminder job error:", error);
    }
  });
};

module.exports = { startCartReminderJob };