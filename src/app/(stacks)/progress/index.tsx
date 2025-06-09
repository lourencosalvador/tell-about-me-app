import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from "react-native";
import Video from 'react-native-video';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "@/src/store/user";
import { useUploadVideo } from "@/src/services/videos/useVideos";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width: widthScreen, height: heightScreen } = Dimensions.get("screen");

export default function VideoUpload() {
    const navigation = useNavigation();
    const { user: userData } = useAuthStore();
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const uploadVideoMutation = useUploadVideo();

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
                console.log("📹 Vídeo selecionado da galeria:", selectedVideoUri);
                setVideoUri(selectedVideoUri);
            }
        } catch (error) {
            console.error("❌ Erro ao selecionar vídeo:", error);
            Alert.alert("Erro", "Não foi possível selecionar o vídeo da galeria");
        }
    };

    async function saveVideo() {
        if (!videoUri || !userData?.id) {
            Alert.alert("Erro", "Usuário não logado ou vídeo inválido");
            return;
        }

        try {
            console.log("🔍 Verificando arquivo antes do upload...");
            const fileInfo = await FileSystem.getInfoAsync(videoUri);
            
            if (!fileInfo.exists) {
                throw new Error("Arquivo de vídeo não encontrado no dispositivo");
            }

            if (fileInfo.size === 0) {
                throw new Error("Arquivo de vídeo está vazio");
            }

            console.log("✅ Arquivo verificado, iniciando upload...");

            const result = await uploadVideoMutation.mutateAsync({
                userId: userData.id,
                fileUri: videoUri,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                }
            });

            if (result.success) {
                setVideoUri(null);
                setUploadProgress(0);
                Alert.alert("Sucesso", "Vídeo enviado com sucesso!");
            } else {
                Alert.alert("Erro", result.error || "Erro no upload do vídeo");
            }

        } catch (error) {
            console.error("❌ Erro ao fazer upload:", error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            Alert.alert("Erro", `Erro ao enviar o vídeo: ${errorMessage}`);
        }
    }

    function discardVideo() {
        setVideoUri(null);
        setUploadProgress(0);
    }

    const isUploading = uploadVideoMutation.isPending;

    return (
        <View className="flex-1 bg-[#161616] pt-12 px-6">
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                className="flex flex-row items-center mb-8">
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text className="text-white ml-2 text-lg">Voltar</Text>
            </TouchableOpacity>

            {!videoUri ? (
                <View className="flex-1 justify-center items-center">
                    <TouchableOpacity
                        onPress={pickVideo}
                        className="w-48 h-48 rounded-3xl bg-violet-600/20 border-2 border-dashed border-violet-500 justify-center items-center mb-6">
                        <MaterialIcons name="video-library" size={48} color="#8B5CF6" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-semibold mb-2">Selecione um vídeo</Text>
                    <Text className="text-gray-400 text-center">
                        Toque no ícone acima para escolher{'\n'}um vídeo da sua galeria
                    </Text>
                </View>
            ) : (
                <View className="flex-1">
                    <View className="relative">
                    <Video
    source={{ 
        uri: videoUri,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
            'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
            'Accept-Encoding': 'identity',
            'Range': 'bytes=0-'
        }
    }}
    style={{ width: '100%', height: 300 }}
    className="rounded-2xl"
    resizeMode="cover"
    repeat
    controls
    onBuffer={(buffer) => {
        console.log("🔄 Buffer:", buffer);
        setIsBuffering(buffer.isBuffering);
    }}
    onError={(error) => {
        console.error("❌ Erro no vídeo:", error);
        Alert.alert("Erro", "Não foi possível reproduzir o vídeo");
    }}
/>
                        {isBuffering && (
                            <View className="absolute inset-0 bg-black/50 justify-center items-center">
                                <ActivityIndicator size="large" color="#8B5CF6" />
                                <Text className="text-white mt-2">Carregando vídeo...</Text>
                            </View>
                        )}
                    </View>

                    {isUploading ? (
                        <View className="mt-8 p-6 bg-[#1A1A1E] rounded-2xl">
                            <Text className="text-white text-lg mb-4 text-center">
                                Enviando vídeo... {uploadProgress.toFixed(0)}%
                            </Text>
                            <View className="h-2 bg-gray-700 rounded-full">
                                <View 
                                    className="h-full bg-violet-600 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </View>
                        </View>
                    ) : (
                        <View className="flex-row justify-between mt-8">
                            <TouchableOpacity
                                onPress={saveVideo}
                                className="flex-1 h-14 bg-violet-600 rounded-xl flex-row justify-center items-center mr-3">
                                <MaterialIcons name="cloud-upload" size={24} color="white" className="mr-2" />
                                <Text className="text-white font-semibold ml-2">Enviar Vídeo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={discardVideo}
                                className="flex-1 h-14 bg-red-500 rounded-xl flex-row justify-center items-center ml-3">
                                <MaterialIcons name="delete" size={24} color="white" className="mr-2" />
                                <Text className="text-white font-semibold ml-2">Descartar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}