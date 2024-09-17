import { useState } from "react";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  ImageBackground,
  Text,
  View,
  StyleSheet,
} from "react-native";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  return (
    <Animatable.View
      style={styles.itemContainer}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <ImageBackground
        source={{ uri: 'https://bellyfull.net/wp-content/uploads/2023/02/Spaghetti-Carbonara-blog-1.jpg' }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </ImageBackground>
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0].$id);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentContainerStyle={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 15,
  },
  imageBackground: {
    width: 200, // Increased width
    height: 150, // Increased height
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end", // Align content to the bottom
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    paddingHorizontal: 10,
  },
});

export default Trending;
