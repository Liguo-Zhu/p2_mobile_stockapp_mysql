import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Button, SearchBar } from "@rneui/themed";
import { useStocksContext } from "../contexts/StocksContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DataSource from "../api/nasdaq_stocks_symbolName.json";
import { scaleSize } from "../constants/Layout";
//=================================================================================
export default function SearchScreen({ navigation }) {
  //====initial state==============================================================
  const { userToken, userInfo, watchList, addToWatchlist } = useStocksContext();
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState(DataSource);
  //=================================================================================
  // search stock's symbol or name
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank. Filter the masterDataSource. Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.SymbolName
          ? item.SymbolName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        //The indexOf() method returns the first index at which a given element can be found in the array,
        //or -1 if it is not present.
      });
      setFilteredDataSource(newData); //assign value to filteredDataSource
      setSearch(text); //assign value to SearchBar
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource([]); //If input is empty, it is set to empty.
      setSearch(text); //assign value to the SearchBar
    }
  };
  //=================================================================================
  // display stock symbol and name when searching
  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => ClickItem(item)}>
        <View style={styles.toLeft}>
          <View style={styles.space}>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
            <Text style={styles.company}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  //=================================================================================
  // click item to add the symbol to watchlist
  const ClickItem = (item) => {
    // Function for click on an item
    addToWatchlist(item.symbol); //add the symbol to the watchlist
    navigation.navigate("Stocks"); //click then go to the stocks screen.
  };
  //=================================================================================
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

  //=================================================================================
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "#fff", margin: 20, fontSize: scaleSize(20) }}>
        Hi, {userInfo ? userInfo.user : null}
      </Text>
      {/* ========search bar====================================================== */}
      <SearchBar
        round
        lightTheme={false}
        searchIcon={{ size: 20 }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction("")}
        placeholder="Type Symbol or Company Name..."
        value={search}
      />
      {/* ========show symbol list=============================================== */}
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </SafeAreaView>
  );
}
//=================================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  color1: {
    backgroundColor: "#000",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    color: "white",
  },
  symbol: {
    fontSize: scaleSize(18),
    color: "white",
  },
  company: {
    marginTop: 4,
    fontSize: scaleSize(16),
    color: "#c5c6d0",
  },
  toLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  space: {
    marginLeft: 40,
  },
});
