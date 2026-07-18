import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteInfo } from './types';

const emptySiteInfo: SiteInfo = {
  phone: '',
  email: '',
  address: '',
  openingHours: '',
  closingHours: '',
  socials: {
    x: '',
    tiktok: '',
    instagram: '',
    linkedin: ''
  },
  brandTagline: ''
};

interface SiteInfoContextType {
  siteInfo: SiteInfo;
}

const SiteInfoContext = createContext<SiteInfoContextType | undefined>(undefined);

export function SiteInfoProvider({ children }: { children: React.ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(emptySiteInfo);

  useEffect(() => {
    fetch('/api/site-info')
      .then(res => res.json())
      .then(data => setSiteInfo(data))
      .catch(err => console.error("Error fetching site info:", err));
  }, []);

  return (
    <SiteInfoContext.Provider value={{ siteInfo }}>
      {children}
    </SiteInfoContext.Provider>
  );
}

export function useSiteInfo() {
  const context = useContext(SiteInfoContext);
  if (context === undefined) {
    throw new Error('useSiteInfo must be used within a SiteInfoProvider');
  }
  return context;
}
