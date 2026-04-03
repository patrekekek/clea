import { View, Text } from "react-native";
import { useState } from "react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { colors, spacing } from "../theme";

export default function ProfileCard() {
  const [name, setName] = useState("Juan Dela Cruz");
  const [bio, setBio] = useState("");
  const [feeling, setFeeling] = useState("");

  return (
    <Card>
      <View style={{ flexDirection: "row", gap: spacing.lg }}>
        
        {/* LEFT */}
        <View style={{ width: 140, alignItems: "center" }}>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 12,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
              {name.charAt(0)}
            </Text>
          </View>

          <Text style={{ marginTop: spacing.sm, fontWeight: "700" }}>
            {name}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={{ flex: 1 }}>
          <Input label="Full Name" value={name} onChangeText={setName} />
          <Input label="Bio" value={bio} onChangeText={setBio} multiline />
          <Input label="Feeling" value={feeling} onChangeText={setFeeling} />

          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <Button title="Save" onPress={() => {}} />
            <Button title="Reset" variant="secondary" onPress={() => {}} />
          </View>
        </View>

      </View>
    </Card>
  );
}