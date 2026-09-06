import { useState } from 'react';

export const useTagFilter = () => {
  const [activeTagIds, setActiveTagIds] = useState<Set<string>>(new Set());

  const handleToggleTag = (id: string) => {
    setActiveTagIds((prev) => {
      const updated = new Set(prev);
      if (prev.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  return {
    activeTagIds,
    handleToggleTag,
  };
};
