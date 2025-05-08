import { View, Text, Image, ScrollView } from "react-native"
import user from "@/assets/images/studant-bb.jpeg"
import HartIcon from "@/src/svg/hart-icon"
import NotificationIcon from "@/src/svg/notification-icon"
import { LinearGradient } from 'expo-linear-gradient';
import Button from "../../components/button";
import TimeHomeIcon from "@/src/svg/time-home-icon";
import ProgressCircle from "../components/progress";
import { useEffect, useState } from "react";
import Card from "../components/card";
import CardRecommendations from "../components/card-recommendations";
import { useAuthStore } from "@/src/store/user";
import { useVideoStore } from "@/src/store/video";

export default function Home() {
    const { user: userData } = useAuthStore();
    const [progress, setProgress] = useState(0);
    const { data: dataVideo } = useVideoStore()

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : 0));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            <View className="w-full justify-between mb-6 flex-row items-center h-auto">
                <View className="flex flex-row gap-4 items-center">
                    <View className="w-[3.5rem] h-[3.5rem] overflow-hidden rounded-full border-2 border-bg-primary">
                        <Image source={{ uri: userData?.photoUrl }} className="w-[3.5rem] h-[3.5rem] object-cover" />
                    </View>
                    <Text className="text-[18px] font-heading text-white">Hi, {userData?.name}</Text>
                </View>
                <View className="size-auto flex flex-row gap-3">
                    <View className="bg-[#1A1A1E] flex flex-row gap-3 w-[5rem] items-center justify-center rounded-lg h-auto py-2">
                        <Text className="text-[22px] font-heading text-white">2</Text>
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

          
                <LinearGradient
                    colors={['#8257E5', '#493280']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 14 }}
                    className="w-full rounded-2xl p-5 shadow-lg"
                >
                    <View className="px-4 py-5 flex gap-6 size-auto">
                        <View className="flex flex-row gap-3">
                            <TimeHomeIcon />
                            <View className="flex">
                                <Text className="text-white font-bold text-lg text-[19px] font-heading">25:09:33</Text>
                                <Text className="text-white text-base w-[17rem]">
                                    Tempo para receber recomendação de hoje
                                </Text>
                            </View>
                        </View>

                        <Button title="Vizualizar" className="bg-[#FFFF]" classNameText="text-[#FFFF]" />
                    </View>
                </LinearGradient>

                <View className="w-full mb-5 h-[6rem] px-5 flex flex-row justify-between items-center bg-[#1A1A1E] mt-7 rounded-lg">
                    <Text className="text-[15px] font-heading text-white">35 dias de 365 dias Restantes  </Text>
                    <ProgressCircle percentage={progress} />
                </View>

                <ScrollView
                showsHorizontalScrollIndicator={true}
                className="w-full h-auto"
            >
                <View className="w-full mb-5 h-auto flex gap-4">
                    <Text className="text-[22px] font-heading text-white">Histórico</Text>
                    <View className="w-full h-auto flex flex-row gap-4">
                        <Card title="Videos Carregados" value={dataVideo?.length}/>
                        <Card title="Recomendações" value={0} />
                    </View>
                </View>
                </ScrollView>

                {/* <View className="w-full h-auto flex gap-4">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-[16px] font-heading text-white">Recomendações Personalizadas</Text>
                        <Text className="text-[12px] font-subtitle text-white">Ver tudo</Text>
                    </View>
                    <View className="w-full h-auto flex gap-4">
                        <CardRecommendations />
                        <CardRecommendations />
                    </View>
                </View> */}
            
        </View>
    )
}