//container for everything

import React, { ReactNode } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { colors, spacing } from "../theme";

type Props = {
    children: ReactNode;
}


export default function AppContainer({ children }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 1000,
          alignSelf: "center", // ✅ centers content
          paddingHorizontal: isMobile ? spacing.md : spacing.lg,
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
}