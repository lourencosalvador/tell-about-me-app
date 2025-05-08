import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButtomIcon from "@/src/svg/back-buttom-icon";
import { useNavigation } from "@react-navigation/native";
import PausedVideoIcon from "@/src/svg/paused-video-icon";
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "@/src/store/user";
import { useVideoStore } from "@/src/store/video";
import { Audio } from 'expo-av'

const { width: widthScreen, height: heightScreen } = Dimensions.get("screen");

const VIDEOS_STORAGE_KEY = 'app_videos';

interface VideoMetadata {
    id: string;
    url: string;
    createdAt: Date;
    fileName: string;
    userName: string;
}

export default function Video() {
    const navigation = useNavigation();
    const { user: userData } = useAuthStore();
    const device = useCameraDevice("front");
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [permission, setPermission] = useState(null);
    const cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const {  setData } = useVideoStore();

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            const statusMic = await requestMicPermission();
            if (status && statusMic) {
                setPermission(true);
            }
        })();
    }, []);

    const pickVideo = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para selecionar vídeos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
                videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedVideoUri = result.assets[0].uri;
                setVideoUri(selectedVideoUri);
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Erro ao selecionar vídeo:", error);
            Alert.alert("Erro", "Não foi possível selecionar o vídeo da galeria");
        }
    };

    if (!permission) return <View><Text>Sem permissão de câmera!</Text></View>;
    if (!device || device === null) return <View><Text>Câmera não disponível!</Text></View>;

    async function startRecording() {
        if (!cameraRef.current || !device) return;
        setIsRecording(true);
        cameraRef.current.startRecording({
            onRecordingFinished(video) {
                setIsRecording(false);
                setVideoUri(video.path);
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
        if (!videoUri || !userData?.name) {
            Alert.alert("Erro", "Usuário não logado ou vídeo inválido");
            return;
        }
        
        try {
            setUploading(true);
            setUploadProgress(0);
            
            const fileName = videoUri?.split('/').pop() || `video_${Date.now()}.mp4`;
            const videoId = Date.now().toString();
   
            const newVideo = {
                id: videoId,
                url: videoUri,
                createdAt: new Date(),
                fileName: fileName,
                userName: userData?.name,
            };
            
            const existingVideosString = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);
            let videosArray = existingVideosString ? JSON.parse(existingVideosString) : [];
            
            if (!videosArray.some((video: any) => video.id === newVideo.id)) {
                videosArray.unshift(newVideo);
            }
            
            const uniqueVideos = Array.from(new Map(videosArray.map((video: any) => [video.id, video])).values());
            
            await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(uniqueVideos));
            setData(uniqueVideos);
            
            
            // Simular progresso de upload
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
            
            setTimeout(() => {
                clearInterval(interval);
                setUploading(false);
                setVideoUri(null);
                setModalVisible(false);
                Alert.alert("Sucesso", "Vídeo salvo com sucesso!");
            }, 2000);
            
        } catch (error) {
            console.error("Erro ao salvar vídeo:", error);
            setUploading(false);
            Alert.alert("Erro", "Erro ao salvar o vídeo");
        }
    }

    function discardVideo() {
        setVideoUri(null);
        setModalVisible(false);
    }

    

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
                className="absolute top-8 hover:cursor-pointer right-0 p-4 flex items-center gap-2 flex-row size-auto">
                <BackButtomIcon />
                <Text className="text-bg-primary font-bold">Cancelar</Text>
            </TouchableOpacity>

            {uploading ? (
                <View className="absolute inset-0 bg-black/70 justify-center items-center">
                    <Text className="text-white text-xl mb-2">Salvando vídeo</Text>
                    <Text className="text-white text-base mb-5">Progresso: {uploadProgress.toFixed(0)}%</Text>
                    <ActivityIndicator size="large" color="#8B5CF6" />
                </View>
            ) : (
                <View className="absolute bottom-12 w-full flex-row justify-center items-center gap-8 left-4">
                    <View className="flex items-center">
                        {isRecording ? (
                            <TouchableOpacity
                                onPress={stopRecording}
                                className={`w-[70px] h-[70px] border-4 flex justify-center items-center border-red-500 rounded-full`}
                            >
                                <PausedVideoIcon />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={startRecording}
                                className={`w-[70px] h-[70px] border-4 flex justify-center items-center border-white bg-violet-600 rounded-full`}
                            />
                        )}
                        <Text className="text-white font-bold mt-2">Video</Text>
                    </View>
                    
                    <View className="flex items-center">
                        <TouchableOpacity
                            onPress={pickVideo}
                            className={`w-[70px] h-[70px] border-4 flex justify-center items-center border-white bg-blue-500 rounded-full`}
                        >
                            <Text className="text-white text-3xl">+</Text>
                        </TouchableOpacity>
                        <Text className="text-white font-bold mt-2">Upload</Text>
                    </View>
                </View>
            )}

            {videoUri && modalVisible && (
                <View className="absolute inset-0 bg-black/70 justify-center items-center">
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

                        <View className="absolute top-0 -left-6 p-12 flex flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={saveVideo}
                                className="w-[8rem] gap-1 flex-row h-[3rem] bg-violet-600 rounded-[0.75rem] flex justify-center items-center"
                            >
                                <Text className="text-[#FFFFFF] text-[14px] font-semibold">Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={discardVideo}
                                className="w-[8rem] gap-1 flex-row h-[3rem] bg-red-500 rounded-[0.75rem] flex justify-center items-center"
                            >
                                <Text className="text-[#FFFFFF] text-[14px] font-semibold">Descartar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}