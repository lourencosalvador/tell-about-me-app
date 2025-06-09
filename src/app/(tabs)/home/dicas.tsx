import Elipse from "@/src/svg/elipse"
import HartIcon from "@/src/svg/hart-icon"
import NotificationButton from "@/src/components/NotificationButton"
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import ArrowVertical from "@/src/svg/arrow-vertical";
import VoiceIcon from "@/src/svg/voice-icon";
import ArrowHorizontal from "@/src/svg/arrow-horizontal";
import RaioIcon from "@/src/svg/raio-icon";
import * as Speech from 'expo-speech';
import { router } from "expo-router";
import { useAuthStore } from "@/src/store/user";
import { useState, useEffect } from "react";
import { useRecommendation, useGenerateRecommendation } from "@/src/services/recommendations/useRecommendations";
import { MaterialIcons } from '@expo/vector-icons';

export default function Dicas() {
    const { user: userData } = useAuthStore();
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Hooks para recomendações
    const { data: recommendationData, isLoading, error, refetch } = useRecommendation(userData?.id || '');
    const generateMutation = useGenerateRecommendation();

    const recommendation = recommendationData?.recommendation;

    const speakText = async () => {
        if (!recommendation?.justificativa) return;
        
        setIsSpeaking(true);
        try {
            await Speech.speak(recommendation.justificativa, {
                language: "pt-BR",
                rate: 0.8,
            });
        } catch (error) {
            console.error('Erro ao falar:', error);
        } finally {
            setIsSpeaking(false);
        }
    };

    const handleGenerateRecommendation = async () => {
        if (!userData?.id) return;

        try {
            await generateMutation.mutateAsync(userData.id);
            Alert.alert('Sucesso!', 'Nova recomendação gerada com sucesso!');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao gerar recomendação';
            Alert.alert('Erro', errorMessage);
        }
    };

    const formatTimeAgo = (dateString?: string) => {
        if (!dateString) return 'Agora mesmo';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora mesmo';
        if (diffInMinutes < 60) return `Há ${diffInMinutes}min`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Há ${diffInHours}h`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `Há ${diffInDays} dia(s)`;
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

                    <NotificationButton />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="flex gap-6">
                    <Text className="text-[22px] font-heading text-white">Hoje</Text>

                    {isLoading ? (
                        <View className="w-full h-32 bg-[#1A1A1E] rounded-lg justify-center items-center">
                            <ActivityIndicator size="large" color="#8257E5" />
                            <Text className="text-white mt-2">Carregando recomendação...</Text>
                        </View>
                    ) : error ? (
                        <View className="w-full h-32 bg-[#1A1A1E] rounded-lg justify-center items-center p-4">
                            <MaterialIcons name="error" size={32} color="#EF4444" />
                            <Text className="text-white mt-2 text-center">Erro ao carregar recomendação</Text>
                            <TouchableOpacity 
                                onPress={() => refetch()}
                                className="mt-2 bg-[#8257E5] px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-sm">Tentar novamente</Text>
                            </TouchableOpacity>
                        </View>
                    ) : !recommendationData?.hasRecommendation ? (
                        <View className="w-full bg-[#1A1A1E] p-6 rounded-lg">
                            <View className="items-center">
                                <MaterialIcons name="lightbulb" size={48} color="#8257E5" />
                                <Text className="text-white text-lg font-heading mt-4 text-center">
                                    Nenhuma recomendação ainda
                                </Text>
                                <Text className="text-gray-400 text-sm mt-2 text-center">
                                    Grave alguns vídeos para receber recomendações personalizadas
                                </Text>
                                
                                <TouchableOpacity 
                                    onPress={handleGenerateRecommendation}
                                    disabled={generateMutation.isPending}
                                    className="mt-6 bg-[#8257E5] px-6 py-3 rounded-lg flex-row items-center"
                                >
                                    {generateMutation.isPending ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <MaterialIcons name="auto-awesome" size={20} color="white" />
                                    )}
                                    <Text className="text-white font-semibold ml-2">
                                        {generateMutation.isPending ? 'Gerando...' : 'Gerar Recomendação'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View className="w-full mb-4 flex flex-row bg-[#493280] h-auto py-8 rounded-lg overflow-hidden">
                            <View className="w-[0.5rem] h-full flex justify-center items-center" />
                            <View className="w-full h-full flex gap-6 py-2">
                                <View className="flex justify-between items-center flex-row w-full px-4">
                                    <Text className="text-[18px] font-heading text-white">Nova Recomendação 🎉</Text>
                                    <View className="mr-4">
                                        <ArrowVertical />
                                    </View>
                                </View>
                                
                                <View className="flex gap-2 w-full px-4">
                                    <Text className="text-[14px] font-heading text-white">
                                        {recommendation?.area_recomendada}
                                    </Text>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        className="w-full h-[17rem]"
                                    >
                                        <Text className="text-[11px] leading-4 font-semibold text-white">
                                            {recommendation?.justificativa} 🖥️
                                        </Text>
                                    </ScrollView>
                                </View>
                                
                                <View className="flex justify-between items-center flex-row w-full px-4">
                                    <Text className="text-[14px] font-heading text-white">
                                        {formatTimeAgo(recommendationData?.generatedAt)}
                                    </Text>
                                    
                                    <View className="flex-row gap-4 items-center">
                                        {isSpeaking ? (
                                            <ActivityIndicator size="small" color="#8258E5" />
                                        ) : (
                                            <TouchableOpacity 
                                                onPress={speakText} 
                                                className="flex flex-row gap-2 items-center"
                                            >
                                                <VoiceIcon />
                                                <Text className="text-[12px] font-heading text-[#B0B0B0]">Ouvir</Text>
                                            </TouchableOpacity>
                                        )}
                                        
                                        <TouchableOpacity 
                                            onPress={handleGenerateRecommendation}
                                            disabled={generateMutation.isPending}
                                            className="flex flex-row gap-1 items-center"
                                        >
                                            <MaterialIcons name="refresh" size={16} color="#B0B0B0" />
                                            <Text className="text-[12px] font-heading text-[#B0B0B0]">
                                                {generateMutation.isPending ? 'Gerando...' : 'Atualizar'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}