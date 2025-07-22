import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import MapaScreen from "./components/MapaScreen";
import AjustesScreen from "./components/AjustesScreen";
import LoginScreen from "./components/LoginScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  if (!isLoggedIn) {
    return <LoginScreen setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Mapa"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            let iconName: any;
            if (route.name === "Mapa") iconName = "map";
            else if (route.name === "Ajustes") iconName = "settings";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#222",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#e0e0e0" },
        })}
      >
        <Tab.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: "Mapa" }}
        />

        <Tab.Screen name="Ajustes">
          {() => <AjustesScreen setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
