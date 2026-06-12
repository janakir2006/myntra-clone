import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";

export default function Signup() {
  const { Signup } = useAuth();
  const { theme } = useAppTheme();

  const router = useRouter();

  const [isloading, setisloading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;

    const newErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      try {
        setisloading(true);
        await Signup(formData.fullName, formData.email, formData.password);
        router.replace("/(tabs)");
      } catch (error) {
        console.error(error);
      } finally {
        setisloading(false);
      }
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Image
        source={{
          uri: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        }}
        style={styles.backgroundImage}
      />

      <View
        style={[
          styles.formContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Create Account
        </Text>

        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Join Myntra and discover amazing fashion
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: errors.fullName ? theme.primary : theme.border,
              },
            ]}
            placeholder="Full Name"
            placeholderTextColor={theme.mutedText}
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />

          {errors.fullName ? (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.fullName}
            </Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: errors.email ? theme.primary : theme.border,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.mutedText}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {errors.email ? (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.email}
            </Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: theme.surface,
                borderColor: errors.password ? theme.primary : theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.mutedText}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.mutedText} />
              ) : (
                <Eye size={20} color={theme.mutedText} />
              )}
            </TouchableOpacity>
          </View>

          {errors.password ? (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.password}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSignup}
          disabled={isloading}
        >
          {isloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>SIGN UP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles.loginText, { color: theme.primary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  backgroundImage: {
    width: "100%",
    height: 300,
    position: "absolute",
    top: 0,
  },

  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: 250,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 15,
  },

  input: {
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },

  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },

  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },

  eyeIcon: {
    padding: 15,
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },

  loginText: {
    fontSize: 16,
  },
});