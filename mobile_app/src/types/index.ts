export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  faceDescriptor: string;
}

export interface Attendance {
  _id: string;
  userId: string;
  timestamp: string;
}
