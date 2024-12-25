import { supabase } from '../../client';
import { buildContentQuery } from './queries';
import type { Content, ContentInsert, ContentFilter } from './types';

export class ContentService {
  static async saveContent(data: Omit<ContentInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Please sign in to save content');
    }

    // Validate required fields
    if (!data.content?.trim()) {
      throw new Error('Content cannot be empty');
    }
    if (!data.chapter?.trim()) {
      throw new Error('Chapter cannot be empty');
    }

    try {
      // Add retry logic for network issues
      const maxRetries = 3;
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const { data: result, error } = await supabase
          .from('content')
          .insert({
            user_id: user.id,
            ...data,
            metadata: data.metadata || {},
            content: data.content.trim(),
            chapter: data.chapter.trim()
          })
          .select('*')
          .single();

        if (!error) {
          return result;
        }

        lastError = error;
        if (attempt < maxRetries) {
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
      }

      throw new Error(`Failed to save content after ${maxRetries} attempts: ${lastError?.message}`);
    } catch (error) {
      console.error('Error in saveContent:', error);
      throw error;
    }
  }

  static async getRecentContent(filter?: ContentFilter): Promise<Content[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const query = buildContentQuery(filter)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching content:', error);
        throw new Error(`Failed to fetch content: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentContent:', error);
      throw error;
    }
  }
}