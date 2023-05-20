import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import MainStackScreen from "./src/stack/MainStackScreen";
import { UserAuthContextProvider } from "./src/context/UserAuthContext";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <UserAuthContextProvider>
        <NavigationContainer>
          <MainStackScreen />
        </NavigationContainer>
      </UserAuthContextProvider>
    </PaperProvider>
  );
}
