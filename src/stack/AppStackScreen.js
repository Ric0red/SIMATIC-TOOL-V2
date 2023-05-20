import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserAuth } from "../context/UserAuthContext";

import AuthStackScreen from './AuthStackScreen';
import MainStackScreen from './MainStackScreen';

const AppStackScreen = () => {
  const { user } = useUserAuth();
  const AppStack = createNativeStackNavigator();

  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      {user ?
        <AppStack.Screen name="Main" component={MainStackScreen} />
        :
        <AppStack.Screen name="Auth" component={AuthStackScreen} />
      }
    </AppStack.Navigator >
  );
};
export default AppStackScreen;
