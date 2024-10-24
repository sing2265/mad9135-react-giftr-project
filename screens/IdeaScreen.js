import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from '../context/DataContext';
import React, { useState } from 'react';
import { Button } from '@rneui/themed';
import CustomModal from '../components/Modal';
import { useFocusEffect } from '@react-navigation/native';

export default function IdeaScreen({ navigation, route }) {
  const [people, setPeople, getPerson, addIdea, deletePerson, deleteIdea] = useData([]);
  const [person, setPerson] = useState();
  const [error, setError] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [ideaRemoved, setIdeaRemoved] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getPerson(route.params.id)
        .then(personObj => {
          setPerson(personObj);
        });
    }, [ideaRemoved])
  );

  const showModal = () => {
    setDeleteModalVisible(true);
  };

  const removeIdea = (personId, ideaId) => {
    deleteIdea(personId, ideaId)
      .then(() => {
        setIdeaRemoved(true);
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        setError(err.message);
        setErrorModalVisible(true);
      });
  }

  const ListItem = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20, borderColor: 'gray', borderWidth: 1 }}>
        <Image source={{ uri: item.img }} style={{ width: 100, height: 150 }} />
        <View>
          <Text style={{ fontSize: 36 }}>{item.text}</Text>
          <Button title='Delete Idea' color='red' onPress={() => showModal()}></Button>
        </View>
        {deleteModalVisible && <CustomModal type='delete' message='Are you sure you want to delete the Idea ?'
          isModalVisible={deleteModalVisible} setModalVisible={setDeleteModalVisible} deleteFunction={() => removeIdea(person.id, item.id)} />}

        {errorModalVisible && <CustomModal type='error' message={error} isModalVisible={errorModalVisible} setModalVisible={setErrorModalVisible} />}

      </View>
    )
  };

  if (person != undefined) {
    if (person.ideas.length == 0) {
      return (
        <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
          <View style={styles.container}>
            <Text style={styles.heading}>Ideas for {person.name}</Text>
            <Text style={styles.text}>No Ideas Yet</Text>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
          <View style={styles.container}>
            <Text style={styles.heading}>Ideas for {person.name}</Text>
            <FlatList
              data={person.ideas}
              renderItem={ListItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </SafeAreaView>
      );
    }
  }
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
    fontSize: 18,
    marginBottom: 4
  },
});