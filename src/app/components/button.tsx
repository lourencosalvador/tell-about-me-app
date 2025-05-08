import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from "react-native";

interface ButtomProps extends TouchableOpacityProps {
    title: string
    className?: string
    classNameText?: string
    loading?: boolean
}

export default function Button({ title, className, classNameText, loading, ...props }: ButtomProps) {
    return (
        <TouchableOpacity {...props} className={`w-full h-[4rem]  bg-bg-primary rounded-[0.75rem] flex justify-center items-center ${className}`}>
         {loading ? <ActivityIndicator className=" text-white" /> : <Text className={`text-[#262626] text-[16px] font-semibold ${classNameText}`}>{title}</Text>}
        </TouchableOpacity>
    )
}