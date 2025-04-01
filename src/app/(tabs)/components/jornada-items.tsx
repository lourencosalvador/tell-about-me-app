import CadeadoIcon from '@/src/svg/cadeado-icon';
import JornadaIcon from '@/src/svg/jornada-icon';
import CVIcon from '@/src/svg/cv-icon';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const years = [
  { id: '1', title: 'Primeiro Ano', unlocked: true },
  { id: '2', title: 'Segundo Ano', unlocked: false },
  { id: '3', title: 'Terceiro Ano', unlocked: false },
  { id: '4', title: 'Quarto Ano', unlocked: false },
];

export const YearBlock = ({ title, unlocked, isLast }: { title: string; unlocked: boolean; isLast: boolean }) => {
  const IconComponent = isLast ? CVIcon : unlocked ? JornadaIcon : CadeadoIcon;

  return (
    <View className="items-center">
      <View className="w-1 h-6 bg-gray-700" />

      <TouchableOpacity
        className={`relative w-40 h-40 rounded-2xl flex items-center justify-center 
          border-2 ${unlocked ? 'border-purple-400' : 'border-gray-700'} 
          ${unlocked ? 'bg-[#1F1E28] shadow-purple-500' : 'bg-gray-800 opacity-50'}`}
      >
        <View className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${unlocked ? 'bg-[#8258E5]' : ''}`}>
          <IconComponent />
        </View>

        <Text className={`text-lg font-bold ${unlocked ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </Text>

        {unlocked && (
          <View className="absolute bottom-0 left-1 rounded-bl-md w-10 h-1 bg-purple-400 rounded-r-md" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const ProgressScreen = () => {
  return (
    <View className="flex-1 bg-black px-6 py-12 items-center">
      <FlatList
        data={years}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <YearBlock title={item.title} unlocked={item.unlocked} isLast={index === years.length - 1} />
        )}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    </View>
  );
};

export default ProgressScreen;
