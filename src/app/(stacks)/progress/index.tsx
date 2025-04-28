import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert, Modal } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButtomIcon from "@/src/svg/back-buttom-icon";
import { useNavigation } from "@react-navigation/native";
import PausedVideoIcon from "@/src/svg/paused-video-icon";

const { width: widthScreen, height: heightScreen } = Dimensions.get("screen");

// Interface para os metadados do vídeo
interface VideoMetadata {
    id: string;
    url: string;
    createdAt: Date;
    fileName: string;
}

const VIDEOS_STORAGE_KEY = 'app_videos';

export default function Video() {
    const navigation = useNavigation();
    const device = useCameraDevice("back");
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [permission, setPermission] = useState<null | boolean>(null);
    const cameraRef = useRef<Camera>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false)

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videos, setVideos] = useState<VideoMetadata[]>([]);
    const [loading, setLoading] = useState(false);
    const [showVideoList, setShowVideoList] = useState(false);

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            const statusMic = await requestMicPermission();
            if (status && statusMic) {
                setPermission(true);
            }
        })();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const storedVideos = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);

            if (storedVideos) {
                const parsedVideos: VideoMetadata[] = JSON.parse(storedVideos);
                const processedVideos = parsedVideos.map(video => ({
                    ...video,
                    createdAt: new Date(video.createdAt)
                }));

                processedVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                setVideos(processedVideos);
            } else {
                setVideos([]);
            }

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Erro ao buscar vídeos:", error);
            setLoading(false);
        }
    };

    const toggleVideoList = () => {
        if (!showVideoList) {
            fetchVideos();
        }
        setShowVideoList(!showVideoList);
    };

    if (permission) return <View><Text>Sem permissão de câmera!</Text></View>;
    if (!device || device === null) return <View><Text>Câmera não disponível!</Text></View>;

    async function startRecording() {
        if (!cameraRef.current || !device) return;
        setIsRecording(true);
        cameraRef.current.startRecording({
            onRecordingFinished(video) {
                setIsRecording(false);
                setVideoUri(video.path);
                console.log("Video path:", video.path);

                setModalVisible(true);
            },
            onRecordingError: (error) => {
                console.log("Erro na gravação:", error);
                setIsRecording(false);
            }
        });
    }

    async function stopRecording() {
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    }

    async function saveVideo() {
        if (!videoUri) {
            console.log("Nenhum vídeo para salvar");
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            // Iniciar simulação de progresso
            const simulateProgress = () => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 20;
                    setUploadProgress(progress);

                    if (progress >= 100) {
                        clearInterval(interval);
                        finalizarSalvamento();
                    }
                }, 1000); // 5 segundos no total
            };

            // Iniciar simulação
            simulateProgress();

        } catch (error) {
            console.error("Erro ao iniciar processo de salvamento:", error);
            setUploading(false);
            setUploadProgress(0);
        }
    } 


    async function finalizarSalvamento() {
        try {
            // Nome do arquivo extraído do caminho
            const fileName = videoUri?.split('/').pop() || `video_${Date.now()}.mp4`;

            // Criar metadados do vídeo
            const newVideo: VideoMetadata = {
                id: Date.now().toString(),
                url: videoUri!, // Usamos a URL original do vídeo
                createdAt: new Date(),
                fileName: fileName
            };

            // Buscar vídeos existentes
            const existingVideosString = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);
            let videosArray: VideoMetadata[] = [];

            if (existingVideosString) {
                videosArray = JSON.parse(existingVideosString);
            }

            // Adicionar novo vídeo
            videosArray.unshift(newVideo);

            // Salvar no AsyncStorage
            await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videosArray));

            setUploading(false);
            setUploadProgress(0);
            console.log("Vídeo salvo com sucesso!");

            // Limpar o URI do vídeo após salvar
            setVideoUri(null);
        } catch (error) {
            console.error("Erro ao salvar metadados do vídeo:", error);
            setUploading(false);
            console.log("Erro ao salvar as informações do vídeo");
        }
    }

    console.log('videos -->', videos)


    function handleClosedModal() {
        setModalVisible(false)
    }

    const deleteSavedVideo = async (videoId: string) => {
        try {
            setLoading(true);
            
            const updatedVideos = videos.filter(video => video.id !== videoId);
            
            await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
            
            setVideos(updatedVideos);
            
            setLoading(false);
            setModalVisible(false)
            console.log("Vídeo removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover vídeo:", error);
            setLoading(false);
            Alert.alert("Erro", "Não foi possível remover o vídeo");
        }
    };

    const renderVideoItem = ({ item }: { item: VideoMetadata }) => (
        <View className="mb-5 bg-[#262626] w-full h-auto rounded-lg overflow-hidden">
            <ExpoVideo
                source={{ uri: item.url }}
                style={{ width: "100%", height: 200 }}
                className="object-cover"
                resizeMode={ResizeMode.COVER}
                rate={1.0}
                volume={1.0}
                shouldPlay
                isLooping
            />
        </View>
    );

    if (showVideoList) {
        return (
            <View className="flex-1 bg-[#161616] pt-12 px-4">
                <TouchableOpacity
                    className="bg-violet-600 p-3 rounded-md self-start mt-2"
                    onPress={toggleVideoList}
                >
                    <Text className="text-white font-bold">Voltar para Câmera</Text>
                </TouchableOpacity>

                <Text className="text-2xl font-bold text-white my-5 text-center">Meus Vídeos</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#8B5CF6" />
                ) : videos.length > 0 ? (
                    <FlatList
                        data={videos}
                        renderItem={renderVideoItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <Text className="text-white text-center mt-12">Nenhum vídeo encontrado</Text>
                )}
            </View>
        );
    }

    console.log('video her ---> ', videos)

    return (
        <View className="flex-1 bg-[#161616] pt-20 px-6 relative">

            <Camera
                style={StyleSheet.absoluteFill}
                ref={cameraRef}
                device={device}
                isActive={true}
                video={true}
                audio={true}
                resizeMode="cover"
            />

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                className="absolute top-0 hover:cursor-pointer right-0 p-4 flex items-center gap-2 flex-row size-auto">
                <BackButtomIcon />
                <Text className="text-white font-bold">Cancelar</Text>
            </TouchableOpacity>

            {uploading ? (
                <View className="absolute inset-0 bg-black/70 justify-center items-center">
                    <Text className="text-white text-base mb-5">Salvando vídeo: {uploadProgress.toFixed(0)}%</Text>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            ) : (
                <>
                    {isRecording ? (
                        <View className="size-auto flex gap-3 bottom-[50px] left-48 absolute  items-center justify-center">
                            <TouchableOpacity
                                onPress={stopRecording}
                                className={`w-[70px] h-[70px] border-4 flex justify-center items-center border-white rounded-full  ${isRecording ? 'border-2 border-red-500' : ''}`}
                            >
                                <PausedVideoIcon />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="size-auto flex gap-3 bottom-[50px] left-48 absolute  items-center justify-center">
                            <TouchableOpacity
                                onPress={startRecording}

                                className={`w-[70px] h-[70px] border-4 flex justify-center items-center border-white bg-violet-600  rounded-full  ${isRecording ? 'border-2 border-red-500' : ''}`}
                            />
                            <Text className="text-white font-bold">Vídeos</Text>
                        </View>
                    )}
                </>
            )}

            { videoUri && modalVisible && (
                <View
                   className="absolute inset-0 bg-black/70 justify-center items-center"
                >
                    <View className="flex-1 w-screen h-screen">
                        <ExpoVideo
                            source={{ uri: videoUri }}
                            style={{ width: widthScreen, height: heightScreen }}
                            className="object-cover"
                            resizeMode={ResizeMode.COVER}
                            rate={1.0}
                            volume={1.0}
                            shouldPlay
                            isLooping
                        />

                        <View className="absolute top-0 left-0 p-4 flex flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={saveVideo}
                                className="w-[8rem] gap-1 flex-row h-[3rem] bg-bg-primary rounded-[0.75rem] flex justify-center items-center"
                            >
                                <Text className="text-[#FFFFFF] text-[14px] font-semibold">Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => deleteSavedVideo(videoUri)}
                                className="w-[8rem] gap-1 flex-row h-[3rem] bg-red-500 rounded-[0.75rem] flex justify-center items-center"
                            >
                                <Text className="text-[#FFFFFF] text-[14px] font-semibold">Apagar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}