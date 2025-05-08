
import Elipse from "@/src/svg/elipse"
import HartIcon from "@/src/svg/hart-icon"
import NotificationIcon from "@/src/svg/notification-icon"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import ArrowVertical from "@/src/svg/arrow-vertical";
import VoiceIcon from "@/src/svg/voice-icon";
import ArrowHorizontal from "@/src/svg/arrow-horizontal";
import RaioIcon from "@/src/svg/raio-icon";
import * as Speech from 'expo-speech';
import { router } from "expo-router";
// import elipse from "@/assets/images/elipse.png"

export default function Test() {

    const speakText = () => {
        const text = "Melhore design responsivo com Flexbox Froggy, Grid Garden e Frontend Mentor.";
        Speech.speak(text, {
            language: "pt-PT",
            rate: 1.0,
        });
    };

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            <View className="w-full justify-between mb-14 flex-row items-center h-auto">
                <Text className="text-[22px] font-heading text-white">Dicas</Text>

                <View className="size-auto flex flex-row gap-3">
                    <View className="bg-[#1A1A1E] flex flex-row gap-3 w-[5.5rem] items-center justify-center rounded-lg h-auto py-2">
                        <Text className="text-[22px] font-heading text-white">0</Text>
                        <HartIcon />
                    </View>

                    <View className="bg-[#1A1A1E] relative flex flex-row gap-3 items-center justify-center rounded-lg h-auto py-3 px-4">
                        <View className="absolute text-center top-0 left-0 flex items-center w-10 z-30 bg-bg-primary rounded-full">
                            <Text className="text-[16px]  font-heading text-white">9+</Text>
                        </View>
                        <NotificationIcon />
                    </View>
                </View>
            </View>

            <View className="flex gap-6">
                <Text className="text-[22px] font-heading text-white">Hoje</Text>
                <View className="w-full mb-4 flex flex-row bg-[#493280] h-[12rem] rounded-lg overflow-hidden">
                        <View className="w-[0.5rem] h-full flex justify-center items-center" />
                    <View className="w-full h-full flex justify-evenly py-2">
                        <View className="flex justify-between items-center flex-row w-full px-7">
                            <Text className="text-[18px] font-heading text-white">Nova Recomendação 🎉</Text>
                            <ArrowVertical />
                        </View>
                        <View className="flex justify-between items-center flex-row w-full px-7">
                            <Text className="text-[11px] leading-4 font-semibold text-white">Melhore  design responsivo com Flexbox Froggy, Grid Garden e Frontend Mentor. 🖥️</Text>
                        </View>
                        <View className="flex justify-between items-center flex-row w-full px-7">
                            <Text className="text-[14px] font-heading text-white">Há 1h</Text>
                            <TouchableOpacity onPress={speakText} className="flex flex-row gap-2 items-center">
                                <VoiceIcon />
                                <Text className="text-[12px] font-heading text-[#B0B0B0]">Ouvir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push("/(stacks)/maps")}>
                    <Text>Maps</Text>
                </TouchableOpacity>

                {/* <View className="flex gap-8">
                    <View className="w-full flex flex-row bg-[#8257E5] border border-[#B0B0B01A] h-[6rem] rounded-2xl overflow-hidden">
                            <View className="w-[5rem] h-full flex justify-center items-center">
                                <RaioIcon />
                            </View>
                        <View className="w-auto z-40 gap-14 items-center h-full flex flex-row justify-evenly py-2 pl-7">
                            <Text className="text-[18px] font-heading text-white">Nova Recomendação 🎉</Text>
                            <ArrowHorizontal />
                        </View>
                    </View>
                    <View className="w-full flex flex-row bg-[#8257E5]  border border-[#B0B0B01A] h-[6rem] rounded-2xl overflow-hidden">
                            <View className="w-[5rem] h-full flex justify-center items-center">
                                <RaioIcon />
                            </View>
                        <View className="w-auto gap-14 items-center h-full flex flex-row justify-evenly py-2 pl-7">
                            <Text className="text-[18px] font-heading text-white">Nova Recomendação 🎉</Text>
                            <ArrowHorizontal />
                        </View>
                    </View>
                </View> */}
            </View>
        </View>
    )
}