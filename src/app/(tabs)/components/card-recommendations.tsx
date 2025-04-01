import ChatIconPlayground from "@/src/svg/chat-icon-playground";
import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import LinguageIcon from "@/src/svg/linguage-icon";


export function CardRecommendations() {
    return (
        <View className="h-[10.125rem] overflow-hidden  flex flex-row gap-4 w-full rounded-[1.2rem] border border-[#B0B0B01A]">
            <LinearGradient
                colors={['#8257E5', '#493280']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}

                className="w-full rounded-2xl p-5 shadow-lg"
            >
                <View className="w-[10rem] h-full flex justify-center items-center">
                    <LinguageIcon />
                </View>
            </LinearGradient>
            <View className="flex gap-8 py-4">
                <Text className="text-[18px] w-[13rem] font-heading text-white">Lorem ipsum dolor sit amet consectetur. Nec nibh vehicula.</Text>
                <Text className="text-[14px] font-body text-[#B0B0B0] mb-6">www.medium.com</Text>
            </View>

        </View>
    )
}