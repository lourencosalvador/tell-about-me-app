// components/VideoGallery.tsx
import React, { useRef, useState } from 'react';
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
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'react-native';

import PlayIcon from '@/src/svg/play-icon';
import BackButtomIcon from '@/src/svg/back-buttom-icon';
import { useGetVideos } from '@/src/services/videos/useVideos';
import VideoEmptyIcon from '@/src/svg/video-empty-icon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface Props {
    userId: string;
}

const VideoGallery = ({ userId }: Props) => {
    const videoRef = useRef<Video>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    const { data: videos, isLoading: isFetchingVideos } = useGetVideos(userId);

    const handleVideoPress = (videoId: string) => {
        const videoUrl = `http://172.20.10.14:6000/videos/${videoId}/stream`;
        setSelectedVideo(videoUrl);
        setIsVideoLoading(true);
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
        videoRef.current?.pauseAsync();
    };

    const renderVideoItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => handleVideoPress(item.id)} style={styles.videoItem}>
            <Video
                source={{ uri: `http://SEU_IP:3333/videos/${item.id}/stream` }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
            />
            <View style={styles.playIconContainer}>
                <PlayIcon />
            </View>

        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isFetchingVideos ? (
                <ActivityIndicator size="large" color="#8B5CF6" />
            ) : (
                <FlatList
                    data={videos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    initialNumToRender={videos.length}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderVideoItem}
                    ListEmptyComponent={() => (
                        <View className='flex-1 w-full h-full py-20 flex justify-center items-center'>
                            <View className='flex gap-4 items-center'>
                                <VideoEmptyIcon />
                                <Text className="text-[13px] font-subtitle text-[#ffff]">Não á Videos</Text>
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal visible={!!selectedVideo} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                        <BackButtomIcon />
                        <Text style={styles.closeText}>cancelar</Text>
                    </TouchableOpacity>

                    {isVideoLoading && (
                        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingIndicator} />
                    )}

                    <Video
                        ref={videoRef}
                        source={{ uri: selectedVideo ?? '' }}
                        style={styles.fullScreenVideo}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        onLoad={() => setIsVideoLoading(false)}
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
        height: 200,
    },
    playIconContainer: {
        position: 'absolute',
        top: '45%',
        left: '45%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
        zIndex: 2,
    },
    metaContainer: {
        padding: 8,
    },
    createdAtText: {
        fontSize: 12,
        color: '#888',
    },
    transcriptionText: {
        marginTop: 4,
        fontSize: 13,
        color: '#333',
    },
    noTranscriptionText: {
        marginTop: 4,
        fontSize: 13,
        color: '#aaa',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: 16,
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
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },

    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 20,
    },
});

export default VideoGallery;
