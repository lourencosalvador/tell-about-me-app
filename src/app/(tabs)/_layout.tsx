import { Stack, Tabs } from "expo-router";


export default function Layout(){
    return(
        
        <Stack>
            <Stack.Screen name="home" options={{headerShown: false}}/>      
        </Stack>
    )   
}