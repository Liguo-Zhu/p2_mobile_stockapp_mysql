import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
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
import { scaleSize } from "../constants/Layout";
import Loader from "../components/Loader";
import useNews from "../api/Api_getnews";
import NewList from "../components/NewsList";
import EventList from "../components/EventList";
import { FMP_API_KEY } from "@env";
// =================================================================================
export default function DetailsScreen({ navigation, route }) {
  // get the symbol form user=======================================================
  const { symbolFromUser } = route.params;

  // ===state for each price=========================================================
  const [isLoading, setIsLoading] = useState(true);
  const [labelData, setLlabelSet] = useState([0]);
  const [closePriceData, setClosePriceData] = useState([0, 0, 0, 0, 0]);
  const [labelData1min, setLlabelSet1min] = useState([1]);
  const [closePriceData1min, setclosePriceData1min] = useState([0, 0, 0, 0, 0]);
  const [labelData30min, setLlabelSet30min] = useState([1]);
  const [closePriceData30min, setclosePriceData30min] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [labelData4hour, setLlabelSet4hour] = useState([3]);
  const [closePriceData4hour, setClosePriceData4hour] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [stockQuoteData, setStockQuoteData] = useState([]);

  // get news=======================================================================
  const { newsIsloading, news, newsError } = useNews(symbolFromUser);

  // by change time range state to display different historical price data==========
  const onPress1min = () => {
    setLlabelSet(labelData1min);
    setClosePriceData(closePriceData1min);
  };

  const onPress30min = () => {
    setLlabelSet(labelData30min);
    setClosePriceData(closePriceData30min);
  };

  const onPress4hour = () => {
    setLlabelSet(labelData4hour);
    setClosePriceData(closePriceData4hour);
  };

  // get 1min price data============================================================
  function getHistoricalPrice1min(symbol, timeInterval) {
    setIsLoading(true);
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/historical-chart/${timeInterval}/${symbol}?apikey=${FMP_API_KEY}`
      )
      .then((res) => {
        let rawData = res.data;
        let data = [];
        let label = [];
        rawData.reverse();
        for (let i = 0; i < rawData.length; i += 6) {
          data.push(rawData[i].close.toFixed(2));
          label.push(rawData[i].date);
        }
        const lengthOfData = data.length;
        const third = Math.round(lengthOfData * 0.5);
        let label1 = Array(lengthOfData);
        label1[0] = label[0].slice(5, 10);
        label1[third - 10] = label[third].slice(5, 10);
        label1[lengthOfData - 20] = label[lengthOfData - 1].slice(5, 10);
        setLlabelSet(label1);
        setClosePriceData(data);
        setLlabelSet1min(label1);
        setclosePriceData1min(data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`FMP api: ${e}`);
        setIsLoading(false);
      });
  }

  // get 30min price data============================================================
  function getHistoricalPrice30min(symbol, timeInterval) {
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/historical-chart/${timeInterval}/${symbol}?apikey=${FMP_API_KEY}`
      )
      .then((res) => {
        let rawData = res.data;
        let data = [];
        let label = [];
        rawData.reverse();
        for (let i = 0; i < rawData.length; i++) {
          data.push(rawData[i].close.toFixed(2));
          label.push(rawData[i].date);
        }
        const lengthOfData = data.length;
        const third = Math.round(lengthOfData * 0.5);
        let label1 = Array(lengthOfData);
        label1[0] = label[0].slice(5, 10);
        label1[third - 10] = label[third].slice(5, 10);
        label1[lengthOfData - 20] = label[lengthOfData - 1].slice(5, 10);
        setLlabelSet30min(label1);
        setclosePriceData30min(data);
      })
      .catch((e) => {
        console.log(`api get data--error: ${e}`);
      });
  }

  // get 4hour price data============================================================
  function getHistoricalPrice4hour(symbol, timeInterval) {
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/historical-chart/${timeInterval}/${symbol}?apikey=${FMP_API_KEY}`
      )
      .then((res) => {
        let rawData = res.data;
        let data = [];
        let label = [];
        rawData.reverse();
        for (let i = 0; i < rawData.length; i++) {
          data.push(rawData[i].close.toFixed(2));
          label.push(rawData[i].date);
        }
        const lengthOfData = rawData.length;
        const third = Math.round(lengthOfData * 0.5);
        let label1 = Array(lengthOfData);
        label1[0] = label[0].slice(5, 10);
        label1[third] = label[third].slice(5, 10);
        label1[lengthOfData - 6] = label[lengthOfData - 1].slice(5, 10);
        setLlabelSet4hour(label1);
        setClosePriceData4hour(data);
      })
      .catch((e) => {
        console.log(`api get data--error: ${e}`);
      });
  }

  // Get the stock data============================================================
  let getStockQuoteData = async (symbol) => {
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      setStockQuoteData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoricalPrice1min(symbolFromUser, "1min");
    getHistoricalPrice30min(symbolFromUser, "30min");
    getHistoricalPrice4hour(symbolFromUser, "4hour");
    getStockQuoteData(symbolFromUser);
  }, []);

  // ==================================================================================
  return (
    <SafeAreaView style={styles.container}>
      {isLoading || newsIsloading ? <Loader visible={true} /> : null}
      {/* ==========show the symbol===================================================== */}
      <TouchableOpacity
        style={styles.textcenter}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: scaleSize(20),
            textAlign: "center",
          }}
        >
          {symbolFromUser.toUpperCase()}
        </Text>
      </TouchableOpacity>
      {/* =======show different indicators of a stock =================================*/}
      <EventList events={stockQuoteData} />
      {/* ============================================================================= */}
      <ScrollView>
        {/* ======select buttons========================================================= */}
        <View style={styles.time}>
          <TouchableOpacity onPress={() => onPress1min()}>
            <Text style={styles.subtitle}>1min</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>|</Text>
          <TouchableOpacity onPress={() => onPress30min()}>
            <Text style={styles.subtitle}>30min</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>|</Text>
          <TouchableOpacity onPress={() => onPress4hour()}>
            <Text style={styles.subtitle}>4hour</Text>
          </TouchableOpacity>
        </View>
        {/* =======line chart======================================================== */}
        <MyLineChart x={labelData} y={closePriceData} />
        {/* ========show news ===================================================== */}
        <View>
          {news ? (
            <View>
              {news.map((element, index) => {
                return (
                  <NewList
                    key={index}
                    title={element.title}
                    url={element.url}
                    summary={element.summary}
                    image={element.image}
                  />
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>
      {/* ========================================================================= */}
    </SafeAreaView>
  );
}
// ==================================================================================
// line chart to display the stock price
const MyLineChart = ({ x, y }) => {
  return (
    <View>
      <LineChart
        data={{
          labels: x,
          datasets: [
            {
              data: y,
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
};

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
