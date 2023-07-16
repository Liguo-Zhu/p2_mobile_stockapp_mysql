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
import MyLineChart from "../components/MyLineChart";
import { FMP_API } from "../api/FMP_API";
// =================================================================================

const processData = (rawData) => {
  let data = [];
  let label = [];
  rawData.reverse();
  if (rawData.length > 1000) {
    for (let i = 0; i < rawData.length; i += 5) {
      data.push(rawData[i].close.toFixed(2));
      label.push(rawData[i].date);
    }
  } else if (rawData.length > 700 && rawData.length < 1000) {
    for (let i = 0; i < rawData.length; i += 3) {
      data.push(rawData[i].close.toFixed(2));
      label.push(rawData[i].date);
    }
  } else if (rawData.length > 300 && rawData.length < 700) {
    for (let i = 0; i < rawData.length; i += 2) {
      data.push(rawData[i].close.toFixed(2));
      label.push(rawData[i].date);
    }
  } else {
    for (let i = 0; i < rawData.length; i++) {
      data.push(rawData[i].close.toFixed(2));
      label.push(rawData[i].date);
    }
  }

  return {
    data: data,
    label: label,
  };
};

export default function DetailsScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState();
  const [chartData, setChartData] = useState();

  // get the symbol form user=======================================================
  const { symbolFromUser } = route.params;
  // get news=======================================================================
  const { newsIsloading, news, newsError } = useNews(symbolFromUser);

  // get stock data=======================================================================
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const res1 = await FMP_API.get(`/quote/${symbolFromUser}`);
        const res2 = await Promise.all([
          FMP_API.get(`/historical-chart/1min/${symbolFromUser}`),
          FMP_API.get(`/historical-chart/5min/${symbolFromUser}`),
          FMP_API.get(`/historical-chart/15min/${symbolFromUser}`),
          FMP_API.get(`/historical-chart/30min/${symbolFromUser}`),
          FMP_API.get(`/historical-chart/1hour/${symbolFromUser}`),
          FMP_API.get(`/historical-chart/4hour/${symbolFromUser}`),
        ]);

        if (isMounted) {
          console.log("res1: ", res1);
          setStockData(res1.data);
          setChartData({
            min_1: processData(res2[0].data),
            min_5: processData(res2[1].data),
            min_15: processData(res2[2].data),
            min_30: processData(res2[3].data),
            hour_1: processData(res2[4].data),
            hour_4: processData(res2[5].data),
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
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
      {stockData && <EventList events={stockData} />}
      <ScrollView>
        {/* =======line chart======================================================== */}
        {chartData && (
          <MyLineChart chartData={chartData} symbol={symbolFromUser} />
        )}
        {/* ========show news ===================================================== */}
        <View>
          {news && (
            <View>
              {news?.map((element, index) => {
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// ==================================================================================
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
