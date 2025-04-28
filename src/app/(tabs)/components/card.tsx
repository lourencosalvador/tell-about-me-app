import ChatIconPlayground from "@/src/svg/chat-icon-playground";
import { View, Text } from "react-native";


export default function Card() {
    return (
        <View className="h-[14.125rem] flex justify-between p-3 w-[12.875rem] rounded-lg border border-[#B0B0B01A]">
            <ChatIconPlayground />
            <Text className="text-[22px] font-heading text-white">0</Text>
            <Text className="text-[14px] font-heading text-[#B0B0B0] mb-6">Videos Carregados</Text>
        </View>
    )
}