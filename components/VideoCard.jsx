import { View, Text, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

import { icons } from "../constants";

const RecipeCard = ({ title, creator, avatar, thumbnail, ingredients, steps }) => {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowSteps(!showSteps)}
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
      >
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />

        <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <Text className="text-lg text-white font-psemibold" numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>

      {showSteps && (
        <View className="w-full mt-3 p-4 bg-gray-800 rounded-xl">
          <Text className="text-white font-pregular">Ingredients:</Text>
          <Text className="text-gray-300">{ingredients}</Text>
          <Text className="text-white font-pregular mt-2">Steps:</Text>
          <Text className="text-gray-300">{steps}</Text>
        </View>
      )}
    </View>
  );
};

export default RecipeCard;
