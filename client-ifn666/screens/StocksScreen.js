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
  Text,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { FMP_API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";

// stock screen component====================================================
export default function StocksScreen({ navigation, route }) {
  //=====initial state============================================================
  const { checkLogin, isLoading, userToken, userInfo, test, watchList } =
    useStocksContext();
  const [stockQuoteData, setStockQuoteData] = useState([]);

  // Get the stock data====================================================
  let _fetchStockData = async () => {
    const symbols = watchList.join();

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_API_KEY}`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      //limit reach will cause error
      if (data["Error Message"]) {
        console.log(
          "Error : Limit Reach. Please upgrade your plan or visit our documentation for more details at https://site.financialmodelingprep.com/"
        );
      } else {
        //successfully get data and then save in the local stockQuoteData state
        setStockQuoteData(data);
      }
    } catch (error) {
      console.log("Api get stock price error:", error);
    }
  };
  useEffect(() => {
    // fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
    _fetchStockData(watchList);
  }, [watchList]);

  // if the watchlist is empty, and then return a message==========================
  if (watchList.length === 0) {
    return (
      <View>
        <Text
          style={{
            color: "red",
            textAlign: "center",
            fontSize: scaleSize(14),
            marginTop: 90,
          }}
        >
          Your watchlist is empty!
        </Text>
      </View>
    );
  }

  //===============================================================================
  return (
    <SafeAreaView style={styles.container}>
      {/* ==================================================================== */}
      <Text style={{ color: "#fff", margin: 20, fontSize: scaleSize(20) }}>
        Hi, {userInfo ? userInfo.user : null}
      </Text>
      <EventList events={stockQuoteData} />
    </SafeAreaView>
  );
}

//===============================================================================
//display stocks info: parent component
function EventList(props) {
  return (
    <ScrollView>
      <View>
        {props.events.map((x) => (
          <Event event={x} key={x.symbol} />
        ))}
      </View>
    </ScrollView>
  );
}
//===============================================================================
//display stocks info: children component
function Event(props) {
  const navigation = useNavigation();
  const { removeFromWatchlist } = useStocksContext();
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
        onPress: () => {
          removeFromWatchlist(props.event.symbol);
        },
      },
    ]);
  };
  //====================================================================
  return (
    <View>
      <Pressable
        delayLongPress={500}
        onPress={() => {
          navigation.navigate("DetailsScreen", {
            symbolFromUser: props.event.symbol,
          });
        }}
        onLongPress={() => {
          MyAlert();
        }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.itemWrapper}>
          <View style={styles.toLeft}>
            <View style={styles.space}>
              <Text style={styles.title1}>{props.event.symbol}</Text>
              <Text style={styles.title2}>{props.event.name}</Text>
            </View>
          </View>
          <View style={styles.toRight}>
            <Text style={styles.title1}>
              $
              {Number(props.event.price).toLocaleString("en-US", {
                currency: "USD",
              })}
            </Text>
            <Text style={[styles.title2, { color: setDisplayColor }]}>
              {Number(props.event.change).toFixed(3)}%
            </Text>
          </View>
        </View>
        <ItemSeparatorView />
      </Pressable>
    </View>
  );
}
//===============================================================================
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
  title1: {
    fontSize: scaleSize(18),
    color: "white",
  },
  title2: {
    marginTop: 4,
    fontSize: scaleSize(16),
    color: "#c5c6d0",
  },
});
