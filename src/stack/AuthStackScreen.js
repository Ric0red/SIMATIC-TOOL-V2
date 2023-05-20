import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Sign from "../screens/Sign";
import Log from "../screens/Log";
import Log2 from "../screens/Log2";

const AuthStackScreen = () => {
  const AuthStack = createNativeStackNavigator();

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Group>
        <AuthStack.Screen name="Log" component={Log} />
        <AuthStack.Screen name="Sign" component={Sign} />
      </AuthStack.Group>

      <AuthStack.Group screenOptions={{ presentation: 'modal'}}>
        <AuthStack.Screen name="Log2" component={Log2} />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
