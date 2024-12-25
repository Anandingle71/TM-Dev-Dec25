import { supabase } from '../../client';
import type { ContentFilter } from './types';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export function buildContentQuery(filter?: ContentFilter) {
  let query = supabase
    .from('content')
    .select('*');

  if (filter?.type) {
    query = query.eq('type', filter.type);
  }
  if (filter?.subject) {
    query = query.eq('subject', filter.subject);
  }
  if (filter?.grade) {
    query = query.eq('grade', filter.grade);
  }
  if (filter?.chapter) {
    query = query.eq('chapter', filter.chapter);
  }

  return query as PostgrestFilterBuilder<any, any, any[]>;
}