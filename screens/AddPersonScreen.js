import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { useData } from '../context/DataContext';
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from 'react-native-modern-datepicker';
import * as Crypto from 'expo-crypto';
import CustomModal from '../components/Modal';

export default function AddPersonScreen({ navigation }) {
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [people, addPerson] = useData([]);
  const [error, setError] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const savePerson = () => {
    const date = selectedDate.replaceAll('/', '-')

    const person = {
      "id": Crypto.randomUUID(),
      "name": name,
      "dob": date,
      "ideas": []
    }

    addPerson(person)
      .then(() => {
        navigation.navigate("People")
      })
      .catch((err) => {
        setError(err.message);
        setModalVisible(true);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Add a Person</Text>

        <Text style={styles.text}>Person Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          autoFocus={true}
        />

        <Text style={styles.text}>Date of Birth</Text>
        <DatePicker
          onSelectedChange={date => setSelectedDate(date)}
          current={'1990-01-01'}
          maximumDate={new Date().toDateString()}
          mode="calendar"
        ></DatePicker>

        {isModalVisible && <CustomModal type='error' message={error} isModalVisible={isModalVisible} setModalVisible={setModalVisible}/>}

        <View style={{ backgroundColor: '#007AFF', marginVertical: 20 }}>
          <Button title='Save' color="white" onPress={() => savePerson()} />
        </View>
        <View style={{ backgroundColor: '#ea6f6f' }}>
          <Button title='Cancel' color="white" onPress={() => (navigation.navigate("People"))} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 40
  },
});