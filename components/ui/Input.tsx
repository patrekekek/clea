import React from "react";
import { 
    View, 
    Text,
    TextInput,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import { colors, spacing } from "../../theme";

type Props = {
    label?: string,
    value: string,
    onChangeText: (text: string) => void,
    multiline?: boolean,
    containerStyle?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<ViewStyle>,
    labelStyle?: StyleProp<TextStyle>
}

export default function Input({
  label,
  value,
  onChangeText,
  multiline = false,
} : Props ) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <Text
          style={{
            marginBottom: 6,
            fontWeight: "600",
            color: colors.textPrimary,
          }}
        >
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: spacing.md,
          backgroundColor: "#fff",
          height: multiline ? 100 : undefined,
        }}
      />
    </View>
  );
}