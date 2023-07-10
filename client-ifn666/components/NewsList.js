import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text, Card, Button, Icon } from "@rneui/themed";
import { scaleSize } from "../constants/Layout";

const NewsList = ({ url, title, summary, image }) => {
  return (
    <Card>
      <Card.Title>{title}</Card.Title>
      <Card.Divider />
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Card.Image
          style={{ padding: 0 }}
          source={{
            uri:
              image !== ""
                ? image
                : "https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg",
          }}
        />
        <Text style={{ marginBottom: 10 }}>{summary}</Text>
      </TouchableOpacity>
    </Card>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: "row",
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: scaleSize(16),
    marginTop: 5,
  },
});
