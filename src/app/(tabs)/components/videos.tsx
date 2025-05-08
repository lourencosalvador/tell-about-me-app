import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlayIcon from '@/src/svg/play-icon';
import BackButtomIcon from '@/src/svg/back-buttom-icon';
import VideoEmptyIcon from '@/src/svg/video-empty-icon';
import { useAuthStore } from '@/src/store/user';
import { useVideoStore } from '@/src/store/video';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface VideoMetadata {
    id: string;
    url: string;
    createdAt: Date;
    fileName: string;
    userName: string;
}

const VIDEOS_STORAGE_KEY = 'app_videos';
const MAX_CONCURRENT_VIDEOS = 4;

interface Props {
    userId: string;
}

const VideoGallery = ({ userId }: Props) => {
    const videoRef = useRef<ExpoVideo>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isFetchingVideos, setIsFetchingVideos] = useState(true);
    const { user: userData } = useAuthStore();
    const { data: dataVideo, setData } = useVideoStore()
    const [localVideos, setLocalVideos] = useState<VideoMetadata[]>([]);

    const fetchVideos = useCallback(async () => {
        setIsFetchingVideos(true);
        try {
            const storedVideos = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);
            if (storedVideos) {
                try {
                    const parsedVideos = JSON.parse(storedVideos);
                    if (!Array.isArray(parsedVideos)) {
                        console.warn("Dados de vídeo não são um array");
                        setLocalVideos([]);
                        setData([]);
                        return;
                    }

                    const userVideos = parsedVideos
                        .filter((video: VideoMetadata) => video.userName === userData?.name)
                        .map((video: any) => ({
                            ...video,
                            createdAt: new Date(video.createdAt),
                            url: video.url.startsWith('file://') ? video.url : `file://${video.url}`
                        }));

                    userVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                    // Atualize ambos os estados
                    setLocalVideos(userVideos);
                    setData(userVideos);
                } catch (jsonError) {
                    console.error("Erro ao parsear vídeos:", jsonError);
                    await AsyncStorage.removeItem(VIDEOS_STORAGE_KEY);
                    setLocalVideos([]);
                    setData([]);
                }
            } else {
                setLocalVideos([]);
                setData([]);
            }
        } catch (error) {
            console.error("Erro ao buscar vídeos:", error);
            setLocalVideos([]);
            setData([]);
        } finally {
            setIsFetchingVideos(false);
        }
    }, [userData?.name, setData]);

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos]);

    const handleVideoPress = useCallback((videoUri: string) => {
        setSelectedVideo(videoUri);
        setIsVideoLoading(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedVideo(null);
        videoRef.current?.pauseAsync();
        videoRef.current?.unloadAsync();
    }, []);

    const handleVideoLoad = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsVideoLoading(false);
        }
    }, []);

    const deleteVideo = useCallback(async () => {
        if (!selectedVideo) return;

        try {
            const updatedVideos = localVideos.filter((video) => video.url !== selectedVideo);
            await AsyncStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
            setLocalVideos(updatedVideos);
            setData(updatedVideos)
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao excluir vídeo:", error);
        }

    }, [selectedVideo, localVideos, handleCloseModal]);

    useEffect(() => {
        setLocalVideos(dataVideo);
    }, [dataVideo]);


    const renderVideoItem = useCallback(({ item }: { item: VideoMetadata }) => (
        <TouchableOpacity
            onPress={() => handleVideoPress(item.url)}
            style={styles.videoItem}
            activeOpacity={0.7}
        >
            <ExpoVideo
                source={{ uri: item.url }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isMuted
                onError={(error) => {
                    console.error("Erro no vídeo:", error);
                    setSelectedVideo(null);
                }}
                onLoadStart={() => console.log(`Carregando: ${item.fileName}`)}
            />
            <View style={styles.playIconContainer}>
                <PlayIcon />
            </View>
        </TouchableOpacity>
    ), [handleVideoPress]);

    return (
        <View style={styles.container}>
            {isFetchingVideos ? (
                <ActivityIndicator size="large" color="#8B5CF6" />
            ) : (
                <FlatList
                    data={localVideos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    initialNumToRender={MAX_CONCURRENT_VIDEOS}
                    maxToRenderPerBatch={MAX_CONCURRENT_VIDEOS}
                    windowSize={5}
                    removeClippedSubviews
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderVideoItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyContent}>
                                <VideoEmptyIcon />
                                <Text style={styles.emptyText}>Não há vídeos</Text>
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal
                visible={!!selectedVideo}
                animationType="fade"
                transparent
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View className='w-full h-auto flex-row justify-between items-center absolute top-12 px-4'>
                    <TouchableOpacity
                            onPress={deleteVideo}
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteText}>Excluir vídeo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCloseModal}
                            style={styles.closeButton}
                            activeOpacity={0.7}
                        >
                            <BackButtomIcon />
                            <Text style={styles.closeText}>cancelar</Text>
                        </TouchableOpacity>
                    </View>


                    {isVideoLoading && (
                        <ActivityIndicator
                            size="large"
                            color="#FFFFFF"
                            style={styles.loadingIndicator}
                        />
                    )}

                    <ExpoVideo
                        ref={videoRef}
                        source={{ uri: selectedVideo ?? '' }}
                        style={styles.fullScreenVideo}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        onLoad={handleVideoLoad}
                        onError={(error) => {
                            console.error("Erro no player:", error);
                            handleCloseModal();
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
        flexGrow: 1,
    },
    videoItem: {
        width: '48%',
        aspectRatio: 9 / 16,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playIconContainer: {
        position: 'absolute',
        top: '45%',
        left: '45%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
        zIndex: 2,
    },
    emptyContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingVertical: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContent: {
        gap: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'black',
    },
    fullScreenVideo: {
        width: screenWidth,
        height: screenHeight,
    },
    closeButton: {

        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
        textTransform: 'lowercase',
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 20,
    },
    deleteButton: {
        zIndex: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#EF4444',
        borderRadius: 8,
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default React.memo(VideoGallery);