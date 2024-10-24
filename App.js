import { DataProvider } from './context/DataContext';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PeopleScreen from './screens/PeopleScreen';
import AddPersonScreen from './screens/AddPersonScreen';
import IdeaScreen from './screens/IdeaScreen';
import AddIdeaScreen from './screens/AddIdeaScreen';
import { Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <DataProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="People">
              <Stack.Screen name="People" component={PeopleScreen}
                options={({ navigation }) => ({
                  headerRight: () => (<Button title='Add Person'
                    onPress={() => { navigation.navigate("AddPerson") }} />)
                })} />
              <Stack.Screen name="AddPerson" component={AddPersonScreen} options={{ title: 'Add Person' }} />
              <Stack.Screen name="Idea" component={IdeaScreen}
                options={({ navigation, route }) => ({
                  headerRight: () => (<Button title='Add Idea'
                    onPress={() => { navigation.navigate("AddIdea", { id: route.params.id }) }} />)
                })}
              />
              <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </DataProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}