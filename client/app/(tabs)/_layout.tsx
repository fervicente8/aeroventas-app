import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='buy-catalog/[cat_brand]'
        options={{
          title: "Comprar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "pricetags" : "pricetags-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='rent-catalog'
        options={{
          title: "Alquilar",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stopwatch" : "stopwatch-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
