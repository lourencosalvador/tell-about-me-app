import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import user from "@/assets/images/studant-bb.jpeg"
import HartIcon from "@/src/svg/hart-icon"
import NotificationButton from "@/src/components/NotificationButton"
import { LinearGradient } from 'expo-linear-gradient';
import Button from "../../components/button";
import TimeHomeIcon from "@/src/svg/time-home-icon";
import ProgressCircle from "../components/progress";
import { useEffect, useState } from "react";
import Card from "../components/card";
import CardRecommendations from "../components/card-recommendations";
import { useAuthStore } from "@/src/store/user";
import { useVideoStore } from "@/src/store/video";
import { useRecommendation } from "@/src/services/recommendations/useRecommendations";
import { useStreakNavigation } from "@/src/services/user/useUser";
import { useFavorites } from "@/src/services/favorites/useFavorites";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from "@/src/hooks/useNotifications";
import NetworkStatus from "@/src/components/NetworkStatus";

export default function Home() {
    const { user: userData } = useAuthStore();
    const [progress, setProgress] = useState(0);
    const { data: dataVideo } = useVideoStore();
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
    const [canGenerateRecommendation, setCanGenerateRecommendation] = useState(false);

    // Inicializar notificações aqui na tela home
    useNotifications();

    // Hook para verificar recomendação existente
    const { data: recommendationData } = useRecommendation(userData?.id || '');

    // Hook para verificar streak e navegação automática
    const streakData = useStreakNavigation();

    // Hook para favoritos
    const { favoriteCount } = useFavorites();

    // Calcular tempo restante para nova recomendação
    useEffect(() => {
        const calculateTimeLeft = () => {
            // Se não há recomendação, pode gerar imediatamente
            if (!recommendationData?.hasRecommendation || !recommendationData?.generatedAt) {
                setTimeLeft('00:00:00');
                setCanGenerateRecommendation(true);
                return;
            }

            const now = new Date();
            const recommendationDate = new Date(recommendationData.generatedAt);
            const nextAllowed = new Date(recommendationDate);
            nextAllowed.setDate(nextAllowed.getDate() + 1); // Próximo dia após a recomendação
            
            const timeDiff = nextAllowed.getTime() - now.getTime();
            
            if (timeDiff <= 0) {
                setTimeLeft('00:00:00');
                setCanGenerateRecommendation(true);
                return;
            }

            setCanGenerateRecommendation(false);
            
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [recommendationData?.hasRecommendation, recommendationData?.generatedAt]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 1 : 0));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Contar recomendações (se tem recomendação = 1, senão 0)
    const recommendationCount = recommendationData?.hasRecommendation ? 1 : 0;

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            {/* Indicador de Status de Rede */}
            <NetworkStatus />
            
            <View className="w-full justify-between mb-6 flex-row items-center h-auto">
                <View className="flex flex-row gap-4 items-center">
                    <View className="w-[3.5rem] h-[3.5rem] overflow-hidden rounded-full border-2 border-bg-primary">
                        <Image source={{ uri: userData?.photoUrl }} className="w-[3.5rem] h-[3.5rem] object-cover" />
                    </View>
                    <Text className="text-[18px] font-heading text-white">Hi, {userData?.name}</Text>
                </View>
                <View className="size-auto flex flex-row gap-3">
                    {/* Card de Streak */}
                    <View className="bg-[#1A1A1E] flex flex-row gap-2 items-center justify-center rounded-lg h-auto py-2 px-3">
                        <MaterialIcons name="local-fire-department" size={20} color="#FF6B35" />
                        <Text className="text-[18px] font-heading text-white">{userData?.streak || 0}</Text>
                    </View>

                    {/* <View className="bg-[#1A1A1E] flex flex-row gap-3 w-[5rem] items-center justify-center rounded-lg h-auto py-2">
                        <Text className="text-[22px] font-heading text-white">2</Text>
                        <HartIcon />
                    </View> */}

                    <NotificationButton />
                </View>
            </View>

            <LinearGradient
                colors={canGenerateRecommendation ? ['#10B981', '#059669'] : ['#8257E5', '#493280']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 14 }}
                className="w-full rounded-2xl p-5 shadow-lg"
            >
                <View className="px-4 py-5 flex gap-6 size-auto">
                    <View className="flex flex-row gap-3">
                        <TimeHomeIcon />
                        <View className="flex">
                            <Text className="text-white font-bold text-lg text-[19px] font-heading">
                                {timeLeft}
                            </Text>
                            <Text className="text-white text-base w-[17rem]">
                                {canGenerateRecommendation 
                                    ? "Você pode gerar uma nova recomendação!" 
                                    : "Tempo para receber recomendação de hoje"
                                }
                            </Text>
                        </View>
                    </View>

                    <Button 
                        title={canGenerateRecommendation ? "Gerar Recomendação" : "Ver Dicas"} 
                        className="bg-[#FFFF]" 
                        classNameText="text-[#FFFF]"
                        onPress={() => router.push('/(tabs)/home/dicas')}
                    />
                </View>
            </LinearGradient>

            <View className="w-full mb-5 h-[6rem] px-5 flex flex-row justify-between items-center bg-[#1A1A1E] mt-7 rounded-lg">
                <Text className="text-[15px] font-heading text-white">35 dias de 365 dias Restantes</Text>
                <ProgressCircle percentage={progress} />
            </View>

            <ScrollView
                showsHorizontalScrollIndicator={true}
                className="w-full h-auto"
            >
                <View className="w-full mb-5 h-auto flex gap-4">
                    <Text className="text-[22px] font-heading text-white">Histórico</Text>
                    <View className="w-full h-auto flex flex-row gap-4">
                        <Card title="Videos Carregados" value={dataVideo?.length || 0}/>
                        <Card title="Recomendações" value={recommendationCount} />
                    </View>
                    <View className="w-full h-auto flex flex-row gap-4">
                        <Card title="Favoritos" value={favoriteCount} />
                        <Card title="Total de Dias" value={progress} />
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

            {/* Botão flutuante para demo de toast */}
            <TouchableOpacity
                onPress={() => router.push('/(stacks)/demo/toast-demo')}
                className="absolute bottom-8 right-6 w-14 h-14 rounded-full items-center justify-center"
                style={{
                    shadowColor: '#8B5CF6',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 12,
                }}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-full h-full rounded-full items-center justify-center"
                >
                    <MaterialIcons name="notifications" size={24} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}