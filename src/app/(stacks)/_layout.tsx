import React from "react";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function Layout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="autentication" options={{ headerShown: false }} />
                <Stack.Screen name="progress" options={{ headerShown: false }} />
                <Stack.Screen name="maps" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="dark" />
        </>
    )
}