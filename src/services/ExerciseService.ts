import axios from 'axios';

// Replace with your actual RapidAPI key
const API_KEY = '34dee6143bmsh4f8ca84c1a16d8ep10e76ajsn5151bac6e692'; 

const API_URL = 'https://exercisedb.p.rapidapi.com/exercises/';

export const getExercises = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'X-RapidAPI-Key': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
