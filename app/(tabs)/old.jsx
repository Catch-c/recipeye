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

                <View className="w-full pb-8 pl-1">
                    <Text className="text-lg font-pregular text-gray-500 mb-3">Latest Recipes</Text>

                    <ScrollView
                        ref={carouselRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#3498db']} // Customize the color of the spinner
                            />
                        }
                        className="flex-row space-x-4"
                    >
                        {latestPosts?.map((recipe) => (
                            <TouchableOpacity
                                key={recipe.id || recipe.title} // Use a unique key, fallback to recipe.title if recipe.id is undefined
                                onPress={() => handlePressRecipe(recipe)}
                            >
                                <View className="w-40">
                                    <Image
                                        source={{ uri: recipe.thumbnail }}
                                        className="w-full h-24 rounded-lg"
                                        resizeMode="cover"
                                    />
                                    <View className="bg-white p-2 rounded-b-lg shadow-md">
                                        <Text className="text-sm font-medium text-center">{recipe.title}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Home;
