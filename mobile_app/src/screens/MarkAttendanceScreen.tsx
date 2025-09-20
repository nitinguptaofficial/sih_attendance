import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevices,
  CameraDevice,
} from 'react-native-vision-camera';
import Toast from 'react-native-toast-message';
import { attendanceService } from '../services/attendanceService';
import { userService } from '../services/userService';
import { User } from '../types';

const MarkAttendanceScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const devices = useCameraDevices();
  const [device, setDevice] = useState<CameraDevice | undefined>();

  useEffect(() => {
    if (devices.length > 0) {
      setDevice(devices.find(d => d.position === 'front'));
    }
  }, [devices]);

  useEffect(() => {
    checkPermission();
    fetchUsers();
  }, []);

  const checkPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted');
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleMarkAttendance = async () => {
    if (!camera) {
      Toast.show({
        type: 'error',
        text1: 'Camera not ready',
        text2: 'Please wait for camera to initialize',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Take photo
      Toast.show({
        type: 'info',
        text1: 'Taking photo...',
        text2: 'Please stay still',
        visibilityTime: 1000,
      });

      const photo = await camera.takePhoto({
        flash: 'off',
      });

      // Create form data
      const formData = new FormData();
      const photoFile = {
        uri: Platform.OS === 'ios' ? photo.path : `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
      formData.append('photo', photoFile as any);

      const response = await attendanceService.markAttendance(formData);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Attendance marked',
          text2: `Welcome, ${response.user.name}!`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'User not recognized',
          text2: response.message || 'Please try again',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error marking attendance',
        text2:
          error instanceof Error ? error.message : 'Unknown error occurred',
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
      <View style={styles.content}>
        <View style={styles.cameraContainer}>
          {device ? (
            <Camera
              ref={ref => setCamera(ref)}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
              video={false}
              audio={false}
            />
          ) : (
            <Text>No camera device available</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleMarkAttendance}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Mark Attendance'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Look at the camera and tap the button to mark your attendance
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MarkAttendanceScreen;
