import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from "react-native";

import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

import { UserRole } from "../../context/AuthContext"


export default function Register() {

  const { signUp } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",

    email: "",

    password: "",
    confirmPassword: "",

    role: "teacher" as UserRole, //not type safe yet, fix soon hehehhehe

    subject: "",
  });

  const update = (key: string, value: string) => {
    setForm( prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Alert.alert(
        "missing fields",
        "Please complete details"
      );
      return;
    }

    if ( form.password !== form.confirmPassword ) {
      Alert.alert (
        "password mismatch",
        "Passwords do not match."
      )
      return;
    }

    try {
      setLoading(true);

      await signUp({
        email: form.email,
        password: form.password,

        firstName: form.firstName,
        lastName: form.lastName,

        middleName: form.middleName,

        role: form.role,

        subject: form.subject,
      });

      Alert.alert(
        "success",
        "Account created successfully."
      );

      router.replace("/login")

    } catch (error: any) {

      Alert.alert(
        "Registration failed",
        error.message
      )

    } finally {

      setLoading(false);
    }



  };

  return (
      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Register your CLEA account
        </Text>

        <View style={styles.card}>

          <View style={styles.left}>
            <Image
              source={require("../../assets/register.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>

            {/* NAME ROW */}

            <View style={styles.row}>

              <View style={styles.col}>
                <Text style={styles.label}>
                  First Name *
                </Text>

                <TextInput
                  style={styles.input}
                  value={form.firstName}
                  placeholder="First Name"
                  onChangeText={(v) =>
                    update("firstName", v)
                  }
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>
                  Middle Name
                </Text>

                <TextInput
                  style={styles.input}
                  value={form.middleName}
                  placeholder="Middle Name"
                  onChangeText={(v) =>
                    update("middleName", v)
                  }
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>
                  Last Name *
                </Text>

                <TextInput
                  style={styles.input}
                  value={form.lastName}
                  placeholder="Last Name"
                  onChangeText={(v) =>
                    update("lastName", v)
                  }
                />
              </View>

            </View>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email *
            </Text>

            <TextInput
              style={styles.input}
              value={form.email}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(v) =>
                update("email", v)
              }
            />

            {/* ROLE */}

            <Text style={styles.label}>
              Role *
            </Text>

            <View style={styles.row}>

              <TouchableOpacity
                style={styles.roleButton}
                onPress={() =>
                  update("role", "teacher")
                }
              >
                <Text>Teacher</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleButton}
                onPress={() =>
                  update("role", "admin")
                }
              >
                <Text>Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleButton}
                onPress={() =>
                  update("role", "parent")
                }
              >
                <Text>Parent</Text>
              </TouchableOpacity>

            </View>

            {/* SUBJECT */}

            <Text style={styles.label}>
              Subject
            </Text>

            <TextInput
              style={styles.input}
              value={form.subject}
              placeholder="Math"
              onChangeText={(v) =>
                update("subject", v)
              }
            />

            {/* PASSWORD */}

            <View style={styles.row}>

              <View style={styles.col}>
                <Text style={styles.label}>
                  Password *
                </Text>

                <TextInput
                  style={styles.input}
                  value={form.password}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={(v) =>
                    update("password", v)
                  }
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>
                  Confirm Password *
                </Text>

                <TextInput
                  style={styles.input}
                  value={form.confirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={(v) =>
                    update(
                      "confirmPassword",
                      v
                    )
                  }
                />
              </View>

            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >

              <Text style={styles.buttonText}>
                {
                  loading
                    ? "Creating..."
                    : "Register"
                }
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/login")
              }
            >

              <Text style={styles.login}>
                Already have an account?
                Log In
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
    width: "100%",
    maxWidth: 900,
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
  roleButton: {
    flex: 1,

    paddingVertical: 12,

    borderWidth: 1,
    borderColor: "#D0D5DD",

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    marginHorizontal: 4,
  }
});