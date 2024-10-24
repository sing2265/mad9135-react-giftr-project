import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import { Button } from "@rneui/themed";

export default function CustomModal({ type, message, isModalVisible, setModalVisible, deleteFunction }) {
    const [modalText, setModalText] = useState(message);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    if (type === 'error') {
        return (
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{modalText}</Text>
                </View>
            </Modal>
        );
    } else {
        return (
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{modalText}</Text>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Button title='Delete' color='black' onPress={() => deleteFunction()}></Button>
                        <Button title='Cancel' color='black' onPress={() => toggleModal()}></Button>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10
    },
});