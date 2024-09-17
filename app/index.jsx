import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.RecipEye}
            className="w-[200px] h-[200px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-2xl text-black font-bold text-center">
              Find your Perfect{"\n"}
              Recipe Match with{" "}
              <Text className="text-secondary-200">RecipEye</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-3 -right-4"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-500 mt-7 text-center">
            Unlock the potential of your ingredients and dive into a world of culinary discovery with RecipEye.
          </Text>

          <CustomButton
            title="Sign Up"
            handlePress={() => router.push("/sign-up")}
            containerStyles="w-full mt-7 bg-secondary"
          />

          <CustomButton
            title="Log In"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7 bg-tertiary"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default Welcome;
