import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Pressable, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from '../context/DataContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomModal from '../components/Modal';

export default function AddIdeaScreen({ navigation, route }) {
  const [idea, setIdea] = useState('');
  const [people, setPeople, getPerson, addIdea] = useData([]);
  const [person, setPerson] = useState();
  const [error, setError] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState();
  const cameraRef = useRef(null);

  useEffect(() => {
    getPerson(route.params.id)
      .then(personObj => {
        setPerson(personObj)
      });
  }, []);

  const takePicture = () => {
    const options = {
      quality: 0.8,
      exif: true,
    };

    cameraRef.current.takePictureAsync(options)
      .then(photo => {
        setPreviewVisible(true);
        setCapturedImage(photo);
      });
  };

  const saveIdea = () => {
    addIdea(idea, capturedImage, route.params.id)
      .then(() => {
        navigation.navigate("Idea", { id: route.params.id})
      })
      .catch((err) => {
        setError(err.message);
        setModalVisible(true);
      });
  }


  if (person != undefined && permission && permission.status === 'granted') {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["right", "bottom", "left"]}>
        <ScrollView style={styles.container}>
          <Text style={styles.heading}>Add Idea for {person.name}</Text>

          <Text style={styles.text}>Gift Idea</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setIdea(text)}
            value={idea}
            autoFocus={true}
          />


          {previewVisible && capturedImage ? (
            <View>
              <Image source={{ uri: capturedImage.uri }} style={styles.camera} />
            </View>
          ) : (
            <CameraView style={styles.camera} facing='back' ref={cameraRef}>
              <Pressable onPress={takePicture}>
                <MaterialIcons name="camera-alt" size={48} color="white" />
              </Pressable>
            </CameraView>
          )}

          {isModalVisible && <CustomModal type='error' message={error} isModalVisible={isModalVisible} setModalVisible={setModalVisible} />}

          <View style={{ backgroundColor: '#007AFF', marginVertical: 20 }}>
            <Button title='Save' color="white" onPress={() => saveIdea()}/>
          </View>
          <View style={{ backgroundColor: '#ea6f6f' }}>
            <Button title='Cancel' color="white" onPress={() => (navigation.navigate("Idea", { id: route.params.id}))} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
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
  input: {
    height: 40,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 40
  },
  camera: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 300,
    height: 400,
    margin: 10,
  },
});