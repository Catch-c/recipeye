import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordValidations, setPasswordValidations] = useState({
    isLengthValid: false,
    hasSpecialChar: false,
    hasCapitalLetter: false,
    hasNumber: false,
  });

  const validatePassword = (password) => {
    const isLengthValid = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    setPasswordValidations({
      isLengthValid,
      hasSpecialChar,
      hasCapitalLetter,
      hasNumber,
    });
  };

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    } else if (
      !passwordValidations.isLengthValid ||
      !passwordValidations.hasSpecialChar ||
      !passwordValidations.hasCapitalLetter ||
      !passwordValidations.hasNumber
    ) {
      Alert.alert("Error", "Password does not meet all requirements");
    } else {
      setSubmitting(true);
      try {
        const result = await createUser(form.email, form.password, form.username);
        setUser(result);
        setIsLogged(true);

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
      {/* Add KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10} // Adjust offset for better UX
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            className="w-full flex justify-center h-full px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <View className="items-center">
              <Image
                source={images.RecipEye}
                className="w-[200px] h-[125px]"
                resizeMode="contain"
              />
              <Text className="text-xl font-pregular mt-6">Hi There!</Text>
              <Text className="text-4xl font-semibold mt-2">Let's Get Started</Text>
            </View>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e.replace(/\s/g, '') })}
              otherStyles="mt-10"
            />

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
              handleChangeText={(e) => {
                setForm({ ...form, password: e.replace(/\s/g, '') });
                validatePassword(e);
              }}
              otherStyles="mt-7"
            />

            {/* Password Checklist */}
            <View className="mt-2">
              <Text className={`text-sm ${passwordValidations.isLengthValid ? "text-green-500" : "text-red-500"}`}>
                • At least 8 characters long
              </Text>
              <Text className={`text-sm ${passwordValidations.hasSpecialChar ? "text-green-500" : "text-red-500"}`}>
                • Contains 1 special character
              </Text>
              <Text className={`text-sm ${passwordValidations.hasCapitalLetter ? "text-green-500" : "text-red-500"}`}>
                • Contains 1 capital letter
              </Text>
              <Text className={`text-sm ${passwordValidations.hasNumber ? "text-green-500" : "text-red-500"}`}>
                • Contains 1 number
              </Text>
            </View>

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7 bg-secondary"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-psemibold">Have an account already?</Text>
              <Link href="/sign-in" className="text-lg font-pbold text-tertiary">
                Login
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
