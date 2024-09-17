import { useState, useRef } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createRecipe } from "../../lib/appwrite";
import { CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  maxLength,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="flex-row justify-between">
        <Text className="text-base font-pmedium">{title}</Text>
        {maxLength && (
          <Text className="text-sm text-gray-500">{value.length}/{maxLength}</Text>
        )}
      </View>
      <View className="w-full px-4 bg-gray-200 rounded-2xl border-2 border-gray-300 focus:border-secondary flex flex-row items-center shadow-md">
        <TextInput
          className="flex-1 font-psemibold text-base py-4"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          maxLength={maxLength}
          {...props}
        />
      </View>
    </View>
  );
};

const Create = () => {
  const { user } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [cookTime, setCookTime] = useState('');
  const [cookTimeUnit, setCookTimeUnit] = useState('Minutes');
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploading, setUploading] = useState(false);


  const descriptionInputRef = useRef(null);

  const addTag = () => {
    if (currentTag.trim() !== '' && !tags.includes(currentTag.trim()) && tags.length < 7) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', measurement: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    if (ingredients.length === 0 || !ingredients.some(ingredient => ingredient.name.trim())) {
      Alert.alert("Error", "Ingredient is required");
      return;
    }

    if (steps.length === 0 || !steps.some(step => step.trim())) {
      Alert.alert("Error", "Step is required");
      return;
    }

    const recipeData = {
      title,
      description,
      tags,
      cookTime: `${cookTime} ${cookTimeUnit}`,
      servings,
      ingredients,
      steps
    };

    const recipeArray = [
      recipeData.description,   // Add description
      recipeData.tags,          // Add tags
      recipeData.cookTime,      // Add cookTime
      recipeData.servings,      // Add servings
      recipeData.ingredients,   // Add ingredients
      recipeData.steps          // Add steps
    ];

    setUploading(true);
    try {
      await createRecipe(recipeData.title, recipeArray, user.$id);

      Alert.alert("Success", "Post uploaded successfully");

      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }

  };

  return (
    <SafeAreaView className="bg-primary h-[full]">
      <ScrollView className="px-4 my-9">
        <FormField
          title="Title"
          value={title}
          placeholder="Enter recipe title"
          handleChangeText={setTitle}
          maxLength={100}
        />

        <FormField
          title="Description"
          value={description}
          placeholder="Enter recipe description"
          handleChangeText={setDescription}
          otherStyles="mt-4"
          multiline
          maxLength={5000}
        />

        <View className="mt-4 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-base font-pmedium">Tags</Text>
            <Text className="text-sm text-gray-500">{tags.length}/7</Text>
          </View>
          <View className="flex-row flex-wrap mb-2">
            {tags.map((tag, index) => (
              <TouchableOpacity key={index} onPress={() => removeTag(tag)} className="bg-gray-200 rounded-full px-2 py-1 m-1">
                <Text>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row">
            <TextInput
              className="flex-1 h-12 px-4 bg-gray-200 rounded-l-2xl border-2 border-gray-300 focus:border-secondary font-psemibold text-base"
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Add a tag"
              placeholderTextColor="#7B7B8B"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity onPress={addTag} className="bg-blue-500 rounded-r-2xl p-2 justify-center w-20">
              <Text className="text-white font-bold text-center">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 space-y-2 mb-5">
          <Text className="text-base font-pmedium">Cook Time</Text>
          <View className="flex-row items-center">
            <TextInput
              className="w-1/3 h-12 px-4 bg-gray-200 rounded-l-2xl border-2 border-gray-300 focus:border-secondary font-psemibold text-base"
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
              placeholder="Time"
              placeholderTextColor="#7B7B8B"
            />
            <View className="w-2/3 h-12 bg-gray-200 rounded-r-2xl border-2 border-l-0 border-gray-300 justify-center">
              <Picker
                selectedValue={cookTimeUnit}
                onValueChange={(itemValue) => setCookTimeUnit(itemValue)}
              >
                <Picker.Item label="Minutes" value="Minutes" />
                <Picker.Item label="Hours" value="Hours" />
              </Picker>
            </View>
          </View>
        </View>

        <View className="mt-4 space-y-2">
          <Text className="text-base font-pmedium">Servings</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setServings(Math.max(1, servings - 1))}
              className="bg-blue-500 rounded-l-2xl p-2 w-12 items-center"
            >
              <Text className="text-white text-lg font-bold">-</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 h-12 bg-gray-200 border-t-2 border-b-2 border-gray-300 text-center font-psemibold text-base"
              value={servings.toString()}
              onChangeText={(value) => setServings(Math.max(1, parseInt(value) || 1))}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => setServings(servings + 1)}
              className="bg-blue-500 rounded-r-2xl p-2 w-12 items-center"
            >
              <Text className="text-white text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 space-y-2">
          <Text className="text-base font-pmedium">Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <TextInput
                className="flex-1 h-12 px-2 bg-gray-200 rounded-l-2xl border-2 border-gray-300 focus:border-secondary font-psemibold text-base"
                value={ingredient.name}
                onChangeText={(value) => updateIngredient(index, 'name', value)}
                placeholder="Ingredient name"
                placeholderTextColor="#7B7B8B"
              />
              <TextInput
                className="w-16 h-12 px-2 bg-gray-200 border-t-2 border-b-2 border-gray-300 focus:border-secondary font-psemibold text-base"
                value={ingredient.amount}
                onChangeText={(value) => updateIngredient(index, 'amount', value)}
                keyboardType="numeric"
                placeholder="Amt"
                placeholderTextColor="#7B7B8B"
              />
              <TextInput
                className="w-16 h-12 px-2 bg-gray-200 border-t-2 border-b-2 border-gray-300 focus:border-secondary font-psemibold text-base"
                value={ingredient.measurement}
                onChangeText={(value) => updateIngredient(index, 'measurement', value)}
                placeholder="Unit"
                placeholderTextColor="#7B7B8B"
              />
              <TouchableOpacity
                onPress={() => removeIngredient(index)}
                className="bg-red-500 rounded-r-2xl p-2 h-12 items-center justify-center ml-0 border-t-2 border-b-2 border-gray-300"
                style={{ width: 50 }} // Ensures the delete button width is consistent
              >
                <Text className="text-white font-bold text-base">X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addIngredient} className="bg-blue-500 rounded-2xl p-3 items-center">
            <Text className="text-white font-bold">Add Ingredient</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 space-y-2">
          <Text className="text-base font-pmedium">Steps</Text>
          {steps.map((step, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="font-bold mr-2 w-6">{index + 1}.</Text>
              <TextInput
                className="flex-1 h-12 px-2 bg-gray-200 rounded-l-2xl border-2 border-gray-300 focus:border-secondary font-psemibold text-base"
                value={step}
                onChangeText={(value) => updateStep(index, value)}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor="#7B7B8B"
                multiline
              />
              <TouchableOpacity
                onPress={() => removeStep(index)}
                className="bg-red-500 rounded-r-2xl p-2 h-12 items-center justify-center ml-0 border-t-2 border-b-2 border-gray-300"
                style={{ width: 50 }}
              >
                <Text className="text-white font-bold text-base">X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addStep} className="bg-blue-500 rounded-2xl p-3 items-center">
            <Text className="text-white font-bold">Add Step</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={submit} className="bg-green-500 rounded-2xl p-4 items-center mt-8 mb-8">
          <Text className="text-white font-bold text-lg">Create Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
