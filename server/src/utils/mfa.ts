import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generate a new MFA secret and QR code
 */
export const generateMfaSecret = async (email: string, appName: string = 'HMS Platform') => {
  const secret = speakeasy.generateSecret({
    name: `${appName} (${email})`,
    issuer: appName,
    length: 32,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

  return {
    secret: secret.base32,
    qrCode,
  };
};

/**
 * Verify MFA token (OTP)
 */
export const verifyMfaToken = (secret: string, token: string): boolean => {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });
  } catch (error) {
    return false;
  }
};
