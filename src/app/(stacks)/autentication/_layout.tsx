import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function Layout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="dark" />
        </>
    )
}