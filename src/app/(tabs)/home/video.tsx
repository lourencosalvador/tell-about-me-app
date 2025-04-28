
import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Camera, useCameraDevice, useCameraDevices, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera'

export default function Video() {

    const device = useCameraDevice("back")
    const { hasPermission, requestPermission } = useCameraPermission()
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission()
    const [permission, setPermission] = useState<null | boolean>(null)
    const cameraRef = useRef<Camera>(null)

    useEffect(() => {
     (async () => {
         const status = await requestPermission()
         const statusMic = await requestMicPermission()

         if(status && statusMic){
            setPermission(true)
         }
     })()
    }, [])


    if(!permission) return <View><Text>Not Permission!</Text></View>
    if(!device) return <View><Text>Not Device!</Text></View>


    return (
        <View className="flex-1 bg-[#161616] pt-20 px-6">
           <Camera 
           style={StyleSheet.absoluteFill}
            ref={cameraRef}
            device={device}
            isActive={true}
            video={true}
            audio={true}
            resizeMode="cover"
           />

           <TouchableOpacity className="w-[70px] h-[70px]
            bg-violet-600 absolute rounded-full bottom-[70px] items-center">

           </TouchableOpacity>
        </View>
    )
}