import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DataContext = createContext();

function DataProvider(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('people_key').then((people) => {
            people = people === null ? [] : JSON.parse(people);
            setData(people);
        });
    }, []);

    async function addPerson(person) {
        if (person.name === '' || person.dob === '') {
            throw new Error("Name and DOB are required fields!");
        }

        const updatedPeople = [...data, person];
        await AsyncStorage.setItem('people_key', JSON.stringify(updatedPeople));
        setData(updatedPeople);
    }

    async function deletePerson(personId) {
        const filteredPeople = data.filter(person => person.id != personId);
        await AsyncStorage.setItem('people_key', JSON.stringify(filteredPeople));
        setData(filteredPeople);
    }

    async function getPerson(personId) {
        const people = await AsyncStorage.getItem('people_key')
        const peopleList = JSON.parse(people);
        return peopleList.find((person) => person.id === personId);
    }

    async function addIdea(ideaText, imageData, personId) {
        if (ideaText === '' || imageData === undefined) {
            throw new Error("Idea Text and Image are required!");
        }

        const newIdea = {
            "id": Crypto.randomUUID(),
            "text": ideaText,
            "img": imageData.uri,
            "width": imageData.width,
            "height": imageData.height
        }

        const person = data.find((person) => person.id === personId);
        const updatedIdeas = [...person.ideas, newIdea];
        person.ideas = updatedIdeas;
        const personIndex = data.findIndex((person) => person.id === personId)
        data[personIndex] = person;
        const updatedPeople = data;

        await AsyncStorage.setItem('people_key', JSON.stringify(updatedPeople));
        setData(updatedPeople);
    }

    async function deleteIdea(personId, ideaId) {
        const person = data.find((person) => person.id === personId);
        const updatedIdeas = person.ideas.filter(idea => idea.id != ideaId);
        person.ideas = updatedIdeas;
        const personIndex = data.findIndex((person) => person.id === personId)
        data[personIndex] = person;
        const updatedPeople = data;

        await AsyncStorage.setItem('people_key', JSON.stringify(updatedPeople));
        setData(updatedPeople);
    }

    return <DataContext.Provider value={[data, addPerson, getPerson, addIdea, deletePerson, deleteIdea]} {...props} />;
}

function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('Not inside the Provider');
    return context;
}

export { useData, DataProvider };