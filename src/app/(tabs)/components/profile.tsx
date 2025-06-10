import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from "@/src/store/user";
import { router } from "expo-router";
import { useState } from "react";
import { ProfessionalCVGenerator } from "@/src/app/components/professional-cv-generator";

export default function Profile() {
    const { user, logout } = useAuthStore();
    const [showCVGenerator, setShowCVGenerator] = useState(false);

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    return (
        <View className="flex-1 bg-[#161616] pt-8 px-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
                <Text className="text-white text-2xl font-bold">Perfil</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(stacks)/profile/edit')}
                    className="p-2"
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="edit" size={24} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Profile Card */}
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-2xl p-6 mb-6"
                >
                    <View className="items-center">
                        <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mb-4">
                            <Image
                                source={{ uri: user?.photoUrl }}
                                className="w-full h-full"
                                style={{ backgroundColor: '#2D2D3A' }}
                            />
                        </View>
                        <Text className="text-white text-xl font-bold mb-1">{user?.name}</Text>
                        <Text className="text-white/80 text-sm mb-1">{user?.email}</Text>
                        <Text className="text-white/70 text-sm">Turma: {user?.class}</Text>
                    </View>
                </LinearGradient>

                {/* Stats Cards */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-[#1A1A1E] rounded-xl p-4 flex-1 mr-2 items-center">
                        <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
                        <Text className="text-white text-lg font-bold mt-2">{user?.streak || 0}</Text>
                        <Text className="text-gray-400 text-xs">Sequência</Text>
                    </View>
                    
                    <View className="bg-[#1A1A1E] rounded-xl p-4 flex-1 ml-2 items-center">
                        <MaterialIcons name="star" size={24} color="#FFD700" />
                        <Text className="text-white text-lg font-bold mt-2">85</Text>
                        <Text className="text-gray-400 text-xs">Pontuação</Text>
                    </View>
                </View>

                {/* Menu Options */}
                <View className="space-y-3">
                    {/* CV Generator */}
                    <TouchableOpacity
                        onPress={() => setShowCVGenerator(true)}
                        className="bg-[#1A1A1E] rounded-xl p-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                                <MaterialIcons name="description" size={20} color="#10B981" />
                            </View>
                            <View>
                                <Text className="text-white font-semibold">Gerar Currículo Profissional</Text>
                                <Text className="text-gray-400 text-sm">CV moderno com seus dados e projetos</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    {/* Notifications */}
                    <TouchableOpacity
                        className="bg-[#1A1A1E] rounded-xl p-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-4">
                                <MaterialIcons name="notifications" size={20} color="#3B82F6" />
                            </View>
                            <View>
                                <Text className="text-white font-semibold">Notificações</Text>
                                <Text className="text-gray-400 text-sm">Configurar alertas e lembretes</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    {/* Privacy */}
                    <TouchableOpacity
                        className="bg-[#1A1A1E] rounded-xl p-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center mr-4">
                                <MaterialIcons name="security" size={20} color="#F97316" />
                            </View>
                            <View>
                                <Text className="text-white font-semibold">Privacidade</Text>
                                <Text className="text-gray-400 text-sm">Configurações de privacidade</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    {/* Help */}
                    <TouchableOpacity
                        className="bg-[#1A1A1E] rounded-xl p-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mr-4">
                                <MaterialIcons name="help" size={20} color="#8B5CF6" />
                            </View>
                            <View>
                                <Text className="text-white font-semibold">Ajuda e Suporte</Text>
                                <Text className="text-gray-400 text-sm">Central de ajuda e FAQ</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-[#1A1A1E] rounded-xl p-4 flex-row items-center justify-between mt-6"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-4">
                                <MaterialIcons name="logout" size={20} color="#EF4444" />
                            </View>
                            <View>
                                <Text className="text-red-400 font-semibold">Sair da Conta</Text>
                                <Text className="text-gray-400 text-sm">Fazer logout do aplicativo</Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Professional CV Generator Modal */}
            <ProfessionalCVGenerator
                visible={showCVGenerator}
                onClose={() => setShowCVGenerator(false)}
            />
        </View>
    );
} 