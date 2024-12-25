import { supabase } from './client';
import type { Database } from './types';

type Content = Database['public']['Tables']['content']['Row'];
type ContentInsert = Database['public']['Tables']['content']['Insert'];

export class ContentService {
  static async saveContent(data: Omit<ContentInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: result, error } = await supabase
      .from('content')
      .insert({
        user_id: user.id,
        ...data,
        metadata: data.metadata || {},
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving content:', error);
      throw new Error(error.message);
    }

    return result;
  }

  static async getRecentContent(): Promise<Content[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching content:', error);
      throw new Error(error.message);
    }

    return data || [];
  }
}