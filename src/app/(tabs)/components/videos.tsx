import React, { useState, useRef } from 'react';
import { View, FlatList, Image, Modal, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import PlayIcon from '@/src/svg/play-icon';
import BackButtomIcon from '@/src/svg/back-buttom-icon';

const videoData = [
    { id: '1', thumbnail: 'https://picsum.photos/300/200', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '2', thumbnail: 'https://picsum.photos/300/200', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
    { id: '3', thumbnail: 'https://picsum.photos/300/200', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];

const VideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<Video>(null);

    const handleVideoPress = (videoUrl: string) => {
        setSelectedVideo(videoUrl);
        setIsLoading(true);
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
        if (videoRef.current) {
            videoRef.current.pauseAsync();
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={videoData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleVideoPress(item.videoUrl)} style={styles.videoItem}>
                        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                        <View style={styles.playIconContainer}>
                            <PlayIcon />
                        </View>
                    </TouchableOpacity>
                )}
            />
 
            <Modal visible={!!selectedVideo} animationType="fade" transparent>

                <View style={styles.modalContainer} className='relative'>
                    <TouchableOpacity onPress={handleCloseModal} className='flex flex-row gap-2 items-center size-auto absolute top-20 right-8 z-50 '>
                        <BackButtomIcon />
                        <Text className="text-[16px] font-body text-white">cancelar</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loadingIndicator} />
                    )}

                    <Video
                        ref={videoRef}
                        source={{ uri: selectedVideo ?? '' }}
                        style={styles.videoPlayer}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        onLoad={() => setIsLoading(false)} // Desativa o loading quando o vídeo carrega
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoPlayer: {
        width: '100%',
        height: '100%'
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }]
    }
});

export default VideoGallery;
