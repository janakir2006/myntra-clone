import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserData = async (
  _id: string,
  name: string,
  email: string
) => {
  await AsyncStorage.setItem("userid", _id);
  await AsyncStorage.setItem("userName", name);
  await AsyncStorage.setItem("userEmail", email);
};

export const getUserData = async () => {
  const _id = await AsyncStorage.getItem("userid");
  const name = await AsyncStorage.getItem("userName");
  const email = await AsyncStorage.getItem("userEmail");

  return { _id, name, email };
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem("userid");
  await AsyncStorage.removeItem("userName");
  await AsyncStorage.removeItem("userEmail");
};