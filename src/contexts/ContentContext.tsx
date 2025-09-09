import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'html';
  section: 'home' | 'services' | 'about' | 'contact';
  lastModified: string;
}

interface ContentContextType {
  content: ContentItem[];
  getContent: (id: string) => string;
  updateContent: (id: string, newContent: string) => void;
  refreshContent: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);

  const refreshContent = () => {
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  };

  useEffect(() => {
    refreshContent();
    
    // Listen for storage changes (when admin updates content)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'websiteContent') {
        refreshContent();
      }
    };
    
    // Also listen for custom events for same-window updates
    const handleContentUpdate = () => {
      refreshContent();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    // Set up polling for immediate updates in same window
    const pollInterval = setInterval(refreshContent, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contentUpdated', handleContentUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const getContent = (id: string): string => {
    const item = content.find(item => item.id === id);
    return item?.content || '';
  };

  const updateContent = (id: string, newContent: string) => {
    const updatedContent = content.map(item =>
      item.id === id 
        ? { ...item, content: newContent, lastModified: new Date().toISOString() }
        : item
    );
    setContent(updatedContent);
    localStorage.setItem('websiteContent', JSON.stringify(updatedContent));
    
    // Trigger custom event for same-window updates
    window.dispatchEvent(new CustomEvent('contentUpdated'));
  };

  return (
    <ContentContext.Provider value={{
      content,
      getContent,
      updateContent,
      refreshContent
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Hook to get specific content with fallback
export const useContentItem = (id: string, fallback: string = '') => {
  const { getContent } = useContent();
  const contentValue = getContent(id);
  return contentValue || fallback;
};