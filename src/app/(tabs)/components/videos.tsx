import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Image, Modal, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import PlayIcon from '@/src/svg/play-icon';
import BackButtomIcon from '@/src/svg/back-buttom-icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoMetadata } from '@/src/types';
import { VIDEOS_STORAGE_KEY } from '@/src/lib/key-store';
import VideoEmptyIcon from '@/src/svg/video-empty-icon';

const { width: widthScreen, height: heightScreen } = Dimensions.get("screen");

const VideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<Video>(null);

    const [videos, setVideos] = useState<VideoMetadata[]>([]);
    const [loading, setLoading] = useState(false);
    const [showVideoList, setShowVideoList] = useState(false);

    const handleVideoPress = (videoUrl: string) => {
        setSelectedVideo(videoUrl);
        setIsLoading(true);
    };

    console.log('videos', videos)

    const fetchVideos = async () => {
        try {
            setLoading(true);

            // Buscar vídeos do AsyncStorage
            const storedVideos = await AsyncStorage.getItem(VIDEOS_STORAGE_KEY);

            if (storedVideos) {
                const parsedVideos: VideoMetadata[] = JSON.parse(storedVideos);
                // Converter strings de data para objetos Date
                const processedVideos = parsedVideos.map(video => ({
                    ...video,
                    createdAt: new Date(video.createdAt)
                }));

                // Ordenar por data (mais recentes primeiro)
                processedVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                setVideos(processedVideos);
            } else {
                setVideos([]);
            }

            // Delay simulado para mostrar o loading
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

    useEffect(() => {
        toggleVideoList();
    }, [])

    const handleCloseModal = () => {
        setSelectedVideo(null);
        if (videoRef.current) {
            videoRef.current.pauseAsync();
        }
    };


    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B5CF6" />
            ) : (
                <FlatList
                    data={videos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleVideoPress(item.url)} style={styles.videoItem}>
                            <Video
                                source={{ uri: item.url }}
                                style={{ width: "100%", height: 200 }}
                                className="object-cover"
                                resizeMode={ResizeMode.COVER}
                                rate={1.0}
                                volume={1.0}
                                shouldPlay
                                isLooping
                            />
                            <View style={styles.playIconContainer}>
                                <PlayIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View className='w-full h-full flex justify-center items-center'>
                            <View className='flex gap-4 items-center'>
                                <VideoEmptyIcon />
                                <Text className="text-[13px] font-subtitle text-[#B0B0B0]">Videos</Text>
                            </View>
                        </View>
                    )}
                />

            )}

            <Modal visible={!!selectedVideo} animationType="fade" transparent>

                <View className="flex-1 relative w-screen h-screen">
                    <TouchableOpacity onPress={handleCloseModal} className='flex flex-row gap-2 items-center size-auto absolute top-24 right-8 z-50 '>
                        <BackButtomIcon />
                        <Text className="text-[16px] font-body text-white">cancelar</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingIndicator} />
                    )}

                    <Video
                        ref={videoRef}
                        source={{ uri: selectedVideo ?? '' }}
                        style={{ width: widthScreen, height: heightScreen }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        onLoad={() => setIsLoading(false)}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoItem: {
        position: 'relative',
        width: '48%',
        height: '50%',
        aspectRatio: 9 / 16,
        borderRadius: 10,
        overflow: 'hidden',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    playIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }]
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }]
    }
});

export default VideoGallery;
