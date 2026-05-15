import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  sections: string[];
  selectedSection: string;
  onSelect: (section: string) => void;
};

export default function SectionDropdown({
  sections,
  selectedSection,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <Pressable
          key={section}
          style={[
            styles.button,
            selectedSection === section &&
              styles.selectedButton,
          ]}
          onPress={() => onSelect(section)}
        >
          <Text style={styles.text}>
            {section}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
  },

  selectedButton: {
    backgroundColor: "#c7d2fe",
  },

  text: {
    fontWeight: "500",
  },
});