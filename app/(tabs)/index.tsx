import { View, Text } from "react-native"
import { colors } from "../../theme/colors"

export default function Dashboard() {
  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>
        CLEA Dashboard
      </Text>
    </View>
  )
}

