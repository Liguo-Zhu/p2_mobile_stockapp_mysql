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

import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Icon } from "@rneui/themed";
import { useStocksContext } from "../contexts/StocksContext";
import Loader from "../components/Loader";
import axios from "axios";
import { scaleSize } from "../constants/Layout";

//=======================================================================================
export default function SignupScreen({ navigation }) {
  //====initial state==============================================================
  const [email, setEmail] = useState("");
  const [password_1, setPassword_1] = useState("");
  const [password_2, setPassword_2] = useState("");
  const [loading, setLoading] = useState(false);

  //====Check if the input is valid======================================================
  const isValidInput = async () => {
    Keyboard.dismiss();
    // email format: x@y.z, x must be characters or with "_", y must characters, and z must be 2 or 3 characters
    let emailResult = email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

    // password format: minimum 8 characters, at least 1 letter and 1 number.
    let passwordResult1 = password_1.match(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    );
    let passwordResult2 = password_2.match(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    );

    // check the passwords and email whether they are valid
    if (emailResult && passwordResult1 && passwordResult2) {
      if (password_1 === password_2) {
        signup(email, password_1); // invoke signup function to sign up
      } else {
        Alert.alert("Error:", "Passwords are different!");
      }
    } else {
      Alert.alert(
        "Error:",
        "Email or passwords wrong format or password are different!"
      );
    }
  };

  // delay to signup=================================
  const signup = (email, password) => {
    setLoading(true);
    setTimeout(() => {
      try {
        setLoading(false);
        signupViaBackendServer(email, password);
      } catch (error) {
        Alert.alert("Error_1", error);
      }
    }, 1500);
  };

  //sign up via server=================================
  function signupViaBackendServer(email, password) {
    // try to write user data to MySQL on the backend
    axios
      .post("http://localhost:3000/users/signup", {
        email: email,
        password: password,
      })
      .then((res) => {
        let userInfo = res.data;
        if (!userInfo.error) {
          navigation.navigate("Login");
        } else {
          Alert.alert("Error:", `${userInfo["message"]}`);
        }
      })
      .catch((e) => {
        Alert.alert("Error", `${e}`);
      });
  }

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
          Let's create your account
        </Text>
      </View>
      {/* =========input===================================================== */}
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
        value={password_1}
        placeholder="Password: "
        secureTextEntry={true}
        placeholderTextColor="#a7aaad"
        style={styles.input}
        onChangeText={(x) => {
          setPassword_1(x);
        }}
      ></TextInput>
      <TextInput
        value={password_2}
        placeholder="Confirmed Password: "
        secureTextEntry={true}
        placeholderTextColor="#a7aaad"
        style={styles.input}
        onChangeText={(x) => {
          setPassword_2(x);
        }}
      ></TextInput>
      {/* =========signup===================================================== */}
      <Button
        color="secondary"
        style={{ color: "#fff", marginTop: 20, marginHorizontal: 20 }}
        onPress={isValidInput}
      >
        Sign Up
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
          Already have an account?
        </Text>
        <Text onPress={() => navigation.navigate("Login")} style={styles.text}>
          Login here
        </Text>
      </View>
      {/* ============================================================== */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
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
