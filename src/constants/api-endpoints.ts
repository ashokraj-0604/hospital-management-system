export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
  },
  doctor: {
    appointments: (doctorId: string) => `/doctor/${doctorId}/appointments`,
  },
  patient: {
    appointments: (patientId: string) => `/patient/${patientId}/appointments`,
  },
} as const;
