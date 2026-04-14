import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    department: "",
    position: "",
    salary: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register ta, cher</Text>
      <Text style={styles.subtitle}>
        Fill in the details to create your account
      </Text>

      <View style={styles.card}>
        {/* LEFT ILLUSTRATION */}
        <View style={styles.left}>
          <Image
            source={require("../../assets/register.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* RIGHT FORM */}
        <View style={styles.form}>
          {/* NAME ROW */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={(v) => update("firstName", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Middle Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Middle Name"
                onChangeText={(v) => update("middleName", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={(v) => update("lastName", v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Username *</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(v) => update("username", v)}
          />

          {/* DEPARTMENT + POSITION */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Office / Department</Text>
              <TextInput
                style={styles.input}
                placeholder="Office / Department"
                onChangeText={(v) => update("department", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Position</Text>
              <TextInput
                style={styles.input}
                placeholder="Position"
                onChangeText={(v) => update("position", v)}
              />
            </View>
          </View>

          {/* SALARY + EMAIL */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Salary</Text>
              <TextInput
                style={styles.input}
                placeholder="Salary"
                onChangeText={(v) => update("salary", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(v) => update("email", v)}
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={(v) => update("password", v)}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                onChangeText={(v) => update("confirmPassword", v)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.login}>
              Already have an account? Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#f4f6f9",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },

  subtitle: {
    marginBottom: 20,
    color: "#6b7280",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    width: 900,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  left: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 160,
    height: 160,
  },

  form: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  col: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  login: {
    textAlign: "center",
    marginTop: 10,
    color: "#2563eb",
    fontSize: 13,
  },
});