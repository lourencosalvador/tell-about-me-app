import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/src/store/user';
import { useUpdateProfile, useUploadProfilePhoto } from '@/src/services/user/useUser';

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [tempPhotoUri, setTempPhotoUri] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();
  const uploadPhotoMutation = useUploadProfilePhoto();

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à galeria para selecionar fotos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setTempPhotoUri(selectedImageUri);
        console.log('📸 Imagem selecionada:', selectedImageUri);
      }
    } catch (error) {
      console.error('❌ Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem da galeria');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à câmera para tirar fotos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setTempPhotoUri(selectedImageUri);
        console.log('📸 Foto tirada:', selectedImageUri);
      }
    } catch (error) {
      console.error('❌ Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Alterar foto de perfil',
      'Escolha uma opção:',
      [
        {
          text: 'Galeria',
          onPress: handleSelectImage,
        },
        {
          text: 'Câmera',
          onPress: handleTakePhoto,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    try {
      // Se tem uma nova foto selecionada, fazer upload primeiro
      if (tempPhotoUri) {
        console.log('📸 Fazendo upload da nova foto...');
        await uploadPhotoMutation.mutateAsync(tempPhotoUri);
        setTempPhotoUri(null);
      }

      // Se o nome foi alterado, atualizar o perfil
      if (name !== user.name) {
        console.log('📝 Atualizando nome do perfil...');
        await updateProfileMutation.mutateAsync({ name });
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);

    } catch (error) {
      console.error('❌ Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  const isLoading = updateProfileMutation.isPending || uploadPhotoMutation.isPending;
  const hasChanges = name !== user?.name || tempPhotoUri !== null;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-[#161616]">
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-6 px-6"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2"
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text className="text-white text-xl font-bold flex-1 text-center">
              Editar Perfil
            </Text>
            
            <TouchableOpacity
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
              className="p-2"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons 
                  name="check" 
                  size={24} 
                  color={hasChanges ? "white" : "rgba(255,255,255,0.5)"} 
                />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView className="flex-1 px-6 py-8">
          {/* Foto de perfil */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={showImageOptions}
              disabled={isLoading}
              className="relative"
            >
              <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                <Image
                  source={{ uri: tempPhotoUri || user?.photoUrl }}
                  className="w-full h-full"
                  style={{ backgroundColor: '#2D2D3A' }}
                />
              </View>
              
              <View className="absolute bottom-2 right-2 bg-purple-600 rounded-full p-2">
                <MaterialIcons name="camera-alt" size={16} color="white" />
              </View>

              {uploadPhotoMutation.isPending && (
                <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </TouchableOpacity>

            <Text className="text-gray-400 text-sm mt-3 text-center">
              Toque na foto para alterar
            </Text>
          </View>

          {/* Nome */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-3">
              Nome
            </Text>
            
            <View className="bg-[#1A1A1E] rounded-xl p-4 border border-gray-700">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor="#8E8E93"
                className="text-white text-base"
                editable={!isLoading}
                maxLength={50}
              />
            </View>
          </View>

          {/* Informações do usuário (somente leitura) */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-3">
              Email
            </Text>
            
            <View className="bg-[#1A1A1E] rounded-xl p-4 border border-gray-700 opacity-60">
              <Text className="text-gray-400 text-base">
                {user?.email}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              O email não pode ser alterado
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-white text-lg font-semibold mb-3">
              Turma
            </Text>
            
            <View className="bg-[#1A1A1E] rounded-xl p-4 border border-gray-700 opacity-60">
              <Text className="text-gray-400 text-base">
                {user?.class}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              A turma não pode ser alterada
            </Text>
          </View>

          {/* Botão de salvar (versão alternativa) */}
          {hasChanges && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className="mb-8"
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 px-8 rounded-2xl"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-lg font-semibold text-center">
                    Salvar Alterações
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
} 