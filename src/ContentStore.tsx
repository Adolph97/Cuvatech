import React, { createContext, useContext, useState, useEffect } from 'react';
// Committed default copy — used as the fallback so the site always renders even
// before the API responds or if a key is missing. Kept in sync with content.json.
import defaultContent from '../content.json';

interface ContentContextType {
  content: any;
  setContent: (content: any) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<any>(defaultContent);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data && typeof data === 'object' ? data : defaultContent))
      .catch(err => console.error('Error fetching site content:', err));
  }, []);

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
