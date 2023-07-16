import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { scaleSize } from "../constants/Layout";

// line chart to display the stock price
export default function MyLineChart({ chartData, symbol }) {
  const { min_1, min_5, min_15, min_30, hour_1, hour_4 } = chartData;
  const [dateFormat, setDateFormat] = useState("1min");

  const chooseDateFormat = () => {
    switch (dateFormat) {
      case "1min":
        return min_1;
      case "5min":
        return min_5;
      case "15min":
        return min_15;
      case "30min":
        return min_30;
      case "1hour":
        return hour_1;
      case "4hour":
        return hour_4;
      default:
        return min_1;
    }
  };

  return (
    <View>
      {/* ======select buttons========================================================= */}
      <View style={styles.time}>
        <TouchableOpacity onPress={() => setDateFormat("1min")}>
          <Text style={styles.subtitle}>1M</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => setDateFormat("5min")}>
          <Text style={styles.subtitle}>5M</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => setDateFormat("15min")}>
          <Text style={styles.subtitle}>15M</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => setDateFormat("30min")}>
          <Text style={styles.subtitle}>30M</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => setDateFormat("1hour")}>
          <Text style={styles.subtitle}>1H</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>|</Text>
        <TouchableOpacity onPress={() => setDateFormat("4hour")}>
          <Text style={styles.subtitle}>4H</Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: chooseDateFormat().data,
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#242424",
          backgroundGradientFrom: "#161616",
          backgroundGradientTo: "#242424",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 200, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#242424",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

// some css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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

  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#242424",
    margin: 3,
    padding: 5,
    borderRadius: 7,
  },
  subtitle: {
    fontWeight: "bold",
    color: "#fff",
  },
  table: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 7,
  },

  data: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    color: "#a7aaad",
    fontWeight: "bold",
    marginRight: 17,
  },
  textcenter: {
    textAlign: "center",
    fontSize: scaleSize(50),
    color: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignContent: "center",
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
  },
});
