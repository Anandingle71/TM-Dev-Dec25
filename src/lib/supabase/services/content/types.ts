import type { Database } from '../../types';

export type Content = Database['public']['Tables']['content']['Row'];
export type ContentInsert = Database['public']['Tables']['content']['Insert'];
export type ContentUpdate = Database['public']['Tables']['content']['Update'];

export interface ContentFilter {
  type?: string;
  subject?: string;
  grade?: string;
  chapter?: string;
}