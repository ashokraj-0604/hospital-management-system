export const ROUTES = {
  home: '/',
  login: '/login',
  admin: {
    dashboard: '/dashboard',
    appointments: '/appointments',
  },
  doctor: {
    dashboard: '/doctor/dashboard',
    appointments: '/doctor/appointments',
    patients: '/doctor/patients',
  },
  patient: {
    dashboard: '/patient/dashboard',
    appointments: '/patient/appointments',
    medicalRecords: '/patient/medical-records',
  },
} as const;
