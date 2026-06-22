import {
  Building2,
  Users,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const QUICK_ACTIONS = [
  {
    icon: Building2,
    label: 'Onboard Hospital',
    href: '/super-admin/hospitals',
    color: '#33ABC3',
    bg: '#E8F8FB',
  },
  {
    icon: Users,
    label: 'Manage Users',
    href: '/super-admin/users',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: TrendingUp,
    label: 'View Reports',
    href: '/super-admin/billing',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: ShieldAlert,
    label: 'Audit Logs',
    href: '/super-admin/audit',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];
import {
  UserPlus,
  CalendarPlus,
  Stethoscope,
  BarChart3,
} from 'lucide-react';

export const HOSPITAL_QUICK_ACTIONS = [
  {
    icon: UserPlus,
    label: 'Register Patient',
    href: '/hospital-admin/patients/new',
    color: '#33ABC3',
    bg: '#E8F8FB',
  },
  {
    icon: CalendarPlus,
    label: 'Book Appointment',
    href: '/hospital-admin/appointments/new',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: Stethoscope,
    label: 'Add Doctor',
    href: '/hospital-admin/doctors/new',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: BarChart3,
    label: 'Generate Report',
    href: '/hospital-admin/reports',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];