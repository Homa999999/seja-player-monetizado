import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/client';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const isDirty = content ? JSON.stringify(content) !== savedSnapshot : false;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getContent();
      setContent(data);
      setSavedSnapshot(JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const patchContent = useCallback((updater) => {
    setContent(prev => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const save = useCallback(async (section, summary) => {
    if (!content) return;
    setSaving(true);
    try {
      const result = await api.saveContent(content, section, summary);
      setSavedSnapshot(JSON.stringify(content));
      setLastSaved(result.updatedAt);
      return result;
    } finally {
      setSaving(false);
    }
  }, [content]);

  const discard = useCallback(() => {
    if (savedSnapshot) setContent(JSON.parse(savedSnapshot));
  }, [savedSnapshot]);

  return (
    <ContentContext.Provider value={{
      content, setContent, loading, saving, lastSaved, isDirty,
      load, save, discard, patchContent
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
