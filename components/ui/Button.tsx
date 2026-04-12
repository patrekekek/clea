import React from "react";
import {
    Text,
    TouchableOpacity, 
    GestureResponderEvent,
    StyleProp,
    ViewStyle
} from "react-native";
import { colors, spacing } from "../../theme";

type Props = {
    title: string,
    onPress: (event: GestureResponderEvent) => void,
    variant?: "primary" | "secondary",
    style?: StyleProp<ViewStyle>
}

export default function Button({ title, onPress, variant = "primary", style } : Props) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
      {
        backgroundColor: isPrimary ? colors.primary : "#f3f4f6",
        padding: spacing.md,
        borderRadius: 10,
        alignItems: "center",
      },
      style
    ]}
    >
      <Text
        style={{
          color: isPrimary ? "#fff" : colors.textPrimary,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}