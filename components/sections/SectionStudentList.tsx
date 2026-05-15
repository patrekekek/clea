import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { colors } from "../../theme/colors";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  pending?: boolean;
};

type Props = {
  students: Student[];
};

export default function SectionStudentList({
  students,
}: Props) {
  const router = useRouter();

  if (students.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No students found.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          
          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {item.lastName}, {item.firstName}
            </Text>

            {item.pending && (
              <Text style={styles.pending}>
                Not synced
              </Text>
            )}
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(`/sections/${item.id}`)
            }
          >
            <Text style={styles.editText}>
              Edit
            </Text>
          </Pressable>

        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },

  emptyContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "gray",
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
  },

  pending: {
    fontSize: 12,
    color: "orange",
    marginTop: 4,
  },

  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  editText: {
    color: "white",
    fontWeight: "600",
  },
});