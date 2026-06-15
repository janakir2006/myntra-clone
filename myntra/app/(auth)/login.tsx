import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function Login() {
  const { login } = useAuth();
  const { theme } = useAppTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setisloading] = useState(false);

  const handleLogin = async () => {
    try {
      setisloading(true);
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
    } finally {
      setisloading(false);
    }
  };

  <>
  <Stack.Screen options={{ headerShown: false }} />

  <View style={[styles.container, { backgroundColor: theme.background }]}>
    ...
  </View>
</>

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
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
          Welcome to Myntra
        </Text>

        <Text style={[styles.subtitle, { color: theme.mutedText }]}>
          Login to continue shopping
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={theme.mutedText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View
          style={[
            styles.passwordContainer,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.mutedText}
            value={password}
            onChangeText={setPassword}
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={isloading}
        >
          {isloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("/signup")}
        >
          <Text style={[styles.signupText, { color: theme.primary }]}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: 0,
  },

  formContainer: {
  flex: 1,
  justifyContent: "center",
  padding: 10,
  maxWidth: 450,
  width: "100%",
  alignSelf: "center",
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

  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
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
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  signupLink: {
    marginTop: 20,
    alignItems: "center",
  },

  signupText: {
    fontSize: 16,
  },
});