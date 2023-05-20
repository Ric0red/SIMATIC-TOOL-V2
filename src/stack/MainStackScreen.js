import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

//Screens
import Home from "../screens/Home/Home";

const MainStackScreen = () => {
  const MainStack = createMaterialBottomTabNavigator();
  const UserStack = createNativeStackNavigator();

  const screenOptionsUser = ({ route }) => ({
    //tabBarHideOnKeyboard: true,
    headerShown: false,
    //tabBarShowLabel: false,
    //headerShadowVisible: false,
    //headerTransparent: true,
    //tabBarStyle: { elevation: 0, backgroundColor: "#fff" },
    //tabBarActiveTintColor: "#480ca8",
    //tabBarInactiveTintColor: "#adb5bd",
  });

  const UserStackScreen = () => {
    return (
      <UserStack.Navigator screenOptions={screenOptionsUser}>
        <UserStack.Screen name="User" component={Users} />
        <UserStack.Screen name="UsersDetails" component={UserDetails} />
      </UserStack.Navigator>
    );
  };

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size, focused }) => {
      let iconName;

      if (route.name === "Home") {
        //iconName = "ios-home-sharp";
        iconName = "ios-analytics";
      } else if (route.name === "Users") {
        iconName = "ios-person";
      } else if (route.name === "Notify") {
        iconName = "notifications";
      } else if (route.name === "Notifications") {
        iconName = "ios-notifications";
      }

      if (route.name === "Post") {
        return <Ionicons name="ios-add-circle" size={48} color="#ffc300" />;
      }
      return <Ionicons name={iconName} size={24} color={color} />;
    },
    //tabBarHideOnKeyboard: true,
    //headerShown: false,
    //tabBarShowLabel: false,
    //headerShadowVisible: false,
    //headerTransparent: true,
    //tabBarStyle: { elevation: 0, backgroundColor: "#fff" },
    //tabBarActiveTintColor: "#480ca8",
    //tabBarInactiveTintColor: "#adb5bd",
  });

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Group>
        <MainStack.Screen name="Home" component={Home} />
      </MainStack.Group>
      {/* <MainStack.Group screenOptions={{ presentation: "modal" }}>
        <MainStack.Screen name="Users" component={UserStackScreen} />
      </MainStack.Group> */}
    </MainStack.Navigator>
  );
};

export default MainStackScreen;
