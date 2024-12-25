import React from 'react';
import { Copy, Download, Trash } from 'lucide-react';
import { useContentStore } from '../../store/contentStore';
import { exportContent } from '../../utils/export';
import type { Content } from '../../lib/supabase/services/content/types';

interface ContentActionsProps {
  content: Content;
}

export function ContentActions({ content }: ContentActionsProps) {
  const { duplicateContent } = useContentStore();

  const handleDuplicate = async () => {
    try {
      await duplicateContent(content.id);
    } catch (error) {
      console.error('Error duplicating content:', error);
    }
  };

  const handleExport = async () => {
    const exporter = await exportContent({
      content: content.content,
      type: content.type
    });
    exporter.txt();
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleDuplicate}
        className="p-1 text-gray-600 hover:text-indigo-600"
        title="Duplicate content"
      >
        <Copy className="h-4 w-4" />
      </button>
      <button
        onClick={handleExport}
        className="p-1 text-gray-600 hover:text-indigo-600"
        title="Download content"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}