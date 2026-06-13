import { MfaSession } from '../types';
import crypto from 'crypto';

// In-memory storage for MFA sessions
const mfaSessions: Map<string, MfaSession> = new Map();

// Session expiration time in milliseconds (5 minutes)
const SESSION_EXPIRATION_MS = 5 * 60 * 1000;

/**
 * Create a new MFA session
 */
export const createMfaSession = async (userId: string, email: string): Promise<string> => {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRATION_MS);

  const session: MfaSession = {
    session_id: sessionId,
    userId,
    email,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  mfaSessions.set(sessionId, session);
  return sessionId;
};

/**
 * Get MFA session by token
 */
export const getMfaSession = async (sessionToken: string): Promise<MfaSession | null> => {
  const session = mfaSessions.get(sessionToken);

  if (!session) {
    return null;
  }

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);

  if (now > expiresAt) {
    mfaSessions.delete(sessionToken);
    return null;
  }

  return session;
};

/**
 * Delete MFA session
 */
export const deleteMfaSession = async (sessionToken: string): Promise<void> => {
  mfaSessions.delete(sessionToken);
};

/**
 * Clean up expired sessions (call periodically)
 */
export const cleanupExpiredSessions = async (): Promise<number> => {
  const now = new Date();
  let deletedCount = 0;

  for (const [token, session] of mfaSessions.entries()) {
    const expiresAt = new Date(session.expiresAt);
    if (now > expiresAt) {
      mfaSessions.delete(token);
      deletedCount++;
    }
  }

  return deletedCount;
};
