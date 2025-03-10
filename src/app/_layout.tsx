import { Slot } from "expo-router";
import "./../../global.css"
import { useFonts } from "expo-font";
import {
    Urbanist_500Medium,
    Urbanist_400Regular,
    Urbanist_700Bold,
} from "@expo-google-fonts/urbanist"
import { Loading } from "./components/loading";


export default function Layout() {
    const [fontsLoaded] = useFonts({
        Urbanist_500Medium,
        Urbanist_400Regular,
        Urbanist_700Bold,
    })

    if (!fontsLoaded) {
        return <Loading />
    }
    return (<Slot />)
}
