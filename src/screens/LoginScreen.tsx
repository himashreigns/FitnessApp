import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  username: string;
  password: string;
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loginError, setLoginError] = useState<string>('');

  const onSubmit = async (data: FormData) => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const user = users.find(
        (user: { username: string; password: string }) =>
          user.username === data.username && user.password === data.password
      );

      if (user) {
        // Save login state
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        navigation.navigate('Home', { username: data.username });
      } else {
        setLoginError('Incorrect username or password');
      }
    } catch (error) {
      console.error('Error during login', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.appName}>Ceylon Fitness</Text>
          <Text style={styles.tagline}>Welcome Back! Log in to your account</Text>
        </View>

        {/* Username Field */}
        <Controller
          control={control}
          name="username"
          rules={{ required: 'Username is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Username" value={value} onChangeText={onChange} style={[styles.input, errors.username && { borderColor: 'red' }]} autoCapitalize="none" />
          )}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Incorrect Password',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              style={[styles.input, errors.password && { borderColor: 'red' }]}
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        {/* Show login error message if any */}
        {loginError && <Text style={styles.errorText}>{loginError}</Text>}

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Link to Register Screen */}
        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerButtonText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoImage: { width: 100, height: 100, marginBottom: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4A90E2', marginTop: 10 },
  tagline: { fontSize: 14, color: '#555', marginTop: 5, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: '#fff', borderColor: '#ccc' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
  loginButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 14, color: '#555' },
  registerButtonText: { fontWeight: 'bold', color: '#4A90E2' },
});

export default LoginScreen;
