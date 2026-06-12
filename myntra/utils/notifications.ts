import { Platform } from "react-native";
import axios from "axios";

export const registerForPushNotifications = async (userId: string) => {
  try {
    if (Platform.OS === "web") {
      console.log("Push notifications disabled on web");
      return;
    }

    const Device = await import("expo-device");
    const Notifications = await import("expo-notifications");

    if (!Device.default?.isDevice && !Device.isDevice) {
      console.log("Push notifications require a physical device");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    await axios.post(
      "https://myntra-backend-fn7s.onrender.com/notification/register-token",
      {
        userId,
        token,
        platform: Platform.OS,
      }
    );

    console.log("Push token registered:", token);
  } catch (error) {
    console.log("Push notification registration error:", error);
  }
};