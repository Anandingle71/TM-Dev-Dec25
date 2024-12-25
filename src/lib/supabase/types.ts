export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          school: string | null
          role: 'Teacher' | 'Principal' | 'Administrator' | null
          subjects: string[] | null
          grades: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          school?: string | null
          role?: 'Teacher' | 'Principal' | 'Administrator' | null
          subjects?: string[] | null
          grades?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          school?: string | null
          role?: 'Teacher' | 'Principal' | 'Administrator' | null
          subjects?: string[] | null
          grades?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          user_id: string
          type: 'lesson-plan' | 'quiz' | 'worksheet' | 'presentation' | 'assessment'
          subject: string
          grade: string
          chapter: string
          content: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'lesson-plan' | 'quiz' | 'worksheet' | 'presentation' | 'assessment'
          subject: string
          grade: string
          chapter: string
          content: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'lesson-plan' | 'quiz' | 'worksheet' | 'presentation' | 'assessment'
          subject?: string
          grade?: string
          chapter?: string
          content?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}