import HartIcon from "@/src/svg/hart-icon";
import NotificationIcon from "@/src/svg/notification-icon";
import { View, Text, FlatList } from "react-native";
import { YearBlock } from "../components/jornada-items";

const years = [
  { id: '1', title: 'Primeiro Ano', unlocked: true },
  { id: '2', title: 'Segundo Ano', unlocked: false },
  { id: '3', title: 'Terceiro Ano', unlocked: false },
  { id: '4', title: 'Quarto Ano', unlocked: false },
];

export default function Test() {
  return (
    <View className="flex-1 bg-[#161616] pt-8 px-6">
      <FlatList
        data={years}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <YearBlock isLast={index === years.length - 1} title={item.title} unlocked={item.unlocked} />
        )}
        contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="w-full justify-between mb-6 flex-row items-center">
            <Text className="text-[22px] font-heading text-white">Jornada</Text>

            <View className="flex flex-row gap-3">
              <View className="bg-[#1A1A1E] flex flex-row gap-3 w-[5.5rem] items-center justify-center rounded-lg py-2">
                <Text className="text-[22px] font-heading text-white">0</Text>
                <HartIcon />
              </View>

              <View className="bg-[#1A1A1E] relative flex flex-row gap-3 items-center justify-center rounded-lg py-3 px-4">
                <View className="absolute text-center top-0 left-0 flex items-center w-10 z-30 bg-bg-primary rounded-full">
                  <Text className="text-[16px] font-heading text-white">9+</Text>
                </View>
                <NotificationIcon />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
