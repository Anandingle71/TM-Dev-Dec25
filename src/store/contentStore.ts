import { create } from 'zustand';
import { ContentService } from '../lib/supabase/services/content/service';
import type { Content, ContentInsert, ContentFilter } from '../lib/supabase/services/content/types';

interface ContentState {
  recentContent: Content[];
  loading: boolean;
  error: string | null;
  fetchRecentContent: (filter?: ContentFilter) => Promise<void>;
  saveContent: (data: Omit<ContentInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  recentContent: [],
  loading: false,
  error: null,

  fetchRecentContent: async (filter?: ContentFilter) => {
    set({ loading: true, error: null });
    try {
      const content = await ContentService.getRecentContent(filter);
      set({ recentContent: content });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch content';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  saveContent: async (data) => {
    set({ loading: true, error: null });
    try {
      await ContentService.saveContent(data);
      // Refresh content list after saving
      const content = await ContentService.getRecentContent();
      set({ recentContent: content });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save content';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));