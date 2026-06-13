import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function CategoryPage() {
  const { name } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{name} Category</Text>
    </View>
  );
}