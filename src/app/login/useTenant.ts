'use client';

import { useState, useEffect } from 'react';
import { tenantService } from './login.service';
import { tenantStorage } from '@/src/lib/token.utils';
import { DEFAULT_BRANDING } from '@/src/constants/app.constants';
import type { TenantBranding } from '@/src/types';

// ─── useTenant Hook ───────────────────────────────────────────────────────────

interface TenantHookReturn {
  branding: TenantBranding | null;
  isLoading: boolean;
  error: string | null;
}

export const useTenant = (): TenantHookReturn => {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenantBranding = async () => {
      // Check cache first
      const cached = tenantStorage.get();
      if (cached) {
        setBranding(cached);
        applyBrandingCSS(cached);
        setIsLoading(false);
        return;
      }

      // Resolve subdomain
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      const subdomain = parts.length > 2 ? parts[0] : 'default';

      try {
        const tenantBranding = await tenantService.resolveBranding(subdomain);
        tenantStorage.set(tenantBranding);
        setBranding(tenantBranding);
        applyBrandingCSS(tenantBranding);
      } catch {
        // Fall back to defaults — tenant may not be configured yet
        setError('Could not load hospital branding.');
        const fallback: TenantBranding = {
          hospital_id: '',
          hospital_name: DEFAULT_BRANDING.app_name,
          app_name: DEFAULT_BRANDING.app_name,
          primary_color: DEFAULT_BRANDING.primary_color,
          secondary_color: DEFAULT_BRANDING.secondary_color,
          login_tagline: DEFAULT_BRANDING.login_tagline,
        };
        setBranding(fallback);
        applyBrandingCSS(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenantBranding();
  }, []);

  return { branding, isLoading, error };
};

// ─── Apply CSS Variables from Tenant Branding ────────────────────────────────

function applyBrandingCSS(branding: TenantBranding) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', branding.primary_color);
  root.style.setProperty('--color-secondary', branding.secondary_color);

  // Update favicon
  if (branding.favicon_url) {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = branding.favicon_url;
  }

  // Update page title
  if (branding.app_name) {
    document.title = `${branding.app_name} — Login`;
  }
}
