import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HomeIcon from "@/src/svg/home-icon";
import ArrowUpIcon from "@/src/svg/arrow-up";
import VideoIcon from "@/src/svg/video-icon";
import ChatNav from "@/src/svg/chat-icon-nav";
import UserIcon from "@/src/svg/user-icon";
import { router, Tabs } from 'expo-router';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: "#1E1E24",
          borderRadius: 40,
          marginLeft: 15,
          marginRight: 15,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 5 },
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 5
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#9CA3AF"
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon stroke={focused ? "#FFFFFF" : "#9CA3AF"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? "#FFFFFF" : "#9CA3AF", 
              fontSize: 12,
              fontWeight: '500'
            }}>
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="jornada"
        options={{
          tabBarIcon: ({ focused }) => (
            <ArrowUpIcon stroke={focused ? "#FFFFFF" : "#9CA3AF"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? "#FFFFFF" : "#9CA3AF", 
              fontSize: 12,
              fontWeight: '500'
            }}>
              Jornada
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#6C63FF",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -5,
                left: 8,
                shadowColor: "#6C63FF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 8
              }}
            onPress={() => router.push("/(stacks)/progress")}
            >
              <VideoIcon stroke={"#FFFFFF"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="dicas"
        options={{
          tabBarIcon: ({ focused }) => (
            <ChatNav stroke={focused ? "#FFFFFF" : "#9CA3AF"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? "#FFFFFF" : "#9CA3AF", 
              fontSize: 12,
              fontWeight: '500'
            }}>
              Dicas
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <UserIcon stroke={focused ? "#FFFFFF" : "#9CA3AF"} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? "#FFFFFF" : "#9CA3AF", 
              fontSize: 12,
              fontWeight: '500'
            }}>
              Perfil
            </Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;