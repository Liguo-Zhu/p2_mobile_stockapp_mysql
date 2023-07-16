import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Alert,
} from "react-native";

import React, { useState } from "react";
import { Button } from "@rneui/themed";
import Loader from "../components/Loader";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";

//login ===================================================================
export default function LoginScreen({ navigation }) {
  //====initial state==============================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkLogin, userToken } = useStocksContext();

  // ==========check email and password format=============================
  const isValidInput = async () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!email && !password) {
      isValid = false;
      Alert.alert("Error:", "Please input email and password!");
    }
    if (email && !password) {
      isValid = false;
      Alert.alert("Error:", "Please input password!");
    }
    if (!email && password) {
      isValid = false;
      Alert.alert("Error:", "Please input email!");
    }
    if (email && password) {
      if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        isValid = false;
        Alert.alert("Error:", "Please input a valid email!");
      }
    }
    // if email and password are valid, then invoke the checkLogin function
    if (isValid) {
      callLogin(email, password);
    }
  };

  // delay to request data=============================================
  const callLogin = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      try {
        checkLogin(email, password);
        navigation.navigate("Login");
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Something went wrong");
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      {/* ============================================================== */}
      <View
        style={{
          color: "#fff",
          fontSize: scaleSize(30),
          margin: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: scaleSize(30),
          }}
        >
          Welcome to QUT Stock
        </Text>
        <Text
          style={{
            color: "#ccc",
            fontSize: scaleSize(20),
          }}
        >
          Login to your account
        </Text>
      </View>
      {/* ========input====================================================== */}
      <TextInput
        value={email}
        keyboardType="email-address"
        placeholder="Email: "
        secureTextEntry={false}
        placeholderTextColor="#a7aaad"
        style={styles.input}
        onChangeText={(x) => {
          setEmail(x);
        }}
      ></TextInput>

      <TextInput
        value={password}
        placeholder="Password: "
        secureTextEntry={true}
        placeholderTextColor="#a7aaad"
        style={styles.input}
        onChangeText={(x) => {
          setPassword(x);
        }}
      ></TextInput>
      {/* =========login===================================================== */}
      <Button
        color="secondary"
        style={{ color: "#fff", marginTop: 20, marginHorizontal: 20 }}
        onPress={isValidInput}
      >
        Login
      </Button>
      {/* ============================================================== */}
      <View style={styles.row}>
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: scaleSize(16),
            marginTop: 20,
          }}
        >
          Don't have an account?
        </Text>

        <Text onPress={() => navigation.navigate("Signup")} style={styles.text}>
          Sign up here
        </Text>
      </View>

      {/* ============================================================== */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 200,
  },
  input: {
    color: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    height: 30,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  text: {
    color: "#03c04a",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: scaleSize(16),
    marginTop: 20,
    marginLeft: 20,
  },
});
