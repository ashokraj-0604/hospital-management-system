import { User } from '../types';

// In-memory storage for demonstration purposes
// Replace with actual database implementation (PostgreSQL, MongoDB, etc.)
const users: Map<string, User> = new Map();

// Initialize with a demo user
const demoUser: User = {
  user_id: 'user-1',
  email: 'admin@hospital.com',
  password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeS8xN56dqaS.O', // hashed 'Admin@1234'
  full_name: 'Admin User',
  role: 'admin',
  hospital_id: 'hospital-1',
  department_id: 'dept-1',
  is_active: true,
  is_mfa_enabled: false,
  avatar_url: 'https://avatar.example.com/admin.jpg',
  login_attempts: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

users.set(demoUser.email, demoUser);

/**
 * Find user by email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = users.get(email);
  return user || null;
};

/**
 * Find user by ID
 */
export const findUserById = async (userId: string): Promise<User | null> => {
  for (const user of users.values()) {
    if (user.user_id === userId) {
      return user;
    }
  }
  return null;
};

/**
 * Update user login attempts
 */
export const updateUserLoginAttempts = async (
  email: string,
  attempts: number,
  lockedUntil?: string
): Promise<void> => {
  const user = users.get(email);
  if (user) {
    user.login_attempts = attempts;
    if (lockedUntil) {
      user.locked_until = lockedUntil;
    }
    users.set(email, user);
  }
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (userId: string): Promise<void> => {
  for (const user of users.values()) {
    if (user.user_id === userId) {
      user.last_login_at = new Date().toISOString();
      users.set(user.email, user);
      break;
    }
  }
};

/**
 * Create new user
 */
export const createUser = async (user: User): Promise<User> => {
  users.set(user.email, user);
  return user;
};

/**
 * Update user
 */
export const updateUser = async (email: string, updates: Partial<User>): Promise<User | null> => {
  const user = users.get(email);
  if (user) {
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    users.set(email, updated);
    return updated;
  }
  return null;
};
