import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, KeyboardAvoidingView, Platform } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    } else {
      setSubmitting(true);

      try {
        await signIn(form.email, form.password);
        const result = await getCurrentUser();
        setUser(result);
        setIsLogged(true);

        Alert.alert("Success", "User signed in successfully");
        router.replace("/home");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    }


  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10} // Adjust offset for better UX
      >


        <ScrollView>
          <View
            className="w-full flex justify-center h-full px-4 my-6"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          ><View className="items-center">
              <Image
                source={images.RecipEye}
                className="w-[200px] h-[125px]"
                resizeMode="contain"
              />
              <Text className="text-xl font-pregular mt-6">
                Welcome Back!
              </Text>
              <Text className="text-4xl font-semibold mt-2">
                Let's Get You Back In
              </Text>
            </View>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e.replace(/\s/g, '') })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e.replace(/\s/g, '') })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7 bg-secondary"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-psemibold">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-pbold text-tertiary"
              >
                Signup
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
