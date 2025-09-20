import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevices,
  CameraDevice,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import { userService } from '../services/userService';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const devices = useCameraDevices();
  const [device, setDevice] = useState<CameraDevice | undefined>();

  useEffect(() => {
    if (devices.length > 0) {
      setDevice(devices.find(d => d.position === 'front'));
    }
  }, [devices]);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted');
  };

  const handleRegister = async () => {
    if (!camera) {
      Toast.show({
        type: 'error',
        text1: 'Camera not ready',
        text2: 'Please wait for camera to initialize',
      });
      return;
    }

    if (!name || !email) {
      Toast.show({
        type: 'error',
        text1: 'Missing information',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Taking photo...');
      const photo = await camera.takePhoto({
        flash: 'off',
      });
      console.log('Photo taken:', photo);

      // TODO: Implement face detection using MLKit or a similar library
      // For now, we'll just simulate the face descriptor
      const mockFaceDescriptor = new Array(128).fill(0);

      console.log('Sending registration request...', {
        name,
        email,
        role,
      });

      const response = await userService.register({
        name,
        email,
        role,
        faceDescriptor: JSON.stringify(mockFaceDescriptor),
      });

      console.log('Registration response:', response);

      Toast.show({
        type: 'success',
        text1: 'Registration successful',
        text2: `User ${name} has been registered`,
      });

      setName('');
      setEmail('');
      setRole('student');
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cameraContainer}>
          {device ? (
            <Camera
              ref={ref => setCamera(ref)}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
              enableZoomGesture={false}
            />
          ) : (
            <Text>No camera device available</Text>
          )}
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'student' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('student')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'student' && styles.roleButtonTextActive,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'teacher' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('teacher')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'teacher' && styles.roleButtonTextActive,
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'admin' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('admin')}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === 'admin' && styles.roleButtonTextActive,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
