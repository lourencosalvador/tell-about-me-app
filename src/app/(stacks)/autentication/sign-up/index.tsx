import Button from "@/src/app/components/button"
import FormField from "@/src/app/components/input"
import BackNavigationButtom from "@/src/svg/back-navigation-icon"
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native"
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchemaType } from "@/src/schemas/sign-up-schema";
import { Controller, useForm } from "react-hook-form";
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";
import { UserService } from "@/src/services/user-auth/user";
import { router, Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "@/src/store/user";
import { MaterialIcons } from '@expo/vector-icons';
import { useToastHelpers } from "@/src/hooks/useToastHelpers";

export default function SignUp() {
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const navigation = useNavigation();
    const { showError, showSuccess, showWarning } = useToastHelpers();
    const [isLoading, setIsLoading] = useState(false)

    const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            class: "",
            password: "",
            photo: undefined,
        }
    });

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma foto.');
            }
        })();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showWarning('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        } else {
            showWarning('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma foto');
        }
    };

    const onSubmit = async (data: SignUpSchemaType) => {
        if (!photoUrl) {
            showError('Erro', 'Não foi possível selecionar a imagem');
            return;
        }

        setIsLoading(true);
        try {
            await UserService.createUser(data, photoUrl);
            showSuccess('success ✅', 'Conta criada com sucesso');
            setIsLoading(false);
            router.push('/');
        } catch (error) {
            showError('Error ❌', 'Ocorreu um erro ao criar a conta');
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#161616] pt-20 px-6">
            <View className="flex gap-8">
                <View className="w-full h-auto flex justify-start">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="hover:cursor-pointer">
                        <BackNavigationButtom />
                    </TouchableOpacity>
                </View>

                <View className="flex gap-5">
                    <View className="w-full justify-center items-center flex gap-1">
                        <Text className="text-[22px] font-subtitle text-white">Crie sua conta </Text>
                        <Text className="text-[16.5px] font-subtitle text-center text-[#B0B0B0]">
                            Junte-se agora e desbloqueie instantaneamente o seu potencial
                        </Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="w-full h-[35rem]"
                    >
                        <View className="flex gap-5">
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <FormField title="Nome" value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
                                )}
                            />

                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <FormField title="E-mail" value={value} onChangeText={onChange} errorMessage={errors.email?.message} />
                                )}
                            />

                            <Controller
                                control={control}
                                name="class"
                                render={({ field: { onChange, value } }) => (
                                    <FormField title="Classe" value={value} onChangeText={onChange} errorMessage={errors.class?.message} />
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <FormField title="Senha" value={value} onChangeText={onChange} secureTextEntry errorMessage={errors.password?.message} />
                                )}
                            />

                            {/* Upload de imagem */}
                            <View className="gap-2">
                                <TouchableOpacity onPress={pickImage} className="bg-gray-700 p-4 rounded-lg">
                                    <Text className="text-center text-white">Selecionar Imagem</Text>
                                </TouchableOpacity>

                                {watch("photo") && (
                                    <Image source={{ uri: watch("photo").uri }} className="w-24 h-24 rounded-full self-center mt-2" />
                                )}

                                {/* {errors.photo && (
                                    <Text className="text-red-500 text-center">{errors.photo.message}</Text>
                                )} */}
                            </View>
                        </View>
                    </ScrollView>
                    <View className="w-full h-auto flex items-end">
                        <Text className="text-[16.5px] font-subtitle text-white">Esqueceu sua senha?</Text>
                    </View>
                    <Button title="Inscrever-se" onPress={handleSubmit(onSubmit)} />
                    <View className="w-full h-auto flex items-center ">
                        <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Não tem uma conta? Inscreva-se</Text>
                    </View>
                </View>


            </View>
        </View>
    )
}