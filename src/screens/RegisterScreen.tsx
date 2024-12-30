import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Get the existing users list from AsyncStorage
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Save the new user to the list
      users.push(data);

      // Store the updated list back to AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Navigate to login screen after successful registration
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.appName}>Ceylon Fitness</Text>
          <Text style={styles.tagline}>Your fitness journey starts here!</Text>
        </View>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Username" value={value} onChangeText={onChange} style={[styles.input, errors.username && styles.inputError]} />
          )}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Email" value={value} onChangeText={onChange} style={[styles.input, errors.email && styles.inputError]} keyboardType="email-address" />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Password" secureTextEntry value={value} onChangeText={onChange} style={[styles.input, errors.password && styles.inputError]} />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Button title="Register" onPress={handleSubmit(onSubmit)} color="#4A90E2" />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  logoContainer: { marginTop: 40, alignItems: 'center' },
  logoImage: { width: 120, height: 120, marginBottom: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4A90E2', marginBottom: 5 },
  tagline: { fontSize: 16, color: '#7f7f7f', marginBottom: 20 },
  input: { width: '100%', height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 15 },
  inputError: { borderColor: 'red' },
  error: { color: 'red', fontSize: 12, marginBottom: 10 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#555' },
  loginLink: { fontSize: 16, color: '#4A90E2', fontWeight: 'bold' },
});

export default RegisterScreen;
