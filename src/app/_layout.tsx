import { Stack } from "expo-router";
import "./../../global.css";
import { useFonts } from "expo-font";
import {
  Urbanist_500Medium,
  Urbanist_400Regular,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import Loading from "./components/loading";
import { StatusBar } from "react-native";
import 'react-native-reanimated';
import { QueryProvider } from "../providers/QueryProvider";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Urbanist_500Medium,
    Urbanist_400Regular,
    Urbanist_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar barStyle={"light-content"} />
    </QueryProvider>
  );
}