import { View, Text, TouchableOpacity, Alert } from "react-native"
import BackNavigationButtom from "../svg/back-navigation-icon"
import FormField from "./components/input"
import Button from "./components/button"
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/user-auth/user";
import { useAuthStore } from "../store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInSchemaType } from "../schemas/sign-up-schema";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";


export default function TestCom() {
    const { user, token, login, logout } = useAuthStore();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    useEffect(() => {
      // Aguarde até que a navegação esteja pronta
      const timer = setTimeout(() => setIsNavigationReady(true), 100);
      return () => clearTimeout(timer);
    }, []);
  

    const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const { mutateAsync: loginUserFn } = useMutation({
        mutationFn: UserService.loginUser,
        onSuccess: (data: any) => {
            login(data)
        },
        onError: (error: any) => {
            console.error('Error fazendo login:', error)
            Alert.alert('Error ❌', 'Ocorreu um erro ao fazer o login')
        },
    })

    function handleNavigationSignUp() {
        router.push("/(stacks)/autentication/sign-up")
    }

 const onSubmit = async (data: SignInSchemaType) => {
    console.log(data)
       await loginUserFn({
            email: data.email,
            password: data.password
        })
    }

    useEffect(() => {
        if (isNavigationReady && token) {
          router.replace("/(tabs)/home");
        }
      }, [token, isNavigationReady]);
    

    return (
        <View className="flex-1 bg-[#161616] pt-20 px-6">
            <View className="flex gap-8">
                <View className="w-full h-auto flex justify-start">
                    <TouchableOpacity className="hover:cursor-pointer">
                        <BackNavigationButtom />
                    </TouchableOpacity>
                </View>

                <View className="flex gap-5">
                    <View className="w-full justify-center items-center flex gap-1">
                        <Text className="text-[22px] font-subtitle text-white">Bem-vindo de volta!</Text>
                        <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">É ótimo te ver novamente. Sentimos a sua falta!</Text>
                    </View>

                    <View className="flex gap-5">
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <FormField title="E-mail" value={value} onChangeText={onChange} errorMessage={errors.email?.message} />
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <FormField title="Senha" value={value} onChangeText={onChange} secureTextEntry errorMessage={errors.password?.message} />
                            )}
                        />
                    </View>
                    <View className="w-full h-auto flex items-end">
                        <Text className="text-[16.5px] font-subtitle text-white">Esqueceu sua senha?</Text>
                    </View>
                    <Button onPress={handleSubmit(onSubmit)} title="Entrar" />
                    <View className="w-full h-auto flex items-center ">
                        <TouchableOpacity onPress={handleNavigationSignUp}>
                            <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Não tem uma conta? Inscreva-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}