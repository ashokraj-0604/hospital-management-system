// src/lib/mock-api.ts
import apiClient from './api-client';

export function enableMockApi() {
  // Intercept every request before it hits the network
  apiClient.interceptors.request.use((config) => {
    (config as any)._mock = true;
    return config;
  });

  apiClient.interceptors.response.use(undefined, async (error) => {
    const config = error.config;
    if (!config?._mock) return Promise.reject(error);

    // ── Login ──────────────────────────────────────────────
    if (config.url?.includes('/auth/')) {
      const body = JSON.parse(config.data);

      if (body.email === 'admin@medsocio.com' && body.password === 'Admin@1234') {
        return {
          data: {
            success: true,
            data: {
              requires_mfa: false,
              user: {
                user_id: 'u-001',
                email: body.email,
                full_name: 'Dr. Admin User',
                role: 'SUPER_ADMIN',
                hospital_id: 'h-001',
                is_mfa_enabled: false,
              },
              tokens: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 900,
              },
            },
          },
        };
      }

      // Test MFA flow
      if (body.email === 'doctor@hospital.com' && body.password === 'Admin@1234') {
        return {
          data: {
            success: true,
            data: {
              requires_mfa: true,
              mfa_session_token: 'mock-mfa-session',
            },
          },
        };
      }

      // Wrong credentials
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid email or password.' } } });
    }

    // ── MFA Verify ─────────────────────────────────────────
    if (config.url?.includes('/auth/mfa/verify')) {
      const body = JSON.parse(config.data);
      if (body.otp_code === '123456') {
        return {
          data: {
            success: true,
            data: {
              requires_mfa: false,
              user: { user_id: 'u-002', email: 'doctor@hospital.com', full_name: 'Dr. Smith', role: 'DOCTOR', hospital_id: 'h-001', is_mfa_enabled: true },
              tokens: { access_token: 'mock-access-token-mfa', refresh_token: 'mock-refresh-token-mfa', expires_in: 900 },
            },
          },
        };
      }
      return Promise.reject({ response: { status: 400, data: { message: 'Invalid or expired OTP.' } } });
    }

    // ── Tenant Branding ────────────────────────────────────
    if (config.url?.includes('/tenants/branding')) {
      return {
        data: {
          success: true,
          data: {
            hospital_id: 'h-001',
            hospital_name: 'Apollo Hospitals',
            app_name: 'Apollo HMS',
            primary_color: '#0057A8',
            secondary_color: '#003876',
            login_tagline: 'Caring for life, enabled by technology.',
            logo_url: '/public/logo_colour.png',
          },
        },
      };
    }

    // ── Logout ─────────────────────────────────────────────
    if (config.url?.includes('/auth/logout')) {
      return { data: { success: true } };
    }

    return Promise.reject(error);
  });
}