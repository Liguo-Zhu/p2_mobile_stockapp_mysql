import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import {
  URL_LOGIN,
  URL_UPDATE_WATCHLIST,
  URL_GET_WATCHLIST,
} from "../constants/URLconfig";
//=================================================================================
const StocksContext = React.createContext();
//=================================================================================
export const StocksProvider = ({ children }) => {
  //====initial state==============================================================
  const [watchlistState, setWatchlistState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [test, setTest] = useState([]);

  return (
    <StocksContext.Provider
      value={[
        watchlistState,
        setWatchlistState,
        isLoading,
        setIsLoading,
        userToken,
        setUserToken,
        userInfo,
        setUserInfo,
        test,
        setTest,
      ]}
    >
      {children}
    </StocksContext.Provider>
  );
};
//=================================================================================
export const useStocksContext = () => {
  const navigation = useNavigation();
  const [
    watchlistState,
    setWatchlistState,
    isLoading,
    setIsLoading,
    userToken,
    setUserToken,
    userInfo,
    setUserInfo,
    test,
    setTest,
  ] = useContext(StocksContext);

  //=================================================================================
  // login function: check if the user is valid by making a request to the backend system
  function checkLogin(email, password) {
    setIsLoading(true);
    // try to connect to the server
    axios
      .post(`${URL_LOGIN}`, {
        email: email,
        password: password,
      })
      .then((res) => {
        let userInfo = res.data;
        //successfully get the data from server
        if (!userInfo.error) {
          setUserInfo(userInfo);
          setUserToken(userInfo.token);
          AsyncStorage.setItem("@userInfo", JSON.stringify(userInfo));
          AsyncStorage.setItem("@userToken", userInfo.token);
          navigation.navigate("Home");

          //get watchlist from the user's MySQL database
          getWatchlistFromMySQL(email, userInfo.token);
        } else {
          //error
          Alert.alert("Error:", userInfo.message);
        }
      })
      .catch((e) => {
        if (e.response) {
          Alert.alert("Error", `${e}`);
        }
      });
    setIsLoading(false);
  }
  //=================================================================================
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("@userInfo");
      let userToken = await AsyncStorage.getItem("@userToken");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
        setUserToken(userToken);
      }
      setUserToken(userToken);
      setIsLoading(false);
    } catch (error) {
      console.log(`isLogged in error ${error}`);
    }
  };
  //=================================================================================
  function checkLogout() {
    setIsLoading(true);
    //step 1: update the watchlist
    updateWatchlistToMySQL(userInfo.user); // update the watchlist of the user who logout out now

    //step 2: after step1, and then delete all the user information
    setWatchlistState([]); //delete the watchlist useState
    setUserInfo(null); // set the user info to null
    setUserToken(null); // set the user token to null
    AsyncStorage.removeItem("@userInfo"); // remove the user info
    AsyncStorage.removeItem("@userToken"); // remove the user token
    AsyncStorage.removeItem("@Watchlist"); // remove the watchlist
    setIsLoading(false);
  }

  // update the user's watchlist to MySQL when user logout the system.
  function updateWatchlistToMySQL(user) {
    // try to update user data to MySQL on the backend
    axios
      .post(`${URL_UPDATE_WATCHLIST}`, {
        email: user,
        watchlist: `${watchlistState}`,
        token: userToken,
      })
      .then((res) => {
        let msg = res.data;
      })
      .catch((e) => {
        Alert.alert("Error", `${e}`);
      });
  }
  //=================================================================================
  // get the user's watchlist from MySQL when user login the system,
  // and then add watchlist to the local storage and local useState variable.
  function getWatchlistFromMySQL(user, userToken) {
    // try to get user data from MySQL on the backend
    axios
      .post(`${URL_GET_WATCHLIST}`, {
        email: user,
        token: userToken,
      })
      .then((res) => {
        let raw = res.data;
        if (!raw.error) {
          // update the watchlist to the local storage
          // ========================================================
          if (
            raw.watchlist[0].watchlist == null ||
            raw.watchlist[0].watchlist == ""
          ) {
            AsyncStorage.setItem("@Watchlist", JSON.stringify([]));
            setWatchlistState([]); // add the watchlist to the system useState variable
          } else {
            let my_watchlist = raw.watchlist[0].watchlist.split(",");

            AsyncStorage.setItem("@Watchlist", JSON.stringify(my_watchlist));
            setWatchlistState(my_watchlist); // add the watchlist to the system useState variable
          }
        } else {
          Alert.alert("Error:", raw.message);
        }
      })
      .catch((e) => {
        Alert.alert("Error", `${e}`);
      });
  }
  //=================================================================================
  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext watchlistState and persist to AsyncStorage
    let objIndex = watchlistState.findIndex((obj) => obj === newSymbol);
    //If the symbol is not found(objIndex=-1), it will be added to the watchlist.
    if (objIndex === -1) {
      // add the watchlist to the system useState variable
      setWatchlistState((item) => {
        item.push(newSymbol);
        // add the current state to AsyncStorage
        AsyncStorage.setItem("@Watchlist", JSON.stringify(watchlistState));
        return [...item];
      });
    } else {
      Alert.alert("Hi, watchlist has the symbol.");
    }
  }
  //=================================================================================
  function removeFromWatchlist(newSymbol) {
    //FixMe: remove the old symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    let objIndex = watchlistState.findIndex((obj) => obj === newSymbol);
    //If the symbol is found, it is removed.
    if (objIndex !== -1) {
      setWatchlistState((item) => {
        item.splice(objIndex, 1);
        //add the current state to AsyncStorage
        AsyncStorage.setItem("@Watchlist", JSON.stringify(watchlistState));
        return [...item];
      });
    } else {
      console.log("Error: This symbol is not in the watchlist....");
    }
  }

  // retrieve watchlist from AsyncStorage
  let _retrieveWatchlist = async () => {
    try {
      const value = await AsyncStorage.getItem("@Watchlist");
      if (value !== null) {
        // We have data!!
        setWatchlistState(JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  //=================================================================================
  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    isLoggedIn();
    _retrieveWatchlist();
  }, []);

  //=================================================================================
  return {
    watchList: watchlistState,
    isLoading: isLoading,
    userToken: userToken,
    userInfo: userInfo,
    test: test,
    setTest: setTest,
    setWatchlistState: setWatchlistState,
    checkLogin,
    checkLogout,
    addToWatchlist,
    getWatchlistFromMySQL,
    removeFromWatchlist,
  };
};
