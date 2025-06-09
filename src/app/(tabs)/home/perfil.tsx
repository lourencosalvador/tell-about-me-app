import AlertIconPerfil from "@/src/svg/alert-icon-perfil"
import ArrowUpIcon from "@/src/svg/arrow-up"
import ConfigIcon from "@/src/svg/config-icon"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import CameraPerfilIcon from "@/src/svg/camera-perfil-icon"
import ChatOptionIcon from "@/src/svg/chat-option"
import HartIPerfilIcon from "@/src/svg/hart-perfil-nav"
import { useState } from "react"
import GaleryIcon from "@/src/svg/galery-icon"
import { useAuthStore } from "@/src/store/user"
import { router } from "expo-router"
import VideoGallery from "../components/videos"
import { useUserVideos } from "@/src/services/videos/useVideos"
import { Modal } from "react-native"
import BackButtomCv from "@/src/svg/back-buttom-cv"
import HartIcon from "@/src/svg/hart-icon"
import NotificationIcon from "@/src/svg/notification-icon"
import ChatCv from "@/src/svg/chat-cv"
import ButtomCv from "@/src/svg/cv-buttom"
import CVGenerator from "../../components/cv-generator"
import { useFavorites } from "@/src/services/favorites/useFavorites"
import NotificationButton from "@/src/components/NotificationButton"
import { useNotificationSender } from "@/src/hooks/useNotifications"

export default function Test() {
    const { user: userData, logout } = useAuthStore();
    const [active, setActive] = useState("galery")
    const { data: userVideos = [] } = useUserVideos(userData?.id || '');
    const { favoriteCount } = useFavorites();
    const [modalVisible, setModalVisible] = useState(false);

    function logoutUser() {
        logout()
        router.push('/(stacks)/autentication')
    }

    function handleEditProfile() {
        router.push('/(stacks)/profile/edit');
    }

    function handlePhotoPress() {
        router.push('/(stacks)/profile/edit');
    }

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            <View className="w-full justify-between mb-9 flex-row items-center h-auto">
                <View className="flex flex-row gap-3">
                    <AlertIconPerfil />
                    <TouchableOpacity onPress={() => setModalVisible(true)} className="w-[8rem] gap-1  flex-row h-[3rem] bg-bg-primary rounded-[0.75rem] flex justify-center items-center">
                        <Text className={`text-[#FFFFFF] text-[14px] font-semibold`}>Curriculo</Text>
                        <ArrowUpIcon />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={logoutUser}
                >
                    <View className="p-3 rounded-xl bg-[#262626]">
                        <ConfigIcon />
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View className="flex-1 bg-[#161616] pt-8 px-6">
                    {/*  */}
                    <View className="flex flex-row w-full justify-between items-center mb-10">
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <BackButtomCv />
                        </TouchableOpacity>

                        <View className="flex flex-row gap-3">
                            <View className="bg-[#1A1A1E] flex flex-row gap-3 w-[5.5rem] items-center justify-center rounded-lg py-2">
                                <Text className="text-[22px] font-heading text-white">0</Text>
                                <HartIcon />
                            </View>

                            <NotificationButton />
                        </View>
                    </View>

                    <View className="flex w-full h-auto gap-2 mb-8">
                    <Text className="text-[12px] font-heading text-[#DADADA]">Currículo Profissional</Text>
                      <Text className="text-[22px] font-heading text-white">Muitos Parabéns, Lorrys 🎉</Text>
                    </View>

                    <View className="flex w-full h-auto gap-8">
                        <ChatCv />
                        <CVGenerator />
                    </View>
                </View>
            </Modal>

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
                            <Text className="text-[18px] font-heading text-white">@{userData?.name}</Text>
                            {/* <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Junior Front-End Developer</Text> */}
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
                    // Mostrar favoritos quando a aba "hart" estiver ativa
                    <View className="py-8">
                        <Text className="text-white text-center text-lg">
                            Em breve: visualização de favoritos aqui
                        </Text>
                    </View>
                )}

                {/* Seção de Teste de Notificações - Comentada temporariamente */}
                {/* <TestNotificationSection /> */}
            </ScrollView>
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