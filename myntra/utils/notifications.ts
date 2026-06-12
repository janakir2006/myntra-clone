import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import axios from "axios";

export const registerForPushNotifications = async (userId: string) => {
  try {
    if (!Device.isDevice) {
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

    await axios.post("https://myntra-backend-fn7s.onrender.com/notification/register-token", {
      userId,
      token,
      platform: Platform.OS,
    });

    console.log("Push token registered:", token);
  } catch (error) {
    console.log("Push notification registration error:", error);
  }
};