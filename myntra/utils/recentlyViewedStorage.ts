import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "recentlyViewedLocal";

export const addLocalRecentlyViewed = async (productId: string) => {
  const existing = await AsyncStorage.getItem(KEY);
  let history = existing ? JSON.parse(existing) : [];

  history = history.filter((item: any) => item.productId !== productId);

  history.unshift({
    productId,
    viewedAt: new Date().toISOString(),
  });

  history = history.slice(0, 20);

  await AsyncStorage.setItem(KEY, JSON.stringify(history));
};

export const getLocalRecentlyViewed = async () => {
  const existing = await AsyncStorage.getItem(KEY);
  return existing ? JSON.parse(existing) : [];
};

export const clearLocalRecentlyViewed = async () => {
  await AsyncStorage.removeItem(KEY);
};