
import AlertIconPerfil from "@/src/svg/alert-icon-perfil"
import ArrowUpIcon from "@/src/svg/arrow-up"
import ConfigIcon from "@/src/svg/config-icon"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import user from "@/assets/images/studant-bb.jpeg"
import CameraPerfilIcon from "@/src/svg/camera-perfil-icon"
import ChatOptionIcon from "@/src/svg/chat-option"
import HartIPerfilIcon from "@/src/svg/hart-perfil-nav"
import { useState } from "react"
import GaleryIcon from "@/src/svg/galery-icon"
import PlayIcon from "@/src/svg/play-icon"
import VideoGallery from "../components/videos"
import { useAuthStore } from "@/src/store/user"
import VideoEmptyIcon from "@/src/svg/video-empty-icon"

export default function Test() {
    const { user: userData } = useAuthStore();
    const [active, setActive] = useState("galery")
    return (
        <View className="flex-1 bg-[#161616] pt-20 px-6">
            <View className="w-full justify-between mb-9 flex-row items-center h-auto">
                <View className="flex flex-row gap-3">
                    <AlertIconPerfil />
                    <TouchableOpacity className="w-[8rem] gap-1  flex-row h-[3rem] bg-bg-primary rounded-[0.75rem] flex justify-center items-center">
                        <Text className={`text-[#FFFFFF] text-[14px] font-semibold`}>Curriculo</Text>
                        <ArrowUpIcon />
                    </TouchableOpacity>
                </View>

                <View className="p-3 rounded-xl bg-[#262626]">
                    <ConfigIcon />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="w-full h-auto"
            >
                <View className="w-full h-auto  flex justify-center items-center ">
                    <View className="size-auto relative mb-4">
                        <View className="w-[8rem] h-[8rem] overflow-hidden rounded-full border-4 border-[#2A2A2E]">
                            <Image source={{ uri: userData?.photoUrl}}  className="w-[8rem] h-[8rem] object-cover" />
                        </View>
                        <View className="p-[0.5rem] rounded-xl bg-[#845AE5] absolute right-0 bottom-0">
                            <CameraPerfilIcon />
                        </View>
                    </View>


                    <View className="flex mb-8 gap-5 w-full h-auto justify-center items-center">
                        <View className="flex gap-2 items-center">
                            <Text className="text-[18px] font-heading text-white">@{userData?.name}</Text>
                            <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Junior Front-End Developer</Text>
                        </View>

                        <View className="flex flex-row gap-4 items-center">
                            <View className="flex gap-3 items-center p-2">
                                <Text className="text-[35px] font-heading text-white">12</Text>
                                <Text className="text-[13px] font-subtitle text-[#B0B0B0]">Videos</Text>
                            </View>

                            <View className="h-[4rem] w-[0.1rem] bg-[#FFFFFF4D]" />

                            <View className="flex gap-3 items-center p-2">
                                <Text className="text-[32px] font-heading text-white">30</Text>
                                <Text className="text-[13px] font-subtitle text-[#B0B0B0]">Recomendação</Text>
                            </View>
                        </View>

                        <TouchableOpacity className="w-[22rem] h-[3rem] bg-[#F6F6F6] flex justify-center items-center flex-row gap-4 rounded-full border-[0.1rem]  border-[#8258E5]">
                            <ChatOptionIcon />
                            <Text className="text-[#8258E5] text-lg">Editar Perdil</Text>
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
                {/* <VideoGallery /> */}
                                        <View className='flex-1 w-full h-full py-20 flex justify-center items-center'>
                                            <View className='flex gap-4 items-center'>
                                                <VideoEmptyIcon />
                                                <Text className="text-[13px] font-subtitle text-[#ffff]">Não á Videos</Text>
                                            </View>
                                        </View>
            </ScrollView>

        </View>
    )
}