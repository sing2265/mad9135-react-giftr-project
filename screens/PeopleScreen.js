import { View, Text, StyleSheet, FlatList, Pressable, Button } from 'react-native';
import { useData } from '../context/DataContext';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useRef, useState } from 'react';
import CustomModal from '../components/Modal';

export default function PeopleScreen({ navigation }) {
  const [people, setPeople, getPerson, addIdea, deletePerson] = useData([]);
  const [error, setError] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  let itemToDelete = useRef();

  people.sort(sortPeopleBasedOnDate);

  const showModal = (itemId) => {
    itemToDelete.current = itemId;
    setDeleteModalVisible(true);
  };

  const removePerson = (personId) => {
    deletePerson(personId)
      .then(() => {
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        setError(err.message);
        setErrorModalVisible(true);
      });
  }

  const renderRightActions = (item) => {
    return (
      <View>
        <Pressable onPress={() => showModal(item.id)}>
          <MaterialIcons name="delete" size={36} color="red" />
        </Pressable>
      </View>
    );
  };

  const ListItem = ({ item }) => {
    const dateObj = new Date(item.dob);

    let options = {
      month: 'long',
      day: 'numeric',
    };
    let dateString = new Intl.DateTimeFormat('en-CA', options).format(dateObj);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)} rightOpenValue={-100}>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{dateString}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Idea", { id: item.id })}>
            <MaterialIcons name="lightbulb" size={36} color="black" />
          </Pressable>
        </View>
      </Swipeable>
    )
  };

  if (people.length == 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
        <View style={styles.container}>
          <Text style={styles.heading}>People List</Text>
          <Text style={styles.text}>No People Saved Yet</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
        <View style={styles.container}>
          <Text style={styles.heading}>People List</Text>
          <FlatList
            data={people}
            renderItem={ListItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        {deleteModalVisible && <CustomModal type='delete' message='Are you sure you want to delete the Person ?'
          isModalVisible={deleteModalVisible} setModalVisible={setDeleteModalVisible} deleteFunction={() => removePerson(itemToDelete.current)} />}

        {errorModalVisible && <CustomModal type='error' message={error} isModalVisible={errorModalVisible} setModalVisible={setErrorModalVisible} />}
      </SafeAreaView>
    );
  }
}


const sortPeopleBasedOnDate = (a, b) => {
  const [yearA, monthA, dayA] = a.dob.split("-").map(Number);
  const [yearB, monthB, dayB] = b.dob.split("-").map(Number);

  if (monthA === monthB) {
    return dayA - dayB;
  }
  return monthA - monthB;
};

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
    fontSize: 18,
    marginBottom: 4
  },
  listItem: {
    marginBottom: 6,
    flexDirection: 'row',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: "#eaecee"
  }
});