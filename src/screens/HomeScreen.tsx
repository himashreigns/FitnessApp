import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import axios from 'axios';
import { useClickContext } from '../context/ClickContext';

// Define the exercise item type based on the API structure
interface ExerciseItem {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

const HomeScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { username } = route.params;
  const { clickCount, incrementClick } = useClickContext();
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  useEffect(() => {
    // ExerciseDB API URL
    const url = 'https://exercisedb.p.rapidapi.com/exercises';

    // Make the API request to fetch exercises
    axios
      .get(url, {
        headers: {
          'X-RapidAPI-Key': '34dee6143bmsh4f8ca84c1a16d8ep10e76ajsn5151bac6e692', // Replace with your RapidAPI key
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      })
      .then((response) => {
        const fetchedExercises = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          bodyPart: item.bodyPart,
          equipment: item.equipment,
          gifUrl: item.gifUrl,
          target: item.target,
          secondaryMuscles: item.secondaryMuscles,
          instructions: item.instructions,
        }));
        setExercises(fetchedExercises);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load exercises. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Function to render each exercise item
  const renderExerciseItem = ({ item }: { item: ExerciseItem }) => (
    <TouchableOpacity onPress={() => { incrementClick(); setSelectedExercise(item); }}>
      <View style={styles.card}>
        <Image source={{ uri: item.gifUrl }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.bodyPart}>Target: {item.bodyPart}</Text>
          <Text style={styles.description}>Equipment: {item.equipment}</Text>
          <Text style={styles.target}>Target Muscle: {item.target}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Close the modal for selected exercise details
  const closeModal = () => {
    setSelectedExercise(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {username}!</Text>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading exercises...</Text> // Display loading while fetching data
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text> // Show error message if any
      ) : (
        <FlatList
          data={exercises}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Button to show click count */}
      <TouchableOpacity style={styles.floatingButton} onPress={incrementClick}>
        <Text style={styles.floatingButtonText}>{clickCount}</Text>
      </TouchableOpacity>

      {/* Modal for selected exercise */}
      {selectedExercise && (
        <Modal
          visible={!!selectedExercise}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
              <Image source={{ uri: selectedExercise.gifUrl }} style={styles.modalImage} />
              <Text style={styles.modalBody}>Body Part: {selectedExercise.bodyPart}</Text>
              <Text style={styles.modalBody}>Equipment: {selectedExercise.equipment}</Text>
              <Text style={styles.modalBody}>Target: {selectedExercise.target}</Text>
              <Text style={styles.modalBody}>Secondary Muscles: {selectedExercise.secondaryMuscles.join(', ')}</Text>
              <Text style={styles.modalInstructions}>
                Instructions: {selectedExercise.instructions.join(', ')}
              </Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: { fontSize: 20, fontWeight: 'bold' },
  logoutButton: {
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
  },
  logoutButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 100, height: 100, marginRight: 10 },
  cardContent: { flex: 1, padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  bodyPart: { fontSize: 14, color: '#555', marginTop: 5 },
  description: { fontSize: 12, color: '#555' },
  target: { fontSize: 12, color: '#333', marginTop: 5 },
  errorText: { color: 'red', marginTop: 20 },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalImage: { width: 200, height: 200, marginTop: 10 },
  modalBody: { fontSize: 14, marginTop: 10 },
  modalInstructions: { fontSize: 12, marginTop: 10, color: '#777' },
});

export default HomeScreen;
