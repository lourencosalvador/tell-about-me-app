import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import PlayIcon from '@/src/svg/play-icon';
import BackButtomIcon from '@/src/svg/back-buttom-icon';
import VideoEmptyIcon from '@/src/svg/video-empty-icon';
import { useUserVideos, useDeleteVideo } from '@/src/services/videos/useVideos';
import { UserVideo } from '@/src/types';
import FavoriteButton from '@/src/components/FavoriteButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const MAX_CONCURRENT_VIDEOS = 4;

interface Props {
    userId: string;
}

const VideoGallery = ({ userId }: Props) => {
    const videoRef = useRef<ExpoVideo>(null);
    const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    
    // React Query hooks
    const { data: videos = [], isLoading: isFetchingVideos, error, refetch } = useUserVideos(userId);
    const deleteVideoMutation = useDeleteVideo();

    const handleVideoPress = useCallback((video: UserVideo) => {
        setSelectedVideo(video);
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
        if (!selectedVideo?.id) return;

        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir este vídeo?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteVideoMutation.mutateAsync(selectedVideo.id);
            handleCloseModal();
        } catch (error) {
                            Alert.alert("Erro", "Não foi possível excluir o vídeo");
        }
                    }
                }
            ]
        );
    }, [selectedVideo, deleteVideoMutation, handleCloseModal]);

    const renderVideoItem = useCallback(({ item }: { item: UserVideo }) => (
        <TouchableOpacity
            onPress={() => handleVideoPress(item)}
            style={styles.videoItem}
            activeOpacity={0.7}
        >
            {item.url ? (
            <ExpoVideo
                source={{ uri: item.url }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isMuted
                    shouldPlay={false}
                    progressUpdateIntervalMillis={500}
                onError={(error) => {
                        console.error("❌ Erro no vídeo:", error);
                        console.error("📹 URL do vídeo:", item.url);
                    }}
                    onLoad={(status) => {
                        console.log("✅ Vídeo carregado:", item.id);
                        console.log("📹 URL:", item.url);
                }}
                    onLoadStart={() => {
                        console.log("⏳ Iniciando carregamento do vídeo:", item.id);
                        console.log("📹 URL:", item.url);
                    }}
                    onPlaybackStatusUpdate={(status) => {
                        if ('error' in status && status.error) {
                            console.error("❌ Erro no playback status:", status.error);
                        }
                        if (status.isLoaded && status.didJustFinish) {
                            console.log("✅ Vídeo terminou");
                        }
                    }}
            />
            ) : (
                <View style={styles.videoPlaceholder}>
                    <VideoEmptyIcon />
                    <Text style={styles.noUrlText}>Sem URL</Text>
                </View>
            )}
            
            {/* Botão de favorito */}
            <View style={styles.favoriteButtonContainer}>
                <FavoriteButton
                    videoId={item.id}
                    videoUrl={item.url}
                    transcription={item.audio?.transcription?.text}
                    size={18}
                    activeColor="#FF4757"
                    inactiveColor="rgba(255, 255, 255, 0.7)"
                />
            </View>
            
            <View style={styles.playIconContainer}>
                <PlayIcon />
            </View>
            {item.duration && (
                <View style={styles.durationContainer}>
                    <Text style={styles.durationText}>
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    ), [handleVideoPress]);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <VideoEmptyIcon />
                <Text style={styles.errorText}>Erro ao carregar vídeos</Text>
                <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                    <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isFetchingVideos ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                    <Text style={styles.loadingText}>Carregando vídeos...</Text>
                </View>
            ) : (
                <FlatList
                    data={videos}
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
                                <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>
                                <Text style={styles.emptySubText}>
                                    Grave seu primeiro vídeo para começar!
                                </Text>
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
                    <View style={styles.modalHeader}>
                    <TouchableOpacity
                            onPress={deleteVideo}
                            style={[styles.actionButton, styles.deleteButton]}
                            activeOpacity={0.7}
                            disabled={deleteVideoMutation.isPending}
                        >
                            {deleteVideoMutation.isPending ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                            <Text style={styles.deleteText}>Excluir vídeo</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCloseModal}
                            style={[styles.actionButton, styles.closeButton]}
                            activeOpacity={0.7}
                        >
                            <BackButtomIcon />
                            <Text style={styles.closeText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>

                    {isVideoLoading && (
                        <ActivityIndicator
                            size="large"
                            color="#FFFFFF"
                            style={styles.loadingIndicator}
                        />
                    )}

                    {selectedVideo?.url && (
                    <ExpoVideo
                        ref={videoRef}
                            source={{ uri: selectedVideo.url }}
                        style={styles.fullScreenVideo}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                            progressUpdateIntervalMillis={500}
                        onLoad={handleVideoLoad}
                        onError={(error) => {
                                console.error("❌ Erro no player:", error);
                                console.error("📹 URL:", selectedVideo.url);
                            }}
                            onPlaybackStatusUpdate={(status) => {
                                if ('error' in status && status.error) {
                                    console.error("❌ Erro no playback status:", status.error);
                                }
                                if (status.isLoaded && status.didJustFinish) {
                                    console.log("✅ Vídeo terminou");
                                }
                        }}
                    />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
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
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2A2A2E',
    },
    favoriteButtonContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
    playIconContainer: {
        position: 'absolute',
        top: '45%',
        left: '45%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
        zIndex: 2,
    },
    durationContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        width: '100%',
        paddingVertical: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContent: {
        gap: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'black',
    },
    modalHeader: {
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 8,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    deleteText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    fullScreenVideo: {
        width: screenWidth,
        height: screenHeight,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 20,
    },
    noUrlText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default React.memo(VideoGallery);