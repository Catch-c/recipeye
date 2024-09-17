import { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Image, Text, View } from "react-native";
import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { SearchInput } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollView = carouselRef.current;
        scrollView.getScrollResponder().scrollTo({
          x: (scrollView.contentOffset?.x + scrollView.layoutMeasurement?.width) % scrollView.contentSize?.width || 0,
          animated: true,
        });
      }
    }, 3000); // Adjust time as needed (3000 ms = 3 seconds)

    return () => clearInterval(interval);
  }, [latestPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePressRecipe = (recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.$id });
  };



  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-500">Welcome Back</Text>
            <Text className="text-2xl font-psemibold">{user?.username}</Text>
          </View>

          <View className="mt-1.5">
            <Image source={images.RecipEye} className="w-12 h-10" resizeMode="contain" />
          </View>
        </View>

        <SearchInput />


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="space-x-4"
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
        >
          <TouchableOpacity
            className="flex items-center space-y-1"
          >
            <View className={"rounded-xl p-[6px] bg-gray-400"}>
              <Image
                source={{ uri: 'https://images.vexels.com/media/users/3/143251/isolated/preview/2855503d0be5396c3d1e07018417dca8-sushi-color-icon-by-vexels.png' }}
                style={{ width: 50, height: 50, borderRadius: 50 }} // You can adjust these styles
              />

            </View>
            <Text
              className="text-neutral-800 "
            >
              Asian
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex items-center space-y-1"
          >
            <View className={"rounded-xl p-[6px] bg-gray-200"}>
              <Image
                source={{ uri: 'https://images.vexels.com/media/users/3/143251/isolated/preview/2855503d0be5396c3d1e07018417dca8-sushi-color-icon-by-vexels.png' }}
                style={{ width: 50, height: 50, borderRadius: 50 }} // You can adjust these styles
              />

            </View>
            <Text
              className="text-neutral-800 "
            >
              Asian
            </Text>
          </TouchableOpacity>

        </ScrollView>

        <View className="w-full pb-8 pl-1">
          <Text className="text-lg font-pregular text-gray-500 mb-3">Latest Recipes</Text>

          <View className="relative w-80 h-44 rounded-lg overflow-hidden">
            <Image source={{ uri: 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2018/07/Spaghetti-carbonara-recipe.jpg' }} className="w-full h-full rounded-lg" />
            <View className="absolute inset-0 bg-black/50 rounded-lg" />
            <Text className="absolute bottom-3 left-3 text-white text-lg font-bold">
              Test
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
