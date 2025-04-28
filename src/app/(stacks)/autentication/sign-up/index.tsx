import Button from "@/src/app/components/button"
import FormField from "@/src/app/components/input"
import BackNavigationButtom from "@/src/svg/back-navigation-icon"
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchemaType } from "@/src/schemas/sign-up-schema";
import { Controller, useForm } from "react-hook-form";
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from "react";
import { UserService } from "@/src/services/user-auth/user";
import { router } from "expo-router";

export default function SignUp() {
    const navigation = useNavigation();
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

    async function handlePickImage() {
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          
          if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para selecionar uma foto');
            return;
          }
      
          const assets = await MediaLibrary.getAssetsAsync({
            first: 1,
            mediaType: MediaLibrary.MediaType.photo,
            sortBy: ['creationTime'], 
          });
      
          if (assets.assets.length > 0) {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(assets.assets[0].id);
            
            setValue("photo", {
              uri: assetInfo.localUri || assetInfo.uri,
              width: assetInfo.width,
              height: assetInfo.height
            }, { shouldValidate: true });
          }
        } catch (error) {
          console.error('Erro ao selecionar imagem:', error);
          Alert.alert('Erro', 'Não foi possível selecionar a imagem');
        }
      }

    const onSubmit = (data: SignUpSchemaType) => {
     UserService.create(data)
      .then(() => {
        setIsLoading(false)
        reset()
        Alert.alert('success ✅', 'Conta criada com sucesso')
        router.push("/")
      })
      .catch((error) => {
        setIsLoading(false)
        Alert.alert('Error ❌', 'Ocorreu um erro ao criar a conta')
        console.error(error)
      })
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
                                <TouchableOpacity onPress={handlePickImage} className="bg-gray-700 p-4 rounded-lg">
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