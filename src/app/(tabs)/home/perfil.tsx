import AlertIconPerfil from "@/src/svg/alert-icon-perfil"
import ArrowUpIcon from "@/src/svg/arrow-up"
import ConfigIcon from "@/src/svg/config-icon"
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from "react-native"
import CameraPerfilIcon from "@/src/svg/camera-perfil-icon"
import ChatOptionIcon from "@/src/svg/chat-option"
import HartIPerfilIcon from "@/src/svg/hart-perfil-nav"
import { useState } from "react"
import GaleryIcon from "@/src/svg/galery-icon"
import { useAuthStore } from "@/src/store/user"
import { router } from "expo-router"
import VideoGallery from "../components/videos"
import { useUserVideos } from "@/src/services/videos/useVideos"
import BackButtomCv from "@/src/svg/back-buttom-cv"
import HartIcon from "@/src/svg/hart-icon"
import NotificationIcon from "@/src/svg/notification-icon"
import ChatCv from "@/src/svg/chat-cv"
import ButtomCv from "@/src/svg/cv-buttom"
import { ProfessionalCVGenerator } from "../../components/professional-cv-generator"
import { useFavorites } from "@/src/services/favorites/useFavorites"
import NotificationButton from "@/src/components/NotificationButton"
import { useNotificationSender } from "@/src/hooks/useNotifications"
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAchievements } from "@/src/hooks/useAchievements"
import { useChallenges } from "@/src/hooks/useChallenges"
import { useWelcome } from "@/src/hooks/useWelcome"
import { useUserTitle, useUserAchievementTitle } from "@/src/hooks/useUserTitle"

export default function Test() {
    const { user: userData, logout } = useAuthStore();
    const [active, setActive] = useState("galery")
    const { data: userVideos = [] } = useUserVideos(userData?.id || '');
    const { favoriteCount } = useFavorites();
    const [showCVGenerator, setShowCVGenerator] = useState(false);
    const [showConfigDropdown, setShowConfigDropdown] = useState(false);
    
    // Ativar sistema gamificado
    useAchievements();
    useChallenges();
    useWelcome(); // Sistema de boas-vindas
    
    // Obter título do usuário
    const levelTitle = useUserTitle();
    const achievementTitle = useUserAchievementTitle();
    const userTitle = achievementTitle || levelTitle; // Priorizar título por conquistas

    function logoutUser() {
        logout()
        router.push('/(stacks)/autentication')
        setShowConfigDropdown(false)
    }

    function handleEditProfile() {
        router.push('/(stacks)/profile/edit');
    }

    function handlePhotoPress() {
        router.push('/(stacks)/profile/edit');
    }

    function handleStatistics() {
        router.push('/(stacks)/statistics');
        setShowConfigDropdown(false);
    }

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            <View className="w-full justify-between mb-9 flex-row items-center h-auto">
                <View className="flex flex-row gap-3">
                    <AlertIconPerfil />
                    <TouchableOpacity 
                        onPress={() => setShowCVGenerator(true)} 
                        className="w-[8rem] gap-1 flex-row h-[3rem] bg-bg-primary rounded-[0.75rem] flex justify-center items-center"
                    >
                        <Text className={`text-[#FFFFFF] text-[14px] font-semibold`}>Currículo</Text>
                        <ArrowUpIcon />
                    </TouchableOpacity>
                </View>

                <View className="relative">
                    <TouchableOpacity
                        onPress={() => setShowConfigDropdown(!showConfigDropdown)}
                        className="p-3 rounded-xl bg-[#262626]"
                    >
                        <ConfigIcon />
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {showConfigDropdown && (
                        <View className="absolute top-14 right-0 bg-[#1A1A1E] rounded-xl shadow-lg border border-gray-700 min-w-[200px] z-50">
                            <TouchableOpacity
                                onPress={handleStatistics}
                                className="flex-row items-center p-4 border-b border-gray-700"
                            >
                                <MaterialIcons name="analytics" size={20} color="#8B5CF6" />
                                <Text className="text-white ml-3 font-medium">Estatísticas</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={logoutUser}
                                className="flex-row items-center p-4"
                            >
                                <MaterialIcons name="logout" size={20} color="#EF4444" />
                                <Text className="text-red-400 ml-3 font-medium">Sair da Conta</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Overlay para fechar dropdown */}
            {showConfigDropdown && (
                <TouchableOpacity
                    onPress={() => setShowConfigDropdown(false)}
                    className="absolute inset-0 z-40"
                    activeOpacity={1}
                />
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="w-full h-full"
            >
                <View className="w-full h-auto  flex justify-center items-center ">
                    <View className="size-auto relative mb-4">
                        <TouchableOpacity 
                            onPress={handlePhotoPress}
                            activeOpacity={0.8}
                        >
                            <View className="w-[8rem] h-[8rem] overflow-hidden rounded-full border-4 border-[#2A2A2E]">
                                <Image source={{ uri: userData?.photoUrl }} className="w-[8rem] h-[8rem] object-cover" />
                            </View>
                            <View className="p-[0.5rem] rounded-xl bg-[#845AE5] absolute right-0 bottom-0">
                                <CameraPerfilIcon />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="flex mb-8 gap-5 w-full h-auto justify-center items-center">
                        <View className="flex gap-2 items-center">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-[18px] font-heading text-white">@{userData?.name}</Text>
                                <View className="ml-2 flex-row items-center">
                                    <Text className="text-lg">{userTitle.emoji}</Text>
                                    <Text 
                                        className="ml-1 text-[16px] font-bold"
                                        style={{ color: userTitle.color }}
                                    >
                                        {userTitle.title}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-[12px] font-subtitle text-gray-400 text-center">
                                {userTitle.description}
                            </Text>
                        </View>

                        <View className="flex flex-row gap-4 items-center">
                            <View className="flex gap-3 items-center p-2">
                                <Text className="text-[35px] font-heading text-white">{userVideos.length}</Text>
                                <Text className="text-[13px] font-subtitle text-[#B0B0B0]">Videos</Text>
                            </View>

                            <View className="h-[4rem] w-[0.1rem] bg-[#FFFFFF4D]" />

                            <View className="flex gap-3 items-center p-2">
                                <Text className="text-[32px] font-heading text-white">{favoriteCount}</Text>
                                <Text className="text-[13px] font-subtitle text-[#B0B0B0]">Favoritos</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={handleEditProfile}
                            className="w-[22rem] h-[3rem] bg-[#F6F6F6] flex justify-center items-center flex-row gap-4 rounded-full border-[0.1rem]  border-[#8258E5]"
                        >
                            <ChatOptionIcon />
                            <Text className="text-[#8258E5] text-lg">Editar Perfil</Text>
                        </TouchableOpacity>

                        <View className="w-full border-b border-b-[#FFFFFF4D] h-20 flex justify-evenly items-center flex-row">
                            <TouchableOpacity onPress={() => setActive('galery')} className="h-full relative w-24 flex justify-center items-center ">
                                {active === 'galery' &&
                                    <View className="w-full h-1 bottom-0 left-0 absolute  bg-slate-100 rounded-full" />
                                }
                                <GaleryIcon stroke={active === 'galery' ? "#FFFFFF" : "#9CA3AF"} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setActive('hart')} className="h-full w-24 flex justify-center items-center ">
                                <HartIPerfilIcon stroke={active === 'hart' ? "#FFFFFF" : "#9CA3AF"} />
                                {active === 'hart' &&
                                    <View className="w-full h-1 bottom-0 left-0 absolute  bg-slate-100 rounded-full" />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {active === 'galery' ? (
                    <VideoGallery userId={userData?.id ?? ''} />
                ) : (
                    <View className="flex-1 items-center justify-center p-8">
                        <Text className="text-white text-lg">Favoritos em desenvolvimento</Text>
                    </View>
                )}

                {/* Seção de Teste de Notificações - Comentada temporariamente */}
                {/* <TestNotificationSection /> */}
            </ScrollView>

            {/* Professional CV Generator Modal */}
            <ProfessionalCVGenerator
                visible={showCVGenerator}
                onClose={() => setShowCVGenerator(false)}
            />
        </View>
    )
}

// Componente para testar notificações - Comentado temporariamente
/*
function TestNotificationSection() {
    const { sendRecommendationNotification, sendStreakNotification } = useNotificationSender();

    const testRecommendationNotification = async () => {
        await sendRecommendationNotification({
            area_recomendada: "Farmacologia Clínica",
            justificativa: "Baseado nos seus estudos recentes sobre medicamentos e suas interações, recomendamos focar em farmacologia clínica para aprofundar seus conhecimentos."
        });
    };

    const testStreakNotification = async () => {
        await sendStreakNotification(7, 7);
    };

    return (
        <View className="mt-8 p-4 bg-gray-800 rounded-2xl mx-2">
            <Text className="text-white text-lg font-semibold mb-4 text-center">
                🧪 Teste de Notificações
            </Text>
            
            <View className="space-y-3">
                <TouchableOpacity
                    onPress={testRecommendationNotification}
                    className="bg-blue-500 p-3 rounded-xl"
                >
                    <Text className="text-white font-medium text-center">
                        📚 Testar Notificação de Recomendação
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={testStreakNotification}
                    className="bg-orange-500 p-3 rounded-xl"
                >
                    <Text className="text-white font-medium text-center">
                        🔥 Testar Notificação de Streak
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
*/