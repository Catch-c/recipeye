import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRecipeById } from '../lib/appwrite'; // Assuming you have this function to get recipe by ID

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { recipeId } = route.params;

    useEffect(() => {
        // Fetch the recipe details when the component mounts
        const fetchRecipe = async () => {
            const recipeData = await getRecipeById(recipeId); // Fetch recipe from backend
            setRecipe(recipeData);
        };

        fetchRecipe();
    }, [recipeId]);

    if (!recipe) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                {/* Recipe Image */}
                <Image
                    source={{ uri: recipe.thumbnail }}
                    className="w-full h-56 rounded-lg mb-4"
                    resizeMode="cover"
                />

                {/* Recipe Title */}
                <Text className="text-3xl font-bold mb-4 text-center">{recipe.title}</Text>

                {/* Ingredients */}
                <Text className="text-xl font-semibold mb-2">Ingredients</Text>
                <View className="mb-4">
                    {/* {recipe.ingredients.map((ingredient, index) => (
                        <Text key={index} className="text-base mb-1">- {ingredient}</Text>
                    ))} */}
                </View>

                {/* Steps */}
                <Text className="text-xl font-semibold mb-2">Steps</Text>
                <View>
                    {/* {recipe.steps.map((step, index) => (
                        <Text key={index} className="text-base mb-3">
                            {index + 1}. {step}
                        </Text>
                    ))} */}
                </View>
            </ScrollView>

            {/* Back Button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-10 left-4 p-2 bg-gray-200 rounded-full"
            >
                <Text>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default RecipeDetail;
