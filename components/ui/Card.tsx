import React, { ReactNode } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { colors, spacing } from "../../theme";

type Props = {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}

export default function Card({ children, style } : Props) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          padding: spacing.lg,
          borderRadius: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}