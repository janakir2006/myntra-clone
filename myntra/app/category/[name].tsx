import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();

  return (
    <View>
      <Text>{name} Products</Text>
    </View>
  );
}