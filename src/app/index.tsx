import { View, Text, TouchableOpacity } from "react-native"
import BackNavigationButtom from "../svg/back-navigation-icon"
import FormField from "./components/input"
import { Button } from "./components/button"
import { router } from "expo-router";


export default function TestCom() {

    function handleNavigationSignUp() {
        router.push("/(stacks)/autentication/sign-up")
    }

    function handleNavigationHome() {
        router.push("/(tabs)/home")
    }
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
                        <FormField title="E-email" />
                        <FormField title="Senha" />
                    </View>
                    <View className="w-full h-auto flex items-end">
                        <TouchableOpacity onPress={handleNavigationSignUp}>
                            <Text className="text-[16.5px] font-subtitle text-white">Esqueceu sua senha?</Text>
                        </TouchableOpacity>
                    </View>
                    <Button onPress={handleNavigationHome} title="Entrar" />
                    <View className="w-full h-auto flex items-center ">
                        <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Não tem uma conta? Inscreva-se</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}