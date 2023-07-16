import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Alert,
  SafeAreaView,
  Text /* include other react-native components here as needed */,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { scaleSize } from "../constants/Layout";

export default function EventList(props) {
  return (
    <View>
      {props.events.map((x) => (
        <Event event={x} key={x.symbol} />
      ))}
    </View>
  );
}

function Event(props) {
  const navigation = useNavigation();
  const setDisplayColor = props.event.change > 0 ? "#03c04a" : "#d21404";
  // separator different items when displaying
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#C8C8C8",
          margin: 6,
        }}
      />
    );
  };
  // Remind the user to make sure to remove the symbol
  let MyAlert = () => {
    Alert.alert("Delete?", "", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "OK",
        onPress: () => {},
      },
    ]);
  };
  //========================================
  return (
    <View>
      <View style={styles.itemWrapper}>
        <View>
          <Text style={styles.title0}>Open</Text>
          <Text style={styles.title1}>
            $
            {Number(props.event.open).toLocaleString("en-US", {
              currency: "USD",
            })}
          </Text>
        </View>
        {/* ==================================================== */}
        <View>
          <Text style={styles.title0}>High</Text>
          <Text style={styles.title1}>
            $
            {Number(props.event.dayHigh).toLocaleString("en-US", {
              currency: "USD",
            })}
          </Text>
        </View>
        {/* ==================================================== */}
        <View>
          <Text style={styles.title0}>Low</Text>
          <Text style={styles.title1}>
            $
            {Number(props.event.dayHigh).toLocaleString("en-US", {
              currency: "USD",
            })}
          </Text>
        </View>
        {/* ==================================================== */}
        <View>
          <Text style={styles.title0}>Close</Text>
          <Text style={styles.title1}>
            $
            {Number(props.event.previousClose).toLocaleString("en-US", {
              currency: "USD",
            })}
          </Text>
        </View>
        {/* ==================================================== */}
        <View>
          <Text style={styles.title0}>Volumn</Text>
          <Text style={styles.title1}>
            $
            {Number(props.event.volume).toLocaleString("en-US", {
              currency: "USD",
            })}
          </Text>
        </View>
        {/* ==================================================== */}

        {/* ==================================================== */}
      </View>

      <ItemSeparatorView />
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  event_title: {
    backgroundColor: "red",
    padding: 5,
    margin: 2,
    borderRadius: 10,
  },
  event_data: {
    backgroundColor: "#000",
    color: "#fff",
    margin: 2,
  },
  itemWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  toRight: {
    alignItems: "flex-end",
  },
  space: {
    marginLeft: 8,
  },
  title0: {
    fontSize: scaleSize(18),
    color: "white",
    marginTop: 4,
  },
  title1: {
    marginTop: 4,
    fontSize: scaleSize(14),
    color: "white",
  },
  title2: {
    marginTop: 4,
    fontSize: scaleSize(14),
    color: "#c5c6d0",
  },
});
