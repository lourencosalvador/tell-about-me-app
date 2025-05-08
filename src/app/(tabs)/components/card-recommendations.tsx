import ChatIconPlayground from "@/src/svg/chat-icon-playground";
import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import LinguageIcon from "@/src/svg/linguage-icon";


export  default function CardRecommendations() {
    return (
        <View className="h-[10.125rem] bg-[#8257E5] overflow-hidden  items-center flex flex-row gap-4 w-full rounded-[1.2rem] border border-[#B0B0B01A]">
                <View className="w-[5rem] h-full flex justify-center items-center">
                    <LinguageIcon />
                </View>
            <View className="flex gap-4 py-4">
                <Text className="text-[16px] w-[15rem] font-heading text-white">Lorem ipsum dolor sit amet consectetur. Nec nibh vehicula.</Text>
                <Text className="text-[14px] font-body text-[#B0B0B0] mb-6">www.medium.com</Text>
            </View>

        </View>
    )
}