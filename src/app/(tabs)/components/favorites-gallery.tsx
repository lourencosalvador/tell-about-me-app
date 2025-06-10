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
import { useFavorites } from '@/src/services/favorites/useFavorites';
import FavoriteButton from '@/src/components/FavoriteButton';
import { useToastHelpers } from '@/src/hooks/useToastHelpers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const MAX_CONCURRENT_VIDEOS = 4;

interface Props {
    userId: string;
}

const FavoritesGallery = ({ userId }: Props) => {
    const videoRef = useRef<ExpoVideo>(null);
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    
    // Hook para favoritos
    const { userFavorites, removeFromFavorites } = useFavorites();
    
    // Hook para toasts
    const { showFavoriteRemoved } = useToastHelpers();

    const handleVideoPress = useCallback((favoriteVideo: any) => {
        setSelectedVideo(favoriteVideo);
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

    const removeFavorite = useCallback(async () => {
        if (!selectedVideo?.videoId) return;

        Alert.alert(
            "Remover dos favoritos",
            "Tem certeza que deseja remover este vídeo dos favoritos?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => {
                        removeFromFavorites(selectedVideo.videoId);
                        handleCloseModal();
                        showFavoriteRemoved();
                    }
                }
            ]
        );
    }, [selectedVideo, removeFromFavorites, handleCloseModal, showFavoriteRemoved]);

    const renderVideoItem = useCallback(({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => handleVideoPress(item)}
            style={styles.videoItem}
            activeOpacity={0.7}
        >
            {item.videoUrl ? (
                <ExpoVideo
                    source={{ uri: item.videoUrl }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    isMuted
                    shouldPlay={false}
                    progressUpdateIntervalMillis={500}
                    onError={(error) => {
                        console.error("❌ Erro no vídeo favorito:", error);
                        console.error("📹 URL do vídeo:", item.videoUrl);
                    }}
                    onLoad={(status) => {
                        console.log("✅ Vídeo favorito carregado:", item.videoId);
                        console.log("📹 URL:", item.videoUrl);
                    }}
                    onLoadStart={() => {
                        console.log("⏳ Iniciando carregamento do vídeo favorito:", item.videoId);
                        console.log("📹 URL:", item.videoUrl);
                    }}
                    onPlaybackStatusUpdate={(status) => {
                        if ('error' in status && status.error) {
                            console.error("❌ Erro no playback status:", status.error);
                        }
                        if (status.isLoaded && status.didJustFinish) {
                            console.log("✅ Vídeo favorito terminou");
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
                    videoId={item.videoId}
                    videoUrl={item.videoUrl}
                    transcription={item.transcription}
                    size={18}
                    activeColor="#FF4757"
                    inactiveColor="rgba(255, 255, 255, 0.7)"
                />
            </View>
            
            <View style={styles.playIconContainer}>
                <PlayIcon />
            </View>

            {/* Indicador de favorito */}
            <View style={styles.favoriteIndicator}>
                <Text style={styles.favoriteText}>❤️</Text>
            </View>
        </TouchableOpacity>
    ), [handleVideoPress]);

    return (
        <View style={styles.container}>
            <FlatList
                data={userFavorites}
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
                            <Text style={styles.emptyText}>Nenhum vídeo favorito</Text>
                            <Text style={styles.emptySubText}>
                                Toque no ícone de coração nos seus vídeos para adicioná-los aos favoritos!
                            </Text>
                        </View>
                    </View>
                )}
            />

            <Modal
                visible={!!selectedVideo}
                animationType="fade"
                transparent
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={removeFavorite}
                            style={[styles.actionButton, styles.removeButton]}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.removeText}>Remover dos favoritos</Text>
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

                    {selectedVideo?.videoUrl && (
                        <ExpoVideo
                            ref={videoRef}
                            source={{ uri: selectedVideo.videoUrl }}
                            style={styles.fullScreenVideo}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            progressUpdateIntervalMillis={500}
                            onLoad={handleVideoLoad}
                            onError={(error) => {
                                console.error("❌ Erro no player:", error);
                                console.error("📹 URL:", selectedVideo.videoUrl);
                            }}
                            onPlaybackStatusUpdate={(status) => {
                                if ('error' in status && status.error) {
                                    console.error("❌ Erro no playback status:", status.error);
                                }
                                if (status.isLoaded && status.didJustFinish) {
                                    console.log("✅ Vídeo favorito terminou");
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
    favoriteIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
    },
    favoriteText: {
        fontSize: 12,
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
    removeButton: {
        backgroundColor: '#FF4757',
    },
    closeButton: {
        backgroundColor: 'transparent',
    },
    removeText: {
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

export default React.memo(FavoritesGallery); 