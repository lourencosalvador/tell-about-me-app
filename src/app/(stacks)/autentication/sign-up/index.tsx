import { Button } from "@/src/app/components/button"
import FormField from "@/src/app/components/input"
import BackNavigationButtom from "@/src/svg/back-navigation-icon"
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native"


export default function SignUp() {
    const navigation = useNavigation();
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

                    <View className="flex gap-5">
                        <FormField title="E-email" />
                        <FormField title="Senha" />
                        <FormField title="Confirmar senha" />
                    </View>
                    <View className="w-full h-auto flex items-end">
                        <Text className="text-[16.5px] font-subtitle text-white">Esqueceu sua senha?</Text>
                    </View>
                    <Button title="Inscrever-se" />
                    <View className="w-full h-auto flex items-center ">
                        <Text className="text-[16.5px] font-subtitle text-[#B0B0B0]">Não tem uma conta? Inscreva-se</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}