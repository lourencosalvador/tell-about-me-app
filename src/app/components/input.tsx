import PassIcon from "@/src/svg/pass-icon";
import SMSIcon from "@/src/svg/sms-icon";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  title: string;
  errorMessage?: string;
  otherStyles?: string;
}

const FormField = ({
  title,
  errorMessage,
  otherStyles,
  secureTextEntry,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`gap-3 ${otherStyles}`}>
    <View className="size-auto flex flex-row gap-3 items-center">
    {title === 'E-email' && <SMSIcon /> }
    {title === 'Senha' &&  <PassIcon />}
    <Text className="text-[15px] font-body font-pmedium text-[#6C7278]">{title}</Text>
    </View>
      <View className="w-full h-[3.875rem] px-4 bg-black-100 rounded-2xl bg-[#262626] focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-[#B0B0B0] font-psemibold text-base"
          secureTextEntry={title === "Senha" && !showPassword}
          {...props} 
          autoCorrect={false} 
           autoCapitalize="none"
        />

        {title === "Senha" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              // source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && <Text className="text-red-500">{errorMessage}</Text>}
    </View>
  );
};

export default FormField;